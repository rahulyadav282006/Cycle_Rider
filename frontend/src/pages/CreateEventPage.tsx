import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { CreateEventHeader } from '../components/events/CreateEventHeader';
import {
  CreateEventForm,
  CreateEventFormData,
  CreateEventFormErrors,
} from '../components/events/CreateEventForm';
import { CreateEventSuccess } from '../components/events/CreateEventSuccess';
import { RideEvent, EventStatus } from '../components/events/mockEventsData';
import { eventService, checkpointService, RoutePoint, CheckpointItem } from '../api/services';

export interface CreateEventPageProps {
  onNavigateBack: () => void;
  onSaveEvent?: (event: RideEvent) => void;
  onNavigateEventDetails?: (eventId: string) => void;
}

const DEFAULT_FORM_DATA: CreateEventFormData = {
  eventName: '',
  description: '',
  location: '',
  rideDistance: '',
  rideDate: '',
  startTime: '',
  organizerName: 'Organizer Admin',
  eventStatus: 'draft',
  paymentRequired: false,
};

export const CreateEventPage: React.FC<CreateEventPageProps> = ({
  onNavigateBack,
  onSaveEvent,
  onNavigateEventDetails,
}) => {
  const [formData, setFormData] = useState<CreateEventFormData>(DEFAULT_FORM_DATA);
  const [startLocation, setStartLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [finishLocation, setFinishLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [onMapCheckpoints, setOnMapCheckpoints] = useState<Partial<CheckpointItem>[]>([]);
  const [calculatedDistanceKm, setCalculatedDistanceKm] = useState<number>(0);
  const [calculatedDurationMins, setCalculatedDurationMins] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<CreateEventFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const handleFieldChange = (field: keyof CreateEventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof CreateEventFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation
    const errors: CreateEventFormErrors = {};
    if (!formData.eventName.trim()) errors.eventName = 'Event name is required.';
    const finalLocation = formData.location.trim() || (startLocation?.name ? `${startLocation.name} to ${finishLocation?.name || ''}` : '');
    if (!finalLocation) errors.location = 'Location is required.';
    if (!formData.rideDistance.trim() || Number(formData.rideDistance) <= 0) {
      errors.rideDistance = 'Enter a valid ride distance.';
    }
    if (!formData.rideDate.trim()) errors.rideDate = 'Ride date is required.';
    if (!formData.startTime.trim()) errors.startTime = 'Start time is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    let mappedStatus: EventStatus = 'upcoming';
    if (formData.eventStatus === 'live') {
      mappedStatus = 'active';
    } else if (formData.eventStatus === 'completed') {
      mappedStatus = 'completed';
    } else {
      mappedStatus = 'upcoming';
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const created = await eventService.createEvent({
        eventName: formData.eventName.trim(),
        description: formData.description.trim(),
        location: finalLocation,
        rideDistance: calculatedDistanceKm > 0 ? calculatedDistanceKm : (Number(formData.rideDistance) || 0),
        rideDate: formData.rideDate.trim(),
        startTime: formData.startTime.trim() || '06:00 AM',
        organizerName: formData.organizerName || 'Organizer Admin',
        status: mappedStatus,
        paymentRequired: Boolean(formData.paymentRequired),
        startLocation: startLocation || undefined,
        finishLocation: finishLocation || undefined,
        routePoints: routePoints,
        routeGeometry: routeGeometry,
        distanceKm: calculatedDistanceKm > 0 ? calculatedDistanceKm : undefined,
        estimatedDurationMinutes: calculatedDurationMins > 0 ? calculatedDurationMins : undefined,
      });

      // Persist checkpoints created in the route timeline
      const savedCpIds: string[] = [];
      if (onMapCheckpoints.length > 0) {
        for (let idx = 0; idx < onMapCheckpoints.length; idx++) {
          const cp = onMapCheckpoints[idx];
          if (typeof cp.latitude !== 'number' || typeof cp.longitude !== 'number' || isNaN(cp.latitude) || isNaN(cp.longitude)) {
            console.warn(`Skipping checkpoint "${cp.name}" because location coordinates are missing.`);
            continue;
          }
          const createdCp = await checkpointService
            .createCheckpoint(created.id, {
              name: cp.name || `Checkpoint ${idx + 1}`,
              type: cp.type || 'Standard',
              sequenceNumber: idx + 1,
              mandatory: cp.mandatory !== false,
              latitude: cp.latitude,
              longitude: cp.longitude,
              description: cp.description,
            })
            .catch((err) => {
              console.warn('Could not save checkpoint:', err);
              return null;
            });
          if (createdCp && createdCp.id) {
            savedCpIds.push(createdCp.id);
          }
        }

        if (savedCpIds.length > 0) {
          await eventService
            .updateEvent(created.id, {
              orderedCheckpointIds: savedCpIds,
            })
            .catch(() => {});
        }
      }

      const newEvent: RideEvent = {
        id: created.id,
        name: created.eventName,
        date: created.rideDate,
        location: created.location,
        distanceKm: created.rideDistance,
        riderCount: created.riderCount || 0,
        status: mappedStatus,
        tagline: created.description || 'Newly created cycling event',
      };

      setCreatedEventId(created.id);
      onSaveEvent?.(newEvent);
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err?.message || 'Failed to create event. Please verify backend connection.';
      setFormErrors({ eventName: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (createdEventId && onNavigateEventDetails) {
      onNavigateEventDetails(createdEventId);
    } else {
      onNavigateBack();
    }
  };

  return (
    <PageContainer>
      {/* 1. Header with Breadcrumb and Back Action */}
      <CreateEventHeader onBack={onNavigateBack} />

      {/* 2. Form View or Success View */}
      {isSuccess ? (
        <CreateEventSuccess
          eventData={formData}
          onContinueToEvent={handleContinue}
          onBackToEvents={onNavigateBack}
        />
      ) : (
        <CreateEventForm
          formData={formData}
          formErrors={formErrors}
          startLocation={startLocation}
          finishLocation={finishLocation}
          onStartLocationChange={setStartLocation}
          onFinishLocationChange={setFinishLocation}
          routePoints={routePoints}
          routeGeometry={routeGeometry}
          checkpoints={onMapCheckpoints}
          onRoutePointsChange={setRoutePoints}
          onRouteGeometryChange={(geometry, dist, dur) => {
            setRouteGeometry(geometry);
            if (dist > 0) {
              setCalculatedDistanceKm(dist);
              setFormData((prev) => ({ ...prev, rideDistance: String(dist) }));
            }
            if (dur > 0) {
              setCalculatedDurationMins(dur);
            }
          }}
          onCheckpointsChange={setOnMapCheckpoints}
          isSubmitting={isSubmitting}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onCancel={onNavigateBack}
        />
      )}
    </PageContainer>
  );
};
