import React from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface DashboardEmptyStateProps {
  onCreateEvent: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({ onCreateEvent }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px dashed ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        py: { xs: 8, sm: 10 },
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Visual Icon Container */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: colors.surface.subtle,
          border: `1px solid ${colors.surface.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text.muted,
          mb: 2.5,
        }}
      >
        <DirectionsBikeOutlinedIcon sx={{ fontSize: 36, color: colors.brand.accent }} />
      </Box>

      {/* Primary Message */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.375rem' },
          fontWeight: 700,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        No events yet
      </Typography>

      {/* Supporting Text */}
      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          maxWidth: 420,
          mb: 3,
          lineHeight: 1.5,
        }}
      >
        Create your first cycling event to get started. You will be able to configure checkpoints, register riders, and monitor active course throughput.
      </Typography>

      {/* Primary CTA Button */}
      <RideButton
        variant="primary"
        size="md"
        startIcon={<AddCircleIcon />}
        onClick={onCreateEvent}
        sx={{
          minHeight: 44,
          px: 3,
          fontWeight: 700,
        }}
      >
        Create Event
      </RideButton>
    </Box>
  );
};
