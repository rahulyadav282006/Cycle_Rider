import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../theme/colors';

export interface RideCardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'flat' | 'subtle';
  sx?: object;
}

export const RideCard: React.FC<RideCardProps> = ({
  children,
  className = '',
  elevation = 'flat',
  sx = {},
}) => {
  return (
    <Box
      className={className}
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        boxShadow: elevation === 'subtle' 
          ? '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)' 
          : 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export interface RideCardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  sx?: object;
}

export const RideCardHeader: React.FC<RideCardHeaderProps> = ({
  title,
  subtitle,
  action,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: 2,
        borderBottom: `1px solid ${colors.surface.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {typeof title === 'string' ? (
          <Typography
            variant="h4"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: colors.text.primary,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
        ) : (
          title
        )}
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8125rem',
              color: colors.text.muted,
              mt: 0.5,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Box sx={{ flexShrink: 0 }}>
          {action}
        </Box>
      )}
    </Box>
  );
};

export interface RideCardContentProps {
  children: React.ReactNode;
  sx?: object;
}

export const RideCardContent: React.FC<RideCardContentProps> = ({
  children,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        flex: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export interface RideCardActionsProps {
  children: React.ReactNode;
  sx?: object;
}

export const RideCardActions: React.FC<RideCardActionsProps> = ({
  children,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: 1.5,
        backgroundColor: colors.surface.subtle,
        borderTop: `1px solid ${colors.surface.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1.5,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
