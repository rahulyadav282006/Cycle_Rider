import React from 'react';
import { Box, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { colors } from '../../../theme/colors';
import { LiveCheckpointProgressItem } from './mockLiveTrackingData';
import { CheckpointProgressRow } from './CheckpointProgressRow';

export interface CheckpointProgressProps {
  checkpoints: LiveCheckpointProgressItem[];
}

export const CheckpointProgress: React.FC<CheckpointProgressProps> = ({
  checkpoints,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 3 },
        mb: 4,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
        <PlaceOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            fontWeight: 800,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
          }}
        >
          Checkpoint Progress
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          mb: 2.5,
        }}
      >
        Real-time scan counts and passing rate across all 10 route checkpoints.
      </Typography>

      {/* Rows Container */}
      <Box sx={{ borderTop: `1px solid ${colors.surface.border}` }}>
        {checkpoints.map((cp, idx) => (
          <CheckpointProgressRow
            key={cp.sequence}
            checkpoint={cp}
            isFirst={idx === 0}
            isLast={idx === checkpoints.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};
