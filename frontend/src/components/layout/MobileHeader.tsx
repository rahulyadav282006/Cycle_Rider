import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { colors } from '../../theme/colors';
import { RideIconButton } from '../ui/RideButton';

export interface MobileHeaderProps {
  onOpenMenu: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenMenu }) => {
  return (
    <Box
      component="header"
      sx={{
        height: 56,
        backgroundColor: colors.surface.sidebar,
        color: '#FFFFFF',
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1.5,
        position: 'sticky',
        top: 0,
        zIndex: 1050,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Hamburger Menu Button */}
      <RideIconButton
        label="Open navigation menu"
        onClick={onOpenMenu}
        size="md"
        sx={{
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        }}
      >
        <MenuIcon sx={{ fontSize: 24 }} />
      </RideIconButton>

      {/* Brand */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '5px',
            backgroundColor: colors.brand.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        >
          <DirectionsBikeIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.05rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}
        >
          RideTrack
        </Typography>
      </Box>

      {/* Profile Button (Visual) */}
      <Box
        component="button"
        type="button"
        aria-label="User profile"
        sx={{
          border: 'none',
          background: 'none',
          p: 0.5,
          cursor: 'pointer',
          borderRadius: '50%',
          '&:focus-visible': {
            outline: `2px solid ${colors.brand.accent}`,
          },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.8125rem',
            fontWeight: 700,
            backgroundColor: colors.brand.accent,
            color: '#FFFFFF',
          }}
        >
          OP
        </Avatar>
      </Box>
    </Box>
  );
};
