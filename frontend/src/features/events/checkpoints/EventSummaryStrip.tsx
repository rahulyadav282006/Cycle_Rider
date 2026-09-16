import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { colors } from '../../../theme/colors';
import { RideBadge } from '../../../components/ui/RideBadge';
import { EventSummaryInfo } from './mockCheckpointData';

export interface EventSummaryStripProps {
  event: EventSummaryInfo;
}

export const EventSummaryStrip: React.FC<EventSummaryStripProps> = ({ event }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        px: { xs: 2, sm: 2.5 },
        py: 1.75,
        mb: 3,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 1.5,
      }}
    >
      {/* Event Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 800,
            color: colors.text.primary,
            lineHeight: 1.2,
          }}
        >
          {event.name}
        </Typography>

        <RideBadge status="active" label={event.status} size="sm" />
      </Box>

      {/* Metadata items */}
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
      </Box>
    </Box>
  );
};
