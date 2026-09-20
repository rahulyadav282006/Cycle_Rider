import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DashboardMetrics } from './mockDashboardData';

export interface MetricsGridProps {
  metrics: DashboardMetrics;
  onNavigateRiders?: () => void;
  onNavigateEvents?: () => void;
}

export const MetricCard: React.FC<MetricsGridProps> = ({
  metrics,
  onNavigateRiders,
  onNavigateEvents,
}) => {
  const cards = [
    {
      id: 'riders',
      label: 'Total Riders',
      value: metrics.totalRiders,
      subtitle: metrics.totalRiders > 0 ? `${metrics.totalRiders} registered riders` : 'No riders registered yet',
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 24, color: '#0F766E' }} />,
      onClick: onNavigateRiders,
    },
    {
      id: 'active',
      label: 'Active Events',
      value: metrics.activeEventsCount,
      subtitle: metrics.activeEventsCount > 0 ? `${metrics.activeEventsCount} course in progress` : 'No active events',
      icon: <EventAvailableOutlinedIcon sx={{ fontSize: 24, color: '#0F766E' }} />,
      onClick: onNavigateEvents,
    },
    {
      id: 'upcoming',
      label: 'Upcoming Events',
      value: metrics.upcomingEventsCount,
      subtitle: metrics.upcomingEventsCount > 0 ? `${metrics.upcomingEventsCount} scheduled next` : 'No upcoming events',
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 24, color: '#0F766E' }} />,
      onClick: onNavigateEvents,
    },
    {
      id: 'completed',
      label: 'Completed Events',
      value: metrics.completedEventsCount,
      subtitle: metrics.completedEventsCount > 0 ? `${metrics.completedEventsCount} past events` : 'No completed events',
      icon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 24, color: '#0F766E' }} />,
      onClick: onNavigateEvents,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 2.5,
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <Box
          key={card.id}
          onClick={card.onClick}
          sx={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            p: 2.5,
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: card.onClick ? 'pointer' : 'default',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:hover': card.onClick
              ? {
                  borderColor: '#CBD5E1',
                  boxShadow: '0 3px 8px 0 rgba(15, 23, 42, 0.05)',
                }
              : {},
          }}
        >
          {/* Top Row: Mint Icon Badge & Chevron */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                backgroundColor: '#D1FAE5', // Mint container matching screenshot
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {card.icon}
            </Box>
            <ChevronRightIcon sx={{ fontSize: 18, color: '#CBD5E1' }} />
          </Box>

          {/* Metric Details */}
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#475569',
                mb: 0.5,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                mb: 0.5,
              }}
            >
              {card.value}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: '#94A3B8',
                fontWeight: 400,
              }}
            >
              {card.subtitle}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
