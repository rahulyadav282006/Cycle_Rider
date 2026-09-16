import React from 'react';
import { Box, Typography } from '@mui/material';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface EmptyEventsStateProps {
  onCreateEvent: () => void;
}

export const EmptyEventsState: React.FC<EmptyEventsStateProps> = ({ onCreateEvent }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px dashed ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        py: { xs: 8, sm: 10 },
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      <Box
        sx={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          backgroundColor: colors.surface.subtle,
          border: `1px solid ${colors.surface.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.brand.accent,
          mb: 2.5,
        }}
      >
        <EventAvailableOutlinedIcon sx={{ fontSize: 34 }} />
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.375rem' },
          fontWeight: 700,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        No events yet
      </Typography>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          maxWidth: 420,
          mb: 3,
          lineHeight: 1.5,
        }}
      >
        Create your first cycling event to get started. You can configure distance stages, checkpoints, and begin registering endurance riders.
      </Typography>

      <RideButton
        variant="primary"
        size="md"
        startIcon={<AddCircleIcon />}
        onClick={onCreateEvent}
        sx={{
          minHeight: 44,
          px: 3,
          fontWeight: 700,
        }}
      >
        Create Event
      </RideButton>
    </Box>
  );
};
