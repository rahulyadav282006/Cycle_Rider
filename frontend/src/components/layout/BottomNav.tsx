import React from 'react';
import { Box, Typography } from '@mui/material';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import BarChartIcon from '@mui/icons-material/BarChart';
import { colors } from '../../theme/colors';

export interface BottomNavProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

const BOTTOM_NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: <SpaceDashboardIcon sx={{ fontSize: 22 }} /> },
  { id: 'events', label: 'Events', icon: <EventAvailableIcon sx={{ fontSize: 22 }} /> },
  { id: 'riders', label: 'Riders', icon: <DirectionsBikeIcon sx={{ fontSize: 22 }} /> },
  { id: 'reports', label: 'Reports', icon: <BarChartIcon sx={{ fontSize: 22 }} /> },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeId, onNavigate }) => {
  return (
    <Box
      component="nav"
      aria-label="Mobile Navigation Bar"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 58,
        backgroundColor: colors.surface.sidebar,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1050,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
        px: 1,
      }}
    >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;

        return (
          <Box
            key={item.id}
            component="button"
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              minWidth: 44, // Touch target
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: isActive ? colors.brand.accent : colors.text.inverseMuted,
              transition: 'color 0.15s ease',
              p: 0.5,
              '&:hover': {
                color: '#FFFFFF',
              },
              '&:focus-visible': {
                outline: `2px solid ${colors.brand.accent}`,
                outlineOffset: '-2px',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s ease',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {item.icon}
            </Box>
            <Typography
              component="span"
              sx={{
                fontSize: '0.6875rem',
                fontWeight: isActive ? 700 : 500,
                mt: 0.25,
                lineHeight: 1,
                letterSpacing: '0.01em',
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
