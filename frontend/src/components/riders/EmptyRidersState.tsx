import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { colors } from '../../theme/colors';

export interface EmptyRidersStateProps {
  onRegisterRider: () => void;
}

export const EmptyRidersState: React.FC<EmptyRidersStateProps> = ({ onRegisterRider }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '14px',
        py: { xs: 8, sm: 10 },
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#D1FAE5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0F766E',
          mb: 2.5,
        }}
      >
        <PersonOutlineOutlinedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.375rem' },
          fontWeight: 800,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        No riders found
      </Typography>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.muted,
          maxWidth: 420,
          mb: 3,
          lineHeight: 1.5,
        }}
      >
        Register riders to start managing your event.
      </Typography>

      <Box
        component="button"
        type="button"
        onClick={onRegisterRider}
        sx={{
          minHeight: 44,
          px: 3,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#135F63',
          color: '#FFFFFF',
          fontSize: '0.875rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: '#0E484B',
          },
        }}
      >
        <PersonAddOutlinedIcon sx={{ fontSize: 18 }} />
        Register Rider
      </Box>
    </Box>
  );
};
