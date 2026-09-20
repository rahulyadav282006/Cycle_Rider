import React from 'react';
import { Box, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { colors } from '../../../theme/colors';

export interface EmptyCheckpointStateProps {
  onAddCheckpoint: () => void;
}

export const EmptyCheckpointState: React.FC<EmptyCheckpointStateProps> = ({
  onAddCheckpoint,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '14px',
        p: { xs: 6, sm: 8 },
        textAlign: 'center',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#D1FAE5',
          color: '#0F766E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <PlaceOutlinedIcon sx={{ fontSize: 32 }} />
      </Box>

      {/* Title */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.375rem' },
          fontWeight: 800,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        No checkpoints found
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.muted,
          maxWidth: 420,
          lineHeight: 1.5,
          mb: 3,
        }}
      >
        Create checkpoints for your event.
      </Typography>

      {/* Primary Action */}
      <Box
        component="button"
        type="button"
        onClick={onAddCheckpoint}
        sx={{
          minHeight: 44,
          px: 3,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#135F63',
          color: '#FFFFFF',
          fontSize: '0.875rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: '#0E484B',
          },
        }}
      >
        <AddOutlinedIcon sx={{ fontSize: 18 }} />
        New Checkpoint
      </Box>
    </Box>
  );
};
