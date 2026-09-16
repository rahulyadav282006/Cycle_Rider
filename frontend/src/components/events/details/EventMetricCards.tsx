import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { colors } from '../../../theme/colors';

export interface EventMetricCardsProps {
  registeredRiders: number;
  startedRiders: number;
  finishedRiders: number;
  homeSafeRiders: number;
}

export const EventMetricCards: React.FC<EventMetricCardsProps> = ({
  registeredRiders,
  startedRiders,
  finishedRiders,
  homeSafeRiders,
}) => {
  const metrics = [
    {
      id: 'registered',
      label: 'Registered Riders',
      value: registeredRiders,
      sublabel: 'Confirmed entries',
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 22, color: colors.primary.main }} />,
      accentColor: colors.primary.main,
      bgColor: '#EFF6FF',
    },
    {
      id: 'started',
      label: 'Started',
      value: startedRiders,
      sublabel: `${registeredRiders > 0 ? ((startedRiders / registeredRiders) * 100).toFixed(0) : 0}% of field`,
      icon: <PlayCircleOutlineOutlinedIcon sx={{ fontSize: 22, color: '#0284C7' }} />,
      accentColor: '#0284C7',
      bgColor: '#F0F9FF',
    },
    {
      id: 'finished',
      label: 'Finished',
      value: finishedRiders,
      sublabel: `${startedRiders > 0 ? ((finishedRiders / startedRiders) * 100).toFixed(0) : 0}% completion rate`,
      icon: <EmojiEventsOutlinedIcon sx={{ fontSize: 22, color: colors.status.success.dot }} />,
      accentColor: colors.status.success.dot,
      bgColor: '#ECFDF5',
    },
    {
      id: 'home-safe',
      label: 'Home Safe',
      value: homeSafeRiders,
      sublabel: 'Safety confirmed',
      icon: <SecurityOutlinedIcon sx={{ fontSize: 22, color: '#059669' }} />,
      accentColor: '#059669',
      bgColor: '#F0FDF4',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
        mb: 3,
      }}
    >
      {metrics.map((m) => (
        <Box
          key={m.id}
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.borderStrong}`,
            borderRadius: '8px',
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
            transition: 'border-color 0.15s ease',
            '&:hover': {
              borderColor: m.accentColor,
            },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: colors.text.secondary,
                mb: 0.5,
              }}
            >
              {m.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: colors.text.primary,
                lineHeight: 1.1,
                mb: 0.5,
              }}
            >
              {m.value}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: colors.text.muted,
              }}
            >
              {m.sublabel}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '8px',
              backgroundColor: m.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {m.icon}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
