import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import PeopleIcon from '@mui/icons-material/People';
import { DashboardEvent, EventStatus } from './mockDashboardData';

export interface EventSummarySectionProps {
  events: DashboardEvent[];
  onCreateEvent?: () => void;
  onViewEvents?: () => void;
  onViewReports?: () => void;
  onSelectEvent?: (id: string) => void;
}

interface CategoryConfig {
  status: EventStatus;
  title: string;
  headerIcon: React.ReactNode;
  bannerImage: string;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptySubtitle: string;
  actionText: string;
  actionVariant: 'primary' | 'secondary';
  actionIcon?: React.ReactNode;
}

export const EventSummaryCard: React.FC<EventSummarySectionProps> = ({
  events,
  onCreateEvent,
  onViewEvents,
  onViewReports,
  onSelectEvent,
}) => {
  const categories: CategoryConfig[] = [
    {
      status: 'upcoming',
      title: 'Upcoming Events',
      headerIcon: <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: '#0F766E' }} />,
      bannerImage: '/event-card-upcoming.jpg',
      emptyIcon: <CalendarMonthOutlinedIcon sx={{ fontSize: 22, color: '#0F766E' }} />,
      emptyTitle: 'No upcoming events',
      emptySubtitle: 'Create your first event to get started.',
      actionText: '+ Create Event',
      actionVariant: 'primary',
      actionIcon: <AddCircleIcon sx={{ fontSize: 16 }} />,
    },
    {
      status: 'active',
      title: 'Active Events',
      headerIcon: <PeopleAltOutlinedIcon sx={{ fontSize: 18, color: '#0F766E' }} />,
      bannerImage: '/event-card-active.jpg',
      emptyIcon: <SensorsOutlinedIcon sx={{ fontSize: 22, color: '#0F766E' }} />,
      emptyTitle: 'No active events',
      emptySubtitle: 'Start an event to track riders in real time.',
      actionText: 'View Events',
      actionVariant: 'secondary',
    },
    {
      status: 'completed',
      title: 'Completed Events',
      headerIcon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 18, color: '#0F766E' }} />,
      bannerImage: '/event-card-completed.jpg',
      emptyIcon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 22, color: '#0F766E' }} />,
      emptyTitle: 'No completed events',
      emptySubtitle: 'View your past events and reports.',
      actionText: 'View Reports',
      actionVariant: 'secondary',
    },
  ];

  const handleActionClick = (status: EventStatus) => {
    if (status === 'upcoming') {
      if (onCreateEvent) onCreateEvent();
    } else if (status === 'active') {
      if (onViewEvents) onViewEvents();
    } else if (status === 'completed') {
      if (onViewReports) onViewReports();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2.5,
        }}
      >
        {categories.map((cat) => {
          const categoryEvents = events.filter((e) => e.status === cat.status);
          const count = categoryEvents.length;

          return (
            <Box
              key={cat.status}
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
              }}
            >
              {/* Header Bar */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {cat.headerIcon}
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0F172A',
                    }}
                  >
                    {cat.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    px: 1,
                    py: 0.15,
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    color: '#64748B',
                  }}
                >
                  {count}
                </Typography>
              </Box>

              {/* Scenic Image Banner */}
              <Box sx={{ px: 1.75, pb: 1 }}>
                <Box
                  component="img"
                  src={cat.bannerImage}
                  alt={cat.title}
                  sx={{
                    width: '100%',
                    height: 130,
                    objectFit: 'cover',
                    borderRadius: '8px',
                    display: 'block',
                  }}
                />
              </Box>

              {/* Body: Empty State or Populated Event List */}
              <Box
                sx={{
                  p: 2,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {count === 0 ? (
                  <Box
                    sx={{
                      py: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    {/* Mint Icon Circle */}
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        backgroundColor: '#D1FAE5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.25,
                      }}
                    >
                      {cat.emptyIcon}
                    </Box>

                    {/* Empty Title & Subtitle */}
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        mb: 0.5,
                      }}
                    >
                      {cat.emptyTitle}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        mb: 2,
                      }}
                    >
                      {cat.emptySubtitle}
                    </Typography>

                    {/* Action Button */}
                    <Box
                      component="button"
                      type="button"
                      onClick={() => handleActionClick(cat.status)}
                      sx={{
                        minHeight: 36,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.75,
                        px: 2,
                        py: 0.75,
                        borderRadius: '6px',
                        border: cat.actionVariant === 'primary' ? 'none' : '1px solid #E2E8F0',
                        backgroundColor: cat.actionVariant === 'primary' ? '#135F63' : '#FFFFFF',
                        color: cat.actionVariant === 'primary' ? '#FFFFFF' : '#334155',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          backgroundColor: cat.actionVariant === 'primary' ? '#0E4E52' : '#F8FAFC',
                          borderColor: cat.actionVariant === 'primary' ? 'none' : '#CBD5E1',
                        },
                      }}
                    >
                      {cat.actionIcon}
                      {cat.actionText}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {categoryEvents.map((evt) => (
                      <Box
                        key={evt.id}
                        onClick={() => onSelectEvent && onSelectEvent(evt.id)}
                        sx={{
                          p: 1.5,
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          cursor: onSelectEvent ? 'pointer' : 'default',
                          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                          '&:hover': onSelectEvent
                            ? {
                                borderColor: '#CBD5E1',
                                boxShadow: '0 2px 6px 0 rgba(15, 23, 42, 0.04)',
                              }
                            : {},
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: '#0F172A',
                            lineHeight: 1.3,
                            mb: 0.75,
                          }}
                        >
                          {evt.name}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            fontSize: '0.75rem',
                            color: '#64748B',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarMonthOutlinedIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                            <span>{evt.date}</span>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PlaceOutlinedIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                            <span>{evt.location}</span>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            pt: 1,
                            mt: 1,
                            borderTop: '1px dashed #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem',
                            color: '#64748B',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StraightenOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>{evt.distanceKm} km</span>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PeopleIcon sx={{ fontSize: 14 }} />
                            <span>{evt.riderCount} riders</span>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
