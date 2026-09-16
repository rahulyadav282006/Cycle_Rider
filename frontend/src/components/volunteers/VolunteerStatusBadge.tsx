import React from 'react';
import { Box, Typography } from '@mui/material';
import { VolunteerStatus } from './mockVolunteersData';

export interface VolunteerStatusBadgeProps {
  status: VolunteerStatus;
  size?: 'sm' | 'md';
}

export const VolunteerStatusBadge: React.FC<VolunteerStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const isAssigned = status?.toLowerCase() === 'assigned';
  const isSmall = size === 'sm';

  const config = isAssigned
    ? {
        bg: '#ECFDF5',
        border: '#A7F3D0',
        text: '#065F46',
        dot: '#10B981',
        label: 'Assigned',
      }
    : {
        bg: '#F8FAFC',
        border: '#E2E8F0',
        text: '#64748B',
        dot: '#94A3B8',
        label: 'Unassigned',
      };

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '5px' : '6px',
        px: isSmall ? '8px' : '10px',
        py: isSmall ? '2px' : '3px',
        borderRadius: '9999px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        userSelect: 'none',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        component="span"
        sx={{
          width: isSmall ? 6 : 7,
          height: isSmall ? 6 : 7,
          borderRadius: '50%',
          backgroundColor: config.dot,
          flexShrink: 0,
        }}
      />
      <Typography
        component="span"
        sx={{
          fontSize: isSmall ? '0.6875rem' : '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
        }}
      >
        {config.label}
      </Typography>
    </Box>
  );
};
