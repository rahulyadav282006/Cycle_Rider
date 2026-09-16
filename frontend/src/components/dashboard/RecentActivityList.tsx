import React from 'react';
import { Box, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { colors } from '../../theme/colors';
import { ActivityItem } from './mockDashboardData';

export interface RecentActivityListProps {
  activities: ActivityItem[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'rider_registered':
        return <PersonAddOutlinedIcon sx={{ fontSize: 16, color: colors.brand.accent }} />;
      case 'checkpoint_configured':
        return <TuneIcon sx={{ fontSize: 16, color: '#059669' }} />;
      case 'volunteer_assigned':
        return <BadgeOutlinedIcon sx={{ fontSize: 16, color: '#D97706' }} />;
      case 'scan_recorded':
        return <QrCodeScannerIcon sx={{ fontSize: 16, color: '#2563EB' }} />;
      case 'event_created':
        return <AddCircleIcon sx={{ fontSize: 16, color: colors.brand.primary }} />;
    }
  };

  const getActivityBadgeColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'rider_registered':
        return colors.brand.accentLight;
      case 'checkpoint_configured':
        return '#ECFDF5';
      case 'volunteer_assigned':
        return '#FFFBEB';
      case 'scan_recorded':
        return '#EFF6FF';
      case 'event_created':
        return colors.surface.subtle;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 2,
          borderBottom: `1px solid ${colors.surface.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ fontSize: 20, color: colors.text.secondary }} />
          <Typography
            variant="h4"
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: colors.text.primary,
            }}
          >
            Recent Activity
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            color: colors.text.muted,
          }}
        >
          Real-time event feed
        </Typography>
      </Box>

      {/* Activity Items List */}
      <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {activities.map((act) => (
          <Box
            key={act.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              position: 'relative',
              '&:not(:last-child)::after': {
                content: '""',
                position: 'absolute',
                left: 17,
                top: 36,
                bottom: -16,
                width: 2,
                backgroundColor: colors.surface.border,
              },
            }}
          >
            {/* Semantic Icon Pill */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: getActivityBadgeColor(act.type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              {getActivityIcon(act.type)}
            </Box>

            {/* Description & Context */}
            <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 0.5,
                  mb: 0.25,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                    lineHeight: 1.3,
                  }}
                >
                  {act.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    color: colors.text.muted,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {act.timestamp}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: colors.text.secondary,
                  lineHeight: 1.3,
                }}
              >
                {act.context}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
