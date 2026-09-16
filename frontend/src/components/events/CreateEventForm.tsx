import React from 'react';
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
} from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { colors } from '../../theme/colors';
import { RideBadge } from '../ui/RideBadge';
import { RideButton } from '../ui/RideButton';
import { EventFormField } from './EventFormField';

export type EventStatusOption = 'draft' | 'published' | 'live' | 'completed' | 'cancelled';

export interface CreateEventFormData {
  eventName: string;
  description: string;
  location: string;
  rideDistance: string;
  rideDate: string;
  startTime: string;
  organizerName: string;
  eventStatus: EventStatusOption;
}

export interface CreateEventFormErrors {
  eventName?: string;
  location?: string;
  rideDistance?: string;
  rideDate?: string;
  startTime?: string;
  organizerName?: string;
  eventStatus?: string;
}

export interface CreateEventFormProps {
  formData: CreateEventFormData;
  formErrors: CreateEventFormErrors;
  isSubmitting: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  onFieldChange: (field: keyof CreateEventFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  formData,
  formErrors,
  isSubmitting,
  submitLabel = 'Save Event',
  submittingLabel = 'Saving Event...',
  onFieldChange,
  onSubmit,
  onCancel,
}) => {
  const statusOptions: { value: EventStatusOption; label: string; badgeStatus: 'draft' | 'published' | 'live' | 'completed' | 'cancelled' }[] = [
    { value: 'draft', label: 'Draft', badgeStatus: 'draft' },
    { value: 'published', label: 'Published', badgeStatus: 'published' },
    { value: 'live', label: 'Live', badgeStatus: 'live' },
    { value: 'completed', label: 'Completed', badgeStatus: 'completed' },
    { value: 'cancelled', label: 'Cancelled', badgeStatus: 'cancelled' },
  ];

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3.5, md: 4 },
        maxWidth: 880,
        mx: 'auto',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2.5, sm: 3 },
          mb: 3.5,
        }}
      >
        {/* 1. Event Name * */}
        <EventFormField
          label="Event Name"
          required
          errorText={formErrors.eventName}
          htmlFor="event-name-input"
        >
          <Box
            component="input"
            id="event-name-input"
            type="text"
            disabled={isSubmitting}
            placeholder="e.g. Kolhapur Endurance Ride"
            value={formData.eventName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFieldChange('eventName', e.target.value)
            }
            sx={{
              height: 44,
              px: 1.5,
              fontSize: '0.875rem',
              color: colors.text.primary,
              backgroundColor: isSubmitting ? colors.surface.subtle : '#FFFFFF',
              border: `1px solid ${formErrors.eventName ? colors.status.error.dot : colors.surface.borderStrong}`,
              borderRadius: '6px',
              outline: 'none',
              boxSizing: 'border-box',
              '&:focus': {
                borderColor: formErrors.eventName ? colors.status.error.dot : colors.brand.accent,
                boxShadow: `0 0 0 2px ${formErrors.eventName ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'}`,
              },
            }}
          />
        </EventFormField>

        {/* 2. Location * */}
        <EventFormField
          label="Location"
          required
          errorText={formErrors.location}
          htmlFor="event-location-input"
        >
          <Box
            sx={{
              height: 44,
              backgroundColor: isSubmitting ? colors.surface.subtle : '#FFFFFF',
              border: `1px solid ${formErrors.location ? colors.status.error.dot : colors.surface.borderStrong}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              gap: 1,
              boxSizing: 'border-box',
              '&:focus-within': {
                borderColor: formErrors.location ? colors.status.error.dot : colors.brand.accent,
                boxShadow: `0 0 0 2px ${formErrors.location ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'}`,
              },
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted, flexShrink: 0 }} />
            <Box
              component="input"
              id="event-location-input"
              type="text"
              disabled={isSubmitting}
              placeholder="e.g. Kolhapur"
              value={formData.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('location', e.target.value)
              }
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                color: colors.text.primary,
                '&::placeholder': { color: colors.text.muted },
              }}
            />
          </Box>
        </EventFormField>

        {/* 3. Ride Distance * (numeric input with km unit) */}
        <EventFormField
          label="Ride Distance"
          required
          errorText={formErrors.rideDistance}
          htmlFor="event-distance-input"
        >
          <Box
            sx={{
              height: 44,
              backgroundColor: isSubmitting ? colors.surface.subtle : '#FFFFFF',
              border: `1px solid ${formErrors.rideDistance ? colors.status.error.dot : colors.surface.borderStrong}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
              overflow: 'hidden',
              '&:focus-within': {
                borderColor: formErrors.rideDistance ? colors.status.error.dot : colors.brand.accent,
                boxShadow: `0 0 0 2px ${formErrors.rideDistance ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'}`,
              },
            }}
          >
            <Box
              component="input"
              id="event-distance-input"
              type="number"
              min="1"
              disabled={isSubmitting}
              placeholder="200"
              value={formData.rideDistance}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('rideDistance', e.target.value)
              }
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                px: 1.5,
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                color: colors.text.primary,
                '&::placeholder': { color: colors.text.muted },
              }}
            />
            {/* Associated Unit Badge */}
            <Box
              sx={{
                px: 1.75,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.surface.subtle,
                borderLeft: `1px solid ${colors.surface.border}`,
                color: colors.text.secondary,
                fontSize: '0.8125rem',
                fontWeight: 700,
                userSelect: 'none',
              }}
            >
              km
            </Box>
          </Box>
        </EventFormField>

        {/* 4. Ride Date * */}
        <EventFormField
          label="Ride Date"
          required
          errorText={formErrors.rideDate}
          htmlFor="event-date-input"
        >
          <Box
            sx={{
              height: 44,
              backgroundColor: isSubmitting ? colors.surface.subtle : '#FFFFFF',
              border: `1px solid ${formErrors.rideDate ? colors.status.error.dot : colors.surface.borderStrong}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              gap: 1,
              boxSizing: 'border-box',
              '&:focus-within': {
                borderColor: formErrors.rideDate ? colors.status.error.dot : colors.brand.accent,
                boxShadow: `0 0 0 2px ${formErrors.rideDate ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'}`,
              },
            }}
          >
            <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted, flexShrink: 0 }} />
            <Box
              component="input"
              id="event-date-input"
              type="date"
              disabled={isSubmitting}
              value={formData.rideDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('rideDate', e.target.value)
              }
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                color: colors.text.primary,
                fontFamily: 'inherit',
              }}
            />
          </Box>
        </EventFormField>

        {/* 5. Start Time * */}
        <EventFormField
          label="Start Time"
          required
          errorText={formErrors.startTime}
          htmlFor="event-time-input"
        >
          <Box
            sx={{
              height: 44,
              backgroundColor: isSubmitting ? colors.surface.subtle : '#FFFFFF',
              border: `1px solid ${formErrors.startTime ? colors.status.error.dot : colors.surface.borderStrong}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              gap: 1,
              boxSizing: 'border-box',
              '&:focus-within': {
                borderColor: formErrors.startTime ? colors.status.error.dot : colors.brand.accent,
                boxShadow: `0 0 0 2px ${formErrors.startTime ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'}`,
              },
            }}
          >
            <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted, flexShrink: 0 }} />
            <Box
              component="input"
              id="event-time-input"
              type="time"
              disabled={isSubmitting}
              value={formData.startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('startTime', e.target.value)
              }
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                color: colors.text.primary,
                fontFamily: 'inherit',
              }}
            />
          </Box>
        </EventFormField>

        {/* 6. Organizer Name * */}
        <EventFormField
          label="Organizer Name"
          required
          errorText={formErrors.organizerName}
          htmlFor="event-organizer-input"
        >
          <Box
            sx={{
              height: 44,
              backgroundColor: isSubmitting ? colors.surface.subtle : '#FFFFFF',
              border: `1px solid ${formErrors.organizerName ? colors.status.error.dot : colors.surface.borderStrong}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              gap: 1,
              boxSizing: 'border-box',
              '&:focus-within': {
                borderColor: formErrors.organizerName ? colors.status.error.dot : colors.brand.accent,
                boxShadow: `0 0 0 2px ${formErrors.organizerName ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'}`,
              },
            }}
          >
            <PersonIcon sx={{ fontSize: 18, color: colors.text.muted, flexShrink: 0 }} />
            <Box
              component="input"
              id="event-organizer-input"
              type="text"
              disabled={isSubmitting}
              placeholder="Organizer Admin"
              value={formData.organizerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange('organizerName', e.target.value)
              }
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                color: colors.text.primary,
              }}
            />
          </Box>
        </EventFormField>

        {/* 7. Event Status * */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
          <EventFormField
            label="Event Status"
            required
            errorText={formErrors.eventStatus}
            htmlFor="event-status-select"
          >
            <Select
              id="event-status-select"
              value={formData.eventStatus}
              disabled={isSubmitting}
              onChange={(e) => onFieldChange('eventStatus', e.target.value as EventStatusOption)}
              size="small"
              sx={{
                height: 44,
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '0.875rem',
                '& fieldset': {
                  borderColor: formErrors.eventStatus ? colors.status.error.dot : colors.surface.borderStrong,
                },
                '&:hover fieldset': {
                  borderColor: colors.text.secondary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.brand.accent,
                },
              }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <RideBadge status={opt.badgeStatus} label={opt.label} size="sm" />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </EventFormField>
        </Box>

        {/* 8. Description (multiline textarea, span 2 on desktop) */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <EventFormField
            label="Description"
            helperText="Optional event summary, route description, or safety notes for participants."
            htmlFor="event-description-input"
          >
            <Box
              component="textarea"
              id="event-description-input"
              rows={4}
              disabled={isSubmitting}
              placeholder="Describe the cycling event."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onFieldChange('description', e.target.value)
              }
              sx={{
                width: '100%',
                p: 1.5,
                fontSize: '0.875rem',
                color: colors.text.primary,
                backgroundColor: isSubmitting ? colors.surface.subtle : '#FFFFFF',
                border: `1px solid ${colors.surface.borderStrong}`,
                borderRadius: '6px',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                '&:focus': {
                  borderColor: colors.brand.accent,
                  boxShadow: '0 0 0 2px rgba(2, 132, 199, 0.15)',
                },
                '&::placeholder': { color: colors.text.muted },
              }}
            />
          </EventFormField>
        </Box>
      </Box>

      {/* Form Action Buttons: [ Cancel ] and [ Save Event ] */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2,
          pt: 3,
          borderTop: `1px solid ${colors.surface.border}`,
        }}
      >
        <RideButton
          variant="secondary"
          size="md"
          disabled={isSubmitting}
          onClick={onCancel}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: 110,
            minHeight: 44, // Minimum 44px touch target
          }}
        >
          Cancel
        </RideButton>

        <RideButton
          variant="primary"
          size="md"
          type="submit"
          disabled={isSubmitting}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: 140,
            minHeight: 44, // Minimum 44px touch target
            fontWeight: 700,
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.12)',
          }}
        >
          {isSubmitting ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />
              <span>{submittingLabel}</span>
            </Box>
          ) : (
            submitLabel
          )}
        </RideButton>
      </Box>
    </Box>
  );
};
