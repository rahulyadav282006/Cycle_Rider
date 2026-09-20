import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { PageContainer } from '../components/layout/PageContainer';
import { colors } from '../theme/colors';
import { RideButton } from '../components/ui/RideButton';
import {
  CreateEventForm,
  CreateEventFormData,
  CreateEventFormErrors,
} from '../components/events/CreateEventForm';
import { eventService, checkpointService, RoutePoint, CheckpointItem } from '../api/services';
import { EventStatus } from '../components/events/mockEventsData';

export interface EditEventPageProps {
  eventId?: string;
  onNavigateBack: () => void;
  onNavigateCheckpoints?: () => void;
}

const EMPTY_FORM_DATA: CreateEventFormData = {
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

export const EditEventPage: React.FC<EditEventPageProps> = ({
  eventId,
  onNavigateBack,
  onNavigateCheckpoints,
}) => {
  const [formData, setFormData] = useState<CreateEventFormData>(EMPTY_FORM_DATA);
  const [startLocation, setStartLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [finishLocation, setFinishLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [checkpoints, setCheckpoints] = useState<Partial<CheckpointItem>[]>([]);
  const [calculatedDistanceKm, setCalculatedDistanceKm] = useState<number>(0);
  const [calculatedDurationMins, setCalculatedDurationMins] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<CreateEventFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(Boolean(eventId));

  useEffect(() => {
    let isMounted = true;
    if (eventId) {
      setLoading(true);
      Promise.all([
        eventService.getEvent(eventId).catch(() => null),
        checkpointService.listCheckpoints(eventId).catch(() => []),
      ])
        .then(([ev, cps]) => {
          if (!isMounted || !ev) return;
          setFormData({
            eventName: ev.eventName || '',
            description: ev.description || '',
            location: ev.location || '',
            rideDistance: String(ev.rideDistance || ''),
            rideDate: ev.rideDate || '',
            startTime: ev.startTime || '',
            organizerName: ev.organizerName || 'Organizer Admin',
            eventStatus:
              ev.status === 'active'
                ? 'live'
                : ev.status === 'completed'
                ? 'completed'
                : 'draft',
            paymentRequired: Boolean(ev.paymentRequired),
          });
          if (ev.startLocation) {
            setStartLocation(ev.startLocation);
          }
          if (ev.finishLocation) {
            setFinishLocation(ev.finishLocation);
          }
          if (ev.routePoints && Array.isArray(ev.routePoints)) {
            setRoutePoints(ev.routePoints);
          }
          if (ev.routeGeometry && Array.isArray(ev.routeGeometry)) {
            setRouteGeometry(ev.routeGeometry);
          }
          if (Array.isArray(cps)) {
            setCheckpoints(cps);
          }
        })
        .catch((err) => {
          console.error('Failed to load event details:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleFieldChange = (field: keyof CreateEventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof CreateEventFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: CreateEventFormErrors = {};

    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required.';
    const finalLocation = formData.location.trim() || (startLocation?.name ? `${startLocation.name} to ${finishLocation?.name || ''}` : '');
    if (!finalLocation) newErrors.location = 'Location is required.';
    if (!formData.rideDistance.trim() || Number(formData.rideDistance) <= 0) {
      newErrors.rideDistance = 'Enter a valid ride distance.';
    }
    if (!formData.rideDate.trim()) newErrors.rideDate = 'Ride date is required.';
    if (!formData.startTime.trim()) newErrors.startTime = 'Start time is required.';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
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

    setIsSubmitting(true);
    try {
      if (eventId) {
        await eventService.updateEvent(eventId, {
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

        // Persist any updated or new checkpoints in exact reordered sequence
        const savedCpIds: string[] = [];
        for (let idx = 0; idx < checkpoints.length; idx++) {
          const cp = checkpoints[idx];
          const seq = idx + 1;
          if (typeof cp.latitude !== 'number' || typeof cp.longitude !== 'number' || isNaN(cp.latitude) || isNaN(cp.longitude)) {
            console.warn(`Skipping checkpoint "${cp.name}" because location coordinates are missing.`);
            continue;
          }
          if (cp.id && !cp.id.startsWith('cp-item-') && !cp.id.startsWith('cp-map-')) {
            // Existing checkpoint update
            await checkpointService
              .updateCheckpoint(cp.id, {
                name: cp.name,
                type: cp.type || 'Standard',
                sequenceNumber: seq,
                mandatory: cp.mandatory,
                latitude: cp.latitude,
                longitude: cp.longitude,
                description: cp.description,
              })
              .catch((err) => console.warn('Could not update checkpoint:', err));
            savedCpIds.push(cp.id);
          } else {
            // New checkpoint create
            const createdCp = await checkpointService
              .createCheckpoint(eventId, {
                name: cp.name || `Checkpoint ${seq}`,
                type: cp.type || 'Standard',
                sequenceNumber: seq,
                mandatory: cp.mandatory !== false,
                latitude: cp.latitude,
                longitude: cp.longitude,
                description: cp.description,
              })
              .catch((err) => {
                console.warn('Could not create checkpoint:', err);
                return null;
              });
            if (createdCp && createdCp.id) {
              savedCpIds.push(createdCp.id);
            }
          }
        }

        if (savedCpIds.length > 0) {
          await eventService
            .updateEvent(eventId, {
              orderedCheckpointIds: savedCpIds,
            })
            .catch(() => {});
        }
      }
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err?.message || 'Failed to update event. Please verify backend connection.';
      setFormErrors({ eventName: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ p: 4, textAlign: 'center', color: colors.text.secondary }}>
          Loading event details...
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box sx={{ maxWidth: 840, mx: 'auto', width: '100%', pb: 6 }}>
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <Box
            component="button"
            type="button"
            onClick={onNavigateBack}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: colors.text.secondary,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              p: 0,
              '&:hover': { color: colors.text.primary },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Back to Event
          </Box>
        </Box>

        {/* Page Title & Context Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.375rem', sm: '1.625rem' },
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            Edit Event
          </Typography>
          <Typography sx={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
            Modify event schedule, route distance, waypoint paths, and details.
          </Typography>
        </Box>

        {/* Success View */}
        {isSuccess ? (
          <Box
            sx={{
              backgroundColor: colors.surface.card,
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '8px',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: colors.status.success,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary, mb: 1 }}>
              Event Updated
            </Typography>

            <Typography sx={{ color: colors.text.secondary, fontSize: '0.9375rem', mb: 3 }}>
              <strong>{formData.eventName}</strong> details have been saved successfully.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
              <RideButton variant="primary" onClick={onNavigateBack}>
                Back to Event Overview
              </RideButton>
              {onNavigateCheckpoints && (
                <RideButton variant="secondary" onClick={onNavigateCheckpoints}>
                  Configure Checkpoints
                </RideButton>
              )}
            </Box>
          </Box>
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
            checkpoints={checkpoints}
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
            onCheckpointsChange={setCheckpoints}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
            submittingLabel="Saving Changes..."
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            onCancel={onNavigateBack}
          />
        )}
      </Box>
    </PageContainer>
  );
};
