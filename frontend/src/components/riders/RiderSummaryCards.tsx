import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import { colors } from '../../theme/colors';
import { RiderSummaryMetrics } from './mockRidersData';

export interface RiderSummaryCardsProps {
  summary: RiderSummaryMetrics;
}

export const RiderSummaryCards: React.FC<RiderSummaryCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'TOTAL RIDERS',
      value: summary.totalRiders.toLocaleString(),
      subtitle: 'Across all cycling events',
      icon: <PeopleIcon sx={{ fontSize: 22 }} />,
      accentColor: colors.brand.accent,
      accentBg: colors.brand.accentLight,
      borderAccent: colors.brand.accent,
    },
    {
      title: 'ACTIVE EVENT RIDERS',
      value: summary.activeEventRiders.toLocaleString(),
      subtitle: 'Currently on active courses',
      icon: <DirectionsBikeOutlinedIcon sx={{ fontSize: 22 }} />,
      accentColor: '#059669', // Emerald
      accentBg: '#ECFDF5',
      borderAccent: '#10B981',
    },
    {
      title: 'REGISTERED TODAY',
      value: summary.registeredToday.toLocaleString(),
      subtitle: 'New registrations in last 24h',
      icon: <TodayOutlinedIcon sx={{ fontSize: 22 }} />,
      accentColor: '#0284C7', // Sky
      accentBg: '#F0F9FF',
      borderAccent: '#0284C7',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(3, 1fr)',
        },
        gap: { xs: 2, sm: 2.5 },
        mb: 3,
      }}
    >
      {cards.map((card, idx) => (
        <Box
          key={idx}
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderLeft: `4px solid ${card.borderAccent}`,
            borderRadius: '8px',
            p: { xs: 2, sm: 2.5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
              }}
            >
              {card.title}
            </Typography>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: card.accentBg,
                color: card.accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem' },
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                mb: 0.5,
              }}
            >
              {card.value}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: colors.text.secondary,
                fontWeight: 500,
              }}
            >
              {card.subtitle}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
