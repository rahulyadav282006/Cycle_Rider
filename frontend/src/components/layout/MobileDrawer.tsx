import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { colors } from '../../theme/colors';
import { NAV_ITEMS } from './navItems';

export interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  activeId: string;
  onNavigate: (id: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  activeId,
  onNavigate,
}) => {
  const handleItemClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      slotProps={{
        paper: {
          sx: {
            width: '82%',
            maxWidth: 320,
            backgroundColor: colors.surface.sidebar,
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Brand & Close Button */}
      <Box
        sx={{
          height: 60,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              backgroundColor: colors.brand.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <DirectionsBikeIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              RideTrack
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          aria-label="Close navigation drawer"
          sx={{
            color: '#94A3B8',
            '&:hover': {
              color: '#FFFFFF',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Navigation Links */}
      <Box
        component="nav"
        sx={{
          flex: 1,
          px: 1.5,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          overflowY: 'auto',
        }}
      >
        <Typography
          sx={{
            px: 1.5,
            py: 0.5,
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#94A3B8',
          }}
        >
          Navigation
        </Typography>

        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;

          return (
            <Box
              key={item.id}
              component="button"
              type="button"
              onClick={() => handleItemClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                minHeight: 48, // 48px touch target
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? colors.surface.sidebarActive : 'transparent',
                position: 'relative',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: isActive ? colors.surface.sidebarActive : 'rgba(255, 255, 255, 0.08)',
                  '& .drawer-label': {
                    color: '#FFFFFF',
                  },
                  '& .drawer-icon': {
                    color: '#FFFFFF',
                  },
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.brand.accent}`,
                  outlineOffset: '2px',
                },
              }}
            >
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    bottom: '15%',
                    width: 3,
                    borderRadius: '0 3px 3px 0',
                    backgroundColor: colors.brand.accent,
                  }}
                />
              )}
              <Box
                className="drawer-icon"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive ? '#38BDF8' : '#CBD5E1',
                  transition: 'color 0.15s ease',
                }}
              >
                {item.icon}
              </Box>
              <Typography
                component="span"
                className="drawer-label"
                sx={{
                  fontSize: '0.9375rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : '#E2E8F0',
                  transition: 'color 0.15s ease',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Profile Area at bottom */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: colors.brand.accent,
              color: '#FFFFFF',
            }}
          >
            OP
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}
            >
              Organizer
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: '#94A3B8',
                lineHeight: 1.2,
              }}
            >
              Organizer Admin
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
