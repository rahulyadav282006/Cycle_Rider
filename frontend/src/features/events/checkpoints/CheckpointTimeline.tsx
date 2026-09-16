import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme/colors';
import { CheckpointCard } from './CheckpointCard';
import { CheckpointItem } from './mockCheckpointData';

export interface CheckpointTimelineProps {
  checkpoints: CheckpointItem[];
  onEdit: (checkpoint: CheckpointItem) => void;
  onDelete: (checkpoint: CheckpointItem) => void;
}

export const CheckpointTimeline: React.FC<CheckpointTimelineProps> = ({
  checkpoints,
  onEdit,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Timeline Section Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            fontWeight: 800,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}
        >
          Ride Checkpoints
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
          }}
        >
          Configure the sequence of checkpoints riders will pass during the event.
        </Typography>
      </Box>

      {/* Vertical Sequence Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {checkpoints.map((cp, index) => (
          <CheckpointCard
            key={cp.id}
            checkpoint={cp}
            isFirst={index === 0}
            isLast={index === checkpoints.length - 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </Box>
  );
};
