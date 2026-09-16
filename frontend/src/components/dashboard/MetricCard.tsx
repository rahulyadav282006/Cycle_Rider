import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { colors } from '../../theme/colors';
import { DashboardMetrics } from './mockDashboardData';

export interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export const MetricCard: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: '2fr 1fr 1fr 1fr',
        },
        gap: { xs: 2, sm: 2.5 },
        mb: 3,
      }}
    >
      {/* 1. Prominent Total Riders Metric */}
      <Box
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          p: { xs: 2.5, sm: 3 },
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
          borderLeft: `4px solid ${colors.brand.accent}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
                display: 'block',
                mb: 0.5,
              }}
            >
              Total Riders
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {metrics.totalRiders.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '8px',
              backgroundColor: colors.brand.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.brand.accent,
            }}
          >
            <PeopleIcon sx={{ fontSize: 24 }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.25,
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              px: 1,
              py: 0.25,
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 13 }} />
            {metrics.totalRidersGrowth}
          </Box>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: colors.text.muted,
            }}
          >
            Across all events
          </Typography>
        </Box>
      </Box>

      {/* 2. Active Events Metric */}
      <Box
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: colors.text.muted,
            }}
          >
            Active Events
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
            }}
          >
            <SensorsOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: colors.text.primary,
            lineHeight: 1.1,
            mb: 0.5,
          }}
        >
          {metrics.activeEventsCount}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
          Course in progress
        </Typography>
      </Box>

      {/* 3. Upcoming Events Metric */}
      <Box
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: colors.text.muted,
            }}
          >
            Upcoming Events
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              backgroundColor: '#F0F9FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284C7',
            }}
          >
            <EventAvailableOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: colors.text.primary,
            lineHeight: 1.1,
            mb: 0.5,
          }}
        >
          {metrics.upcomingEventsCount}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#0369A1', fontWeight: 600 }}>
          Scheduled next
        </Typography>
      </Box>

      {/* 4. Completed Events Metric */}
      <Box
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: colors.text.muted,
            }}
          >
            Completed Events
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              backgroundColor: colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.secondary,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: colors.text.primary,
            lineHeight: 1.1,
            mb: 0.5,
          }}
        >
          {metrics.completedEventsCount}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
          Archived records
        </Typography>
      </Box>
    </Box>
  );
};
