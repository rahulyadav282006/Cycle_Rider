import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../theme/colors';

export interface ReportSummaryItem {
  label: string;
  value: string | number;
  color?: string;
  helper?: string;
}

export interface ReportSummaryCardsProps {
  items: ReportSummaryItem[];
}

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({ items }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: `repeat(${Math.min(items.length, 3)}, 1fr)`,
          md: `repeat(${items.length}, 1fr)`,
        },
        gap: { xs: 1.5, sm: 2 },
        mb: 3,
      }}
    >
      {items.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '8px',
            p: { xs: 2, sm: 2.25 },
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
            {item.label}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 800,
              color: item.color || colors.text.primary,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {item.value}
          </Typography>

          {item.helper && (
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: colors.text.muted,
                mt: 0.5,
              }}
            >
              {item.helper}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};
