import React from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import { colors } from '../../../theme/colors';

export interface RiderProgressCardProps {
  registered: number;
  started: number;
  finished: number;
  dnf: number;
  homeSafe: number;
}

export const RiderProgressCard: React.FC<RiderProgressCardProps> = ({
  registered,
  started,
  finished,
  dnf,
  homeSafe,
}) => {
  const items = [
    { label: 'Registered', count: registered, color: colors.primary.main, bg: '#EFF6FF' },
    { label: 'Started', count: started, color: '#0284C7', bg: '#F0F9FF' },
    { label: 'Finished', count: finished, color: colors.status.success.dot, bg: '#ECFDF5' },
    { label: 'DNF', count: dnf, color: colors.status.error.dot, bg: '#FEF2F2' },
    { label: 'Home Safe', count: homeSafe, color: '#059669', bg: '#F0FDF4' },
  ];

  const finishRate = started > 0 ? ((finished / started) * 100).toFixed(1) : '0';

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        p: { xs: 2.5, md: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsBikeOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '1rem',
              color: colors.text.primary,
            }}
          >
            Rider Progress
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: colors.status.success.dot,
            backgroundColor: '#ECFDF5',
            px: 1.25,
            py: 0.25,
            borderRadius: '12px',
          }}
        >
          {finishRate}% Completion
        </Typography>
      </Box>

      {/* Progress metrics grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(5, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {items.map((it) => (
          <Box
            key={it.label}
            sx={{
              p: 1.5,
              borderRadius: '6px',
              backgroundColor: it.bg,
              border: `1px solid ${it.color}20`,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: it.color,
                lineHeight: 1.1,
                mb: 0.25,
              }}
            >
              {it.count}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: colors.text.secondary,
              }}
            >
              {it.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
