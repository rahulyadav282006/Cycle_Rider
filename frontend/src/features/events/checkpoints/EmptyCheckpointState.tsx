import React from 'react';
import { Box, Typography } from '@mui/material';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';

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
      {/* Icon */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: colors.brand.accentLight,
          color: colors.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          boxShadow: '0 2px 4px 0 rgba(2, 132, 199, 0.08)',
        }}
      >
        <AddLocationAltOutlinedIcon sx={{ fontSize: 30 }} />
      </Box>

      {/* Title */}
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
        No checkpoints configured
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          maxWidth: 460,
          lineHeight: 1.5,
          mb: 3,
        }}
      >
        This event does not have any checkpoints yet. Add checkpoints to define the
        rider route and scanning sequence.
      </Typography>

      {/* Primary Action */}
      <RideButton
        variant="primary"
        onClick={onAddCheckpoint}
        startIcon={<AddOutlinedIcon sx={{ fontSize: 18 }} />}
      >
        Add Checkpoint
      </RideButton>
    </Box>
  );
};
