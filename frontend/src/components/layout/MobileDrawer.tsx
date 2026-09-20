import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
            color: colors.text.primary,
            borderRight: `1px solid ${colors.surface.sidebarBorder}`,
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Brand & Close Button */}
      <Box
        sx={{
          height: 64,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.surface.sidebarBorder}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            component="img"
            src="/ridetrack-emblem.png"
            alt="RideTrack"
            sx={{
              height: 32,
              width: 'auto',
              borderRadius: '6px',
              objectFit: 'contain',
            }}
          />
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.02em',
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
            color: colors.text.secondary,
            '&:hover': {
              color: colors.text.primary,
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#52796F',
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
                px: 1.75,
                minHeight: 48,
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                fontSize: '0.925rem',
                fontWeight: 800,
                backgroundColor: isActive ? '#D5E7DB' : 'transparent',
                color: isActive ? '#135F63' : '#1F2937',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: isActive ? '#D5E7DB' : 'rgba(0, 0, 0, 0.04)',
                  color: '#135F63',
                },
                '& .drawer-icon': {
                  color: isActive ? '#135F63' : '#374151',
                },
              }}
            >
              <Box
                className="drawer-icon"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 22,
                  transition: 'color 0.15s ease',
                }}
              >
                {item.icon}
              </Box>
              <Typography
                component="span"
                sx={{
                  fontSize: '0.925rem',
                  fontWeight: 800,
                  color: 'inherit',
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
          borderTop: `1px solid ${colors.surface.sidebarBorder}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              fontSize: '0.85rem',
              fontWeight: 800,
              backgroundColor: '#135F63',
              color: '#FFFFFF',
            }}
          >
            OP
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 800,
                color: colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              Organizer
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#52796F',
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
