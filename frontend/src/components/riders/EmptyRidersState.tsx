import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface EmptyRidersStateProps {
  onRegisterRider: () => void;
}

export const EmptyRidersState: React.FC<EmptyRidersStateProps> = ({ onRegisterRider }) => {
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
        <PeopleIcon sx={{ fontSize: 34 }} />
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
        No Riders Registered
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
        Register riders for this event to begin tracking participation.
      </Typography>

      <RideButton
        variant="primary"
        size="md"
        startIcon={<PersonAddOutlinedIcon />}
        onClick={onRegisterRider}
        sx={{
          minHeight: 44,
          px: 3,
          fontWeight: 700,
        }}
      >
        + Register Rider
      </RideButton>
    </Box>
  );
};
