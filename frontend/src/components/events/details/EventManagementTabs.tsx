import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import RadarOutlinedIcon from '@mui/icons-material/RadarOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { colors } from '../../../theme/colors';

export type EventTabType =
  | 'overview'
  | 'checkpoints'
  | 'riders'
  | 'volunteers'
  | 'live_tracking'
  | 'reports';

export interface EventManagementTabsProps {
  activeTab: EventTabType;
  onTabChange: (tab: EventTabType) => void;
}

export const EventManagementTabs: React.FC<EventManagementTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: EventTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} /> },
    { id: 'checkpoints', label: 'Checkpoints', icon: <PlaceOutlinedIcon sx={{ fontSize: 18 }} /> },
    { id: 'riders', label: 'Riders', icon: <DirectionsBikeOutlinedIcon sx={{ fontSize: 18 }} /> },
    { id: 'volunteers', label: 'Volunteers', icon: <BadgeOutlinedIcon sx={{ fontSize: 18 }} /> },
    { id: 'live_tracking', label: 'Live Tracking', icon: <RadarOutlinedIcon sx={{ fontSize: 18 }} /> },
    { id: 'reports', label: 'Reports', icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${colors.surface.borderStrong}`,
        mb: 3,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: colors.surface.borderStrong,
          borderRadius: 2,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, sm: 2 },
          minWidth: 'max-content',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Box
              key={tab.id}
              component="button"
              type="button"
              onClick={() => onTabChange(tab.id)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                pb: 1.5,
                pt: 1,
                px: 1.5,
                border: 'none',
                borderBottom: `2px solid ${isActive ? colors.primary.main : 'transparent'}`,
                backgroundColor: 'transparent',
                color: isActive ? colors.primary.main : colors.text.secondary,
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                '&:hover': {
                  color: colors.primary.main,
                },
              }}
            >
              {tab.icon}
              <Typography
                component="span"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 'inherit',
                  color: 'inherit',
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
