import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, StatusType } from '../../theme/colors';

export interface RideBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const RideBadge: React.FC<RideBadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
}) => {
  const statusConfig = colors.status[status] || colors.status.draft;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  const isSmall = size === 'sm';

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
        backgroundColor: statusConfig.bg,
        border: `1px solid ${statusConfig.border}`,
        color: statusConfig.text,
        userSelect: 'none',
        lineHeight: 1,
      }}
    >
      {showDot && (
        <Box
          component="span"
          sx={{
            width: isSmall ? 6 : 7,
            height: isSmall ? 6 : 7,
            borderRadius: '50%',
            backgroundColor: statusConfig.dot,
            flexShrink: 0,
          }}
        />
      )}
      <Typography
        component="span"
        sx={{
          fontSize: isSmall ? '0.6875rem' : '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          textTransform: 'capitalize',
        }}
      >
        {displayLabel}
      </Typography>
    </Box>
  );
};
