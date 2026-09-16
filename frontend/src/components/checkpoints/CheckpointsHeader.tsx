import React from 'react';
import { Box, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface CheckpointsHeaderProps {
  onAddCheckpoint: () => void;
  isEmptyState: boolean;
  onToggleEmptyState: () => void;
}

export const CheckpointsHeader: React.FC<CheckpointsHeaderProps> = ({
  onAddCheckpoint,
  isEmptyState,
  onToggleEmptyState,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      {/* Title & Subtitle */}
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          Configure Checkpoints
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.4,
          }}
        >
          Define the route checkpoints and control how rider progress is recorded.
        </Typography>
      </Box>

      {/* Actions: Reviewer State Switcher + "+ Add Checkpoint" Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          flexWrap: 'wrap',
        }}
      >
        <RideButton
          variant="secondary"
          size="sm"
          onClick={onToggleEmptyState}
          startIcon={isEmptyState ? <LayersOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
          sx={{
            minHeight: 40,
            fontSize: '0.8125rem',
            whiteSpace: 'nowrap',
            borderColor: colors.surface.borderStrong,
          }}
        >
          {isEmptyState ? 'Populated View' : 'Preview Empty State'}
        </RideButton>

        <RideButton
          variant="primary"
          size="md"
          startIcon={<AddCircleIcon />}
          onClick={onAddCheckpoint}
          sx={{
            minHeight: 44, // Minimum 44px touch target
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.12)',
          }}
        >
          + Add Checkpoint
        </RideButton>
      </Box>
    </Box>
  );
};
