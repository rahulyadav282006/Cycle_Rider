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
import { eventService } from '../api/services';

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
};

export const CreateEventPage: React.FC<CreateEventPageProps> = ({
  onNavigateBack,
  onSaveEvent,
  onNavigateEventDetails,
}) => {
  const [formData, setFormData] = useState<CreateEventFormData>(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState<CreateEventFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const handleFieldChange = (field: keyof CreateEventFormData, value: string) => {
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
    if (!formData.location.trim()) errors.location = 'Location is required.';
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
        location: formData.location.trim(),
        rideDistance: Number(formData.rideDistance) || 0,
        rideDate: formData.rideDate.trim(),
        startTime: formData.startTime.trim() || '06:00 AM',
        organizerName: formData.organizerName || 'Organizer Admin',
        status: mappedStatus,
      });

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
      {/* 1. Header with Breadcrumbs and Back Action */}
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
          isSubmitting={isSubmitting}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onCancel={onNavigateBack}
        />
      )}
    </PageContainer>
  );
};
