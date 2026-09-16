import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { colors } from '../../../theme/colors';
import { RideBadge } from '../../ui/RideBadge';

export interface EventSummaryCardProps {
  eventName: string;
  status: 'active' | 'upcoming' | 'completed' | 'draft';
  date: string;
  location: string;
  distanceKm: number;
  startTime: string;
  organizer: string;
  description: string;
}

export const EventSummaryCard: React.FC<EventSummaryCardProps> = ({
  eventName,
  status,
  date,
  location,
  distanceKm,
  startTime,
  organizer,
  description,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        p: { xs: 2.5, md: 3 },
        mb: 3,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Top row: Name & Status */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 800,
            color: colors.text.primary,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          {eventName}
        </Typography>

        <RideBadge status={status} />
      </Box>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: colors.text.secondary,
          mb: 3,
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          maxWidth: 900,
        }}
      >
        {description}
      </Typography>

      {/* Event Details Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(5, 1fr)',
          },
          gap: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary.main,
            }}
          >
            <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase' }}>
              Date
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {date}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary.main,
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase' }}>
              Location
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {location}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary.main,
            }}
          >
            <DirectionsBikeOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase' }}>
              Distance
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {distanceKm} km
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary.main,
            }}
          >
            <AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase' }}>
              Start Time
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {startTime}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary.main,
            }}
          >
            <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase' }}>
              Organizer
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {organizer}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
