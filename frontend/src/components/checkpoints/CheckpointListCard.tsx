import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../theme/colors';
import { Checkpoint } from './mockCheckpointsData';
import { CheckpointItemRow } from './CheckpointItemRow';

export interface CheckpointListCardProps {
  checkpoints: Checkpoint[];
  onEdit: (checkpoint: Checkpoint) => void;
  onDelete: (checkpoint: Checkpoint) => void;
}

export const CheckpointListCard: React.FC<CheckpointListCardProps> = ({
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
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        mb: 4,
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 2.5,
          borderBottom: `1px solid ${colors.surface.border}`,
          backgroundColor: colors.surface.page,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: colors.text.primary,
            lineHeight: 1.3,
            mb: 0.5,
          }}
        >
          Ride Checkpoints
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.4,
          }}
        >
          Configure the sequence of checkpoints riders will pass during the event.
        </Typography>
      </Box>

      {/* Vertical Ordered Checkpoint List */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {checkpoints.map((cp, idx) => (
          <CheckpointItemRow
            key={cp.id}
            checkpoint={cp}
            isFirst={idx === 0}
            isLast={idx === checkpoints.length - 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </Box>
  );
};
