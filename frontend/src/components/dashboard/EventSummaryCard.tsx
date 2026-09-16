import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { colors } from '../../theme/colors';
import { RideBadge } from '../ui/RideBadge';
import { DashboardEvent, EventStatus } from './mockDashboardData';

export interface EventSummarySectionProps {
  events: DashboardEvent[];
}

interface CategoryConfig {
  title: string;
  status: EventStatus;
  badgeLabel: string;
  icon: React.ReactNode;
  emptyText: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    title: 'Active Events',
    status: 'active',
    badgeLabel: 'Active',
    icon: <SensorsOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
    emptyText: 'No cycling events currently active.',
  },
  {
    title: 'Upcoming Events',
    status: 'upcoming',
    badgeLabel: 'Upcoming',
    icon: <EventAvailableOutlinedIcon sx={{ fontSize: 18, color: '#0284C7' }} />,
    emptyText: 'No upcoming events scheduled.',
  },
  {
    title: 'Completed Events',
    status: 'completed',
    badgeLabel: 'Completed',
    icon: <CheckCircleIcon sx={{ fontSize: 18, color: colors.text.muted }} />,
    emptyText: 'No completed events recorded.',
  },
];

export const EventSummaryCard: React.FC<EventSummarySectionProps> = ({ events }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(3, 1fr)',
          },
          gap: { xs: 2.5, sm: 3 },
        }}
      >
        {CATEGORIES.map((cat) => {
          const categoryEvents = events.filter((e) => e.status === cat.status);

          return (
            <Box
              key={cat.status}
              sx={{
                backgroundColor: colors.surface.card,
                border: `1px solid ${colors.surface.border}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
              }}
            >
              {/* Category Header */}
              <Box
                sx={{
                  px: { xs: 2, sm: 2.5 },
                  py: 1.75,
                  borderBottom: `1px solid ${colors.surface.border}`,
                  backgroundColor: colors.surface.page,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {cat.icon}
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: colors.text.primary,
                    }}
                  >
                    {cat.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    px: 1,
                    py: 0.25,
                    borderRadius: '9999px',
                    backgroundColor: colors.surface.subtle,
                    color: colors.text.secondary,
                  }}
                >
                  {categoryEvents.length}
                </Typography>
              </Box>

              {/* Category Event Cards List */}
              <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                {categoryEvents.length === 0 ? (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: 'center',
                      color: colors.text.muted,
                      fontSize: '0.8125rem',
                    }}
                  >
                    {cat.emptyText}
                  </Box>
                ) : (
                  categoryEvents.map((evt) => (
                    <Box
                      key={evt.id}
                      sx={{
                        p: 2,
                        borderRadius: '6px',
                        border: `1px solid ${colors.surface.border}`,
                        backgroundColor: '#FFFFFF',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        '&:hover': {
                          borderColor: colors.surface.borderStrong,
                          boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
                        },
                      }}
                    >
                      {/* Event Title & Badge */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontSize: '0.9375rem',
                            fontWeight: 700,
                            color: colors.text.primary,
                            lineHeight: 1.3,
                          }}
                        >
                          {evt.name}
                        </Typography>
                        <RideBadge status={evt.status} label={cat.badgeLabel} size="sm" />
                      </Box>

                      {/* Date & Location */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          mb: 1.5,
                          fontSize: '0.75rem',
                          color: colors.text.secondary,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
                          <span>{evt.date}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <PlaceOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
                          <span>{evt.location}</span>
                        </Box>
                      </Box>

                      {/* Distance & Rider Metrics */}
                      <Box
                        sx={{
                          pt: 1.25,
                          borderTop: `1px dashed ${colors.surface.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          color: colors.text.muted,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StraightenOutlinedIcon sx={{ fontSize: 14 }} />
                          <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.secondary }}>
                            {evt.distanceKm} km
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 14 }} />
                          <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.secondary }}>
                            {evt.riderCount} riders
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
