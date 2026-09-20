import React from 'react';
import { Box, Typography } from '@mui/material';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import { colors } from '../../../theme/colors';

export interface RecentActivityItem {
  id: string;
  type: 'rider_registered' | 'checkpoint_configured' | 'volunteer_assigned' | 'rider_scanned';
  title: string;
  timestamp: string;
}

export interface RecentActivityCardProps {
  activities: RecentActivityItem[];
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  const getIcon = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'rider_registered':
        return <PersonAddOutlinedIcon sx={{ fontSize: 16, color: colors.primary.main }} />;
      case 'checkpoint_configured':
        return <PlaceOutlinedIcon sx={{ fontSize: 16, color: '#0284C7' }} />;
      case 'volunteer_assigned':
        return <BadgeOutlinedIcon sx={{ fontSize: 16, color: '#059669' }} />;
      case 'rider_scanned':
        return <QrCodeScannerOutlinedIcon sx={{ fontSize: 16, color: '#D97706' }} />;
    }
  };

  const getBg = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'rider_registered':
        return '#EFF6FF';
      case 'checkpoint_configured':
        return '#F0F9FF';
      case 'volunteer_assigned':
        return '#ECFDF5';
      case 'rider_scanned':
        return '#FFFBEB';
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        p: { xs: 2.5, md: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: '1rem',
            color: colors.text.primary,
          }}
        >
          Recent Activity
        </Typography>
      </Box>

      {activities.length === 0 ? (
        <Typography sx={{ color: colors.text.muted, fontSize: '0.875rem', py: 2 }}>
          No recent activity recorded for this event yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {activities.map((act) => (
            <Box
              key={act.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
                borderBottom: `1px solid ${colors.surface.border}`,
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: getBg(act.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getIcon(act.type)}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  {act.title}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: colors.text.muted,
                  whiteSpace: 'nowrap',
                  ml: 2,
                }}
              >
                {act.timestamp}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
