import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme/colors';

export interface CheckpointSummaryProps {
  total: number;
  mandatory: number;
  optional: number;
  volunteersAssignedText: string;
}

export const CheckpointSummary: React.FC<CheckpointSummaryProps> = ({
  total,
  mandatory,
  optional,
  volunteersAssignedText,
}) => {
  const cards = [
    {
      label: 'TOTAL CHECKPOINTS',
      value: total.toString(),
      helper: total === 10 ? 'Sequential order' : 'No checkpoints',
    },
    {
      label: 'MANDATORY',
      value: mandatory.toString(),
      color: colors.text.primary,
      helper: mandatory > 0 ? 'Required for timeline' : undefined,
    },
    {
      label: 'OPTIONAL',
      value: optional.toString(),
      color: colors.text.secondary,
      helper: optional > 0 ? 'May be skipped' : undefined,
    },
    {
      label: 'VOLUNTEERS ASSIGNED',
      value: volunteersAssignedText,
      color: colors.primary.main,
      helper: volunteersAssignedText !== '0' ? 'Checkpoint coverage' : undefined,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: { xs: 1.5, sm: 2 },
        mb: 4,
      }}
    >
      {cards.map((card, idx) => (
        <Box
          key={idx}
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '8px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
            transition: 'border-color 0.15s ease',
            '&:hover': {
              borderColor: colors.surface.borderStrong,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: colors.text.muted,
              mb: 0.75,
            }}
          >
            {card.label}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 800,
              color: card.color || colors.text.primary,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {card.value}
          </Typography>

          {card.helper && (
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: colors.text.muted,
                mt: 0.5,
              }}
            >
              {card.helper}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};
