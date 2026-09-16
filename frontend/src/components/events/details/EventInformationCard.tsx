import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { colors } from '../../../theme/colors';
import { RideBadge } from '../../ui/RideBadge';

export interface EventInformationCardProps {
  eventName: string;
  location: string;
  distanceKm: number;
  date: string;
  startTime: string;
  organizer: string;
  status: 'active' | 'upcoming' | 'completed' | 'draft';
}

export const EventInformationCard: React.FC<EventInformationCardProps> = ({
  eventName,
  location,
  distanceKm,
  date,
  startTime,
  organizer,
  status,
}) => {
  const infoRows = [
    { label: 'Event Name', value: eventName },
    { label: 'Location', value: location },
    { label: 'Ride Distance', value: `${distanceKm} km` },
    { label: 'Ride Date', value: date },
    { label: 'Start Time', value: startTime },
    { label: 'Organizer', value: organizer },
  ];

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <InfoOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: '1rem',
            color: colors.text.primary,
          }}
        >
          Event Information
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {infoRows.map((row) => (
          <Box key={row.label}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: colors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                mb: 0.25,
              }}
            >
              {row.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: colors.text.primary,
              }}
            >
              {row.value}
            </Typography>
          </Box>
        ))}

        <Box>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              mb: 0.5,
            }}
          >
            Status
          </Typography>
          <RideBadge status={status} />
        </Box>
      </Box>
    </Box>
  );
};
