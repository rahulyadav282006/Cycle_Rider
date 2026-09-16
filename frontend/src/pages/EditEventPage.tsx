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
import { eventService } from '../api/services';
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
};

export const EditEventPage: React.FC<EditEventPageProps> = ({
  eventId,
  onNavigateBack,
  onNavigateCheckpoints,
}) => {
  const [formData, setFormData] = useState<CreateEventFormData>(EMPTY_FORM_DATA);
  const [formErrors, setFormErrors] = useState<CreateEventFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(Boolean(eventId));

  useEffect(() => {
    let isMounted = true;
    if (eventId) {
      setLoading(true);
      eventService
        .getEvent(eventId)
        .then((ev) => {
          if (!isMounted) return;
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
          });
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

  const handleFieldChange = (field: keyof CreateEventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof CreateEventFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: CreateEventFormErrors = {};

    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
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
          location: formData.location.trim(),
          rideDistance: Number(formData.rideDistance) || 0,
          rideDate: formData.rideDate.trim(),
          startTime: formData.startTime.trim() || '06:00 AM',
          organizerName: formData.organizerName || 'Organizer Admin',
          status: mappedStatus,
        });
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
              p: 0,
              fontSize: '0.875rem',
              fontWeight: 600,
              '&:hover': { color: colors.text.primary },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Back to Event Overview
          </Box>
        </Box>

        {/* Header Title */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: colors.text.primary,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
            }}
          >
            Edit Event
          </Typography>
          <Typography sx={{ color: colors.text.secondary, mt: 0.5, fontSize: '0.9375rem' }}>
            Update event details, route distance, and schedule.
          </Typography>
        </Box>

        {/* Success View */}
        {isSuccess ? (
          <Box
            sx={{
              backgroundColor: colors.surface.card,
              border: `1px solid ${colors.surface.borderStrong}`,
              borderRadius: '8px',
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
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
