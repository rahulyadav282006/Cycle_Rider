import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { colors } from '../../theme/colors';
import { RideBadge } from '../ui/RideBadge';
import { RideButton } from '../ui/RideButton';
import { CreateEventFormData } from './CreateEventForm';

export interface CreateEventSuccessProps {
  eventData: CreateEventFormData;
  onContinueToEvent: () => void;
  onBackToEvents: () => void;
}

export const CreateEventSuccess: React.FC<CreateEventSuccessProps> = ({
  eventData,
  onContinueToEvent,
  onBackToEvents,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 3, sm: 5 },
        maxWidth: 640,
        mx: 'auto',
        textAlign: 'center',
        boxShadow: '0 2px 4px 0 rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 1. Large Animated/Success Badge */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#059669',
          mb: 2.5,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 42 }} />
      </Box>

      {/* 2. Success Title & Message */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.375rem', sm: '1.625rem' },
          fontWeight: 800,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        Event Created
      </Typography>

      <Typography
        sx={{
          fontSize: '0.9375rem',
          color: colors.text.secondary,
          maxWidth: 460,
          mb: 3.5,
          lineHeight: 1.5,
        }}
      >
        <Box component="span" sx={{ fontWeight: 700, color: colors.text.primary }}>
          {eventData.eventName || 'Kolhapur Endurance Ride'}
        </Box>{' '}
        has been created successfully and is ready for stage & checkpoint setup.
      </Typography>

      {/* 3. Event Summary Pill Card */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: colors.surface.page,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          p: 2.5,
          mb: 4,
          textAlign: 'left',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: colors.text.primary }}>
            {eventData.eventName || 'Kolhapur Endurance Ride'}
          </Typography>
          <RideBadge status={eventData.eventStatus} size="sm" />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2.5 },
            color: colors.text.secondary,
            fontSize: '0.8125rem',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
            <span>{eventData.rideDate || '13 September 2026'}</span>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
            <span>{eventData.location || 'Kolhapur'}</span>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <StraightenOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
            <span>{eventData.rideDistance || '200'} km course</span>
          </Box>
        </Box>
      </Box>

      {/* 4. Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          alignItems: 'center',
          gap: 2,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <RideButton
          variant="secondary"
          size="md"
          startIcon={<ArrowBackIcon />}
          onClick={onBackToEvents}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minHeight: 44,
          }}
        >
          Back to Events
        </RideButton>

        <RideButton
          variant="primary"
          size="md"
          endIcon={<ArrowForwardIcon />}
          onClick={onContinueToEvent}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minHeight: 44,
            fontWeight: 700,
          }}
        >
          Continue to Event
        </RideButton>
      </Box>
    </Box>
  );
};
