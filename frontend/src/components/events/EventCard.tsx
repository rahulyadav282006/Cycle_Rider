import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { colors } from '../../theme/colors';
import { RideBadge } from '../ui/RideBadge';
import { RideButton } from '../ui/RideButton';
import { RideEvent } from './mockEventsData';

export interface EventCardListProps {
  events: RideEvent[];
  onViewEvent: (event: RideEvent) => void;
}

export const EventCard: React.FC<EventCardListProps> = ({ events, onViewEvent }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {events.map((event) => (
        <Box
          key={event.id}
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '8px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Header Row: Title and Status Badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  lineHeight: 1.3,
                  mb: 0.25,
                }}
              >
                {event.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: colors.text.muted,
                  lineHeight: 1.3,
                }}
              >
                {event.tagline}
              </Typography>
            </Box>

            <Box sx={{ flexShrink: 0 }}>
              <RideBadge status={event.status} size="sm" />
            </Box>
          </Box>

          {/* Event Metadata Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5,
              py: 1.5,
              borderTop: `1px solid ${colors.surface.border}`,
              borderBottom: `1px solid ${colors.surface.border}`,
              fontSize: '0.8125rem',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                {event.date}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PlaceOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                {event.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <StraightenOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary }}>
                {event.distanceKm} km
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PeopleIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary }}>
                {event.riderCount} riders
              </Typography>
            </Box>
          </Box>

          {/* Action Row */}
          <Box>
            <RideButton
              variant="secondary"
              size="md"
              fullWidth
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => onViewEvent(event)}
              sx={{
                minHeight: 44, // 44px minimum comfortable mobile touch target
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              View Event
            </RideButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
