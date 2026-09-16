import React from 'react';
import { Box, Typography } from '@mui/material';
import RadarOutlinedIcon from '@mui/icons-material/RadarOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';

export interface LiveTrackingEmptyStateProps {
  onBackToEvent?: () => void;
}

export const LiveTrackingEmptyState: React.FC<LiveTrackingEmptyStateProps> = ({
  onBackToEvent,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: colors.brand.accentLight,
          color: colors.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          boxShadow: '0 2px 6px 0 rgba(2, 132, 199, 0.1)',
        }}
      >
        <RadarOutlinedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          fontWeight: 800,
          color: colors.text.primary,
          letterSpacing: '-0.01em',
          mb: 1,
        }}
      >
        No Live Tracking Data
      </Typography>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          maxWidth: 480,
          lineHeight: 1.5,
          mb: 3,
        }}
      >
        Rider checkpoint activity will appear here when the event is active
        and riders begin passing through checkpoints.
      </Typography>

      <RideButton
        variant="secondary"
        onClick={onBackToEvent}
        startIcon={<ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />}
      >
        Back to Event
      </RideButton>
    </Box>
  );
};
