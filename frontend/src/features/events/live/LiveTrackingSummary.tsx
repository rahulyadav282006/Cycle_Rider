import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme/colors';
import { LiveTrackingMetrics } from './mockLiveTrackingData';

export interface LiveTrackingSummaryProps {
  metrics: LiveTrackingMetrics;
  isEmpty?: boolean;
}

export const LiveTrackingSummary: React.FC<LiveTrackingSummaryProps> = ({
  metrics,
  isEmpty = false,
}) => {
  const cards = [
    {
      label: 'REGISTERED',
      value: isEmpty ? 0 : metrics.registered,
      color: colors.text.primary,
      accentBorder: 'transparent',
    },
    {
      label: 'STARTED',
      value: isEmpty ? 0 : metrics.started,
      color: colors.primary.main,
      accentBorder: 'transparent',
    },
    {
      label: 'AT CHECKPOINTS',
      value: isEmpty ? 0 : metrics.atCheckpoints,
      color: '#D97706', // amber accent
      accentBorder: 'transparent',
    },
    {
      label: 'FINISHED',
      value: isEmpty ? 0 : metrics.finished,
      color: '#2563EB', // blue
      accentBorder: 'transparent',
    },
    {
      label: 'DNF',
      value: isEmpty ? 0 : metrics.dnf,
      color: colors.status.error.dot, // red
      accentBorder: 'transparent',
    },
    {
      label: 'HOME SAFE',
      value: isEmpty ? 0 : metrics.homeSafe,
      color: '#059669', // green
      accentBorder: 'transparent',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          lg: 'repeat(6, 1fr)',
        },
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
            p: { xs: 2, sm: 2.25 },
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
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
              color: card.color,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {card.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
