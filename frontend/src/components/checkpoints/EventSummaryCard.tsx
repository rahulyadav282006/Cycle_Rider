import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { colors } from '../../theme/colors';
import { EventDetailsInfo } from './mockCheckpointsData';

export interface EventSummaryCardProps {
  event: EventDetailsInfo;
  checkpointCount: number;
}

export const EventSummaryCard: React.FC<EventSummaryCardProps> = ({
  event,
  checkpointCount,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      {/* Event Title */}
      <Box>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            fontWeight: 800,
            color: colors.text.primary,
            lineHeight: 1.2,
            mb: 0.25,
          }}
        >
          {event.name}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: colors.text.muted,
          }}
        >
          Organized by {event.organizer}
        </Typography>
      </Box>

      {/* Metadata Badges with Icons */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: { xs: 1.5, sm: 2.5 },
          fontSize: '0.8125rem',
          color: colors.text.secondary,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
            {event.date}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <PlaceOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
            {event.location}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <StraightenOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary }}>
            {event.distanceKm} km
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            backgroundColor: colors.brand.accentLight,
            px: 1.25,
            py: 0.35,
            borderRadius: '9999px',
          }}
        >
          <FlagOutlinedIcon sx={{ fontSize: 15, color: colors.brand.accent }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.brand.accentHover,
            }}
          >
            {checkpointCount} {checkpointCount === 1 ? 'checkpoint' : 'checkpoints'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
