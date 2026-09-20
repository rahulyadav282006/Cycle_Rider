import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Drawer,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { colors } from '../../theme/colors';
import { RideIconButton } from '../../components/ui/RideButton';
import { getStoredUser } from '../../api/client';

export interface VolunteerShellProps {
  children: React.ReactNode;
  activeNavId?: 'home' | 'scanner';
  onNavigate?: (id: 'home' | 'scanner') => void;
  onOpenScannerNotice?: () => void;
  onLogout?: () => void;
}

export const VolunteerShell: React.FC<VolunteerShellProps> = ({
  children,
  activeNavId = 'home',
  onNavigate,
  onOpenScannerNotice,
  onLogout,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const currentUser = getStoredUser();
  const volunteerName: string = currentUser?.name || currentUser?.email || 'Volunteer';
  const volunteerInitials = (
    volunteerName
      .split(' ')
      .map((p: string) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  ) || 'V';

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: <HomeOutlinedIcon sx={{ fontSize: 20 }} /> },
    { id: 'scanner' as const, label: 'Scanner', icon: <QrCodeScannerOutlinedIcon sx={{ fontSize: 20 }} /> },
  ];

  const handleItemClick = (id: 'home' | 'scanner') => {
    setMobileDrawerOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else if (id === 'scanner' && onOpenScannerNotice) {
      onOpenScannerNotice();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.surface.page,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* 1. Mobile Top Header (Visible on < md) */}
      <Box
        component="header"
        sx={{
          display: { xs: 'flex', md: 'none' },
          height: 56,
          px: 2,
          backgroundColor: '#FFFFFF',
          borderBottom: `1px solid ${colors.surface.border}`,
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <IconButton
            size="small"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open volunteer menu"
            sx={{ color: colors.text.primary }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component="img"
            src="/ridetrack-emblem.png"
            alt="RideTrack"
            sx={{
              height: 24,
              width: 'auto',
              borderRadius: '5px',
              objectFit: 'contain',
              display: 'block',
            }}
          />

          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: colors.text.primary, letterSpacing: '-0.02em' }}>
            RideTrack
          </Typography>

          <Box
            component="span"
            sx={{
              fontSize: '0.625rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              px: 0.75,
              py: 0.1,
              borderRadius: '4px',
              backgroundColor: colors.brand.accentLight,
              color: colors.brand.accent,
              letterSpacing: '0.04em',
            }}
          >
            Volunteer
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 30,
              height: 30,
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: colors.brand.accent,
              color: '#FFFFFF',
            }}
          >
            DP
          </Avatar>
        </Box>
      </Box>

      {/* 2. Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 260,
              backgroundColor: colors.surface.sidebar,
              color: colors.text.primary,
              borderRight: `1px solid ${colors.surface.sidebarBorder}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            },
          },
        }}
      >
        <Box>
          <Box
            sx={{
              height: 64,
              px: 2.5,
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
                  height: 30,
                  width: 'auto',
                  borderRadius: '6px',
                  objectFit: 'contain',
                }}
              />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: colors.text.primary, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  RideTrack
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#135F63', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Volunteer Portal
                </Typography>
              </Box>
            </Box>

            <IconButton
              size="small"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ color: colors.text.secondary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Volunteer Portal Label */}
          <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
            <Typography
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                color: '#52796F',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Volunteer Menu
            </Typography>
          </Box>

          {/* Nav list */}
          <Box sx={{ px: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <Box
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.75,
                    py: 1.25,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#D5E7DB' : 'transparent',
                    color: isActive ? '#135F63' : '#1F2937',
                    fontWeight: 800,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: isActive ? '#D5E7DB' : 'rgba(0, 0, 0, 0.04)',
                      color: '#135F63',
                    },
                    '& .MuiSvgIcon-root': {
                      color: isActive ? '#135F63' : '#374151',
                      fontSize: 20,
                    },
                  }}
                >
                  {item.icon}
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: 'inherit' }}>{item.label}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Drawer Profile footer */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${colors.surface.sidebarBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#135F63', color: '#FFFFFF', fontWeight: 800 }}>
            {volunteerInitials}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: colors.text.primary, lineHeight: 1.2 }}>
              {volunteerName}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#52796F' }}>
              Volunteer
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* 3. Desktop Layout */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
        {/* Desktop Fixed Sidebar */}
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', md: 'flex' },
            width: 250,
            flexShrink: 0,
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: colors.surface.sidebar,
            color: colors.text.primary,
            borderRight: `1px solid ${colors.surface.sidebarBorder}`,
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 1100,
            userSelect: 'none',
          }}
        >
          <Box>
            {/* Brand Header */}
            <Box
              sx={{
                height: 64,
                px: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderBottom: `1px solid ${colors.surface.sidebarBorder}`,
              }}
            >
              <Box
                component="img"
                src="/ridetrack-emblem.png"
                alt="RideTrack Logo"
                sx={{
                  height: 34,
                  maxWidth: 82,
                  width: 'auto',
                  borderRadius: '7px',
                  objectFit: 'contain',
                  flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                }}
              />
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: colors.text.primary,
                    lineHeight: 1.1,
                  }}
                >
                  RideTrack
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#135F63',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    mt: 0.25,
                  }}
                >
                  Volunteer Portal
                </Typography>
              </Box>
            </Box>

            {/* Navigation Header */}
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  color: '#52796F',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Navigation
              </Typography>
            </Box>

            {/* Nav list - strictly ONLY Home and Scanner */}
            <Box sx={{ px: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {navItems.map((item) => {
                const isActive = activeNavId === item.id;
                return (
                  <Box
                    key={item.id}
                    component="button"
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 1.75,
                      py: 1.25,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: isActive ? '#D5E7DB' : 'transparent',
                      color: isActive ? '#135F63' : '#1F2937',
                      fontWeight: 800,
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      '&:hover': {
                        backgroundColor: isActive ? '#D5E7DB' : 'rgba(0, 0, 0, 0.04)',
                        color: '#135F63',
                      },
                      '& .MuiSvgIcon-root': {
                        color: isActive ? '#135F63' : '#374151',
                        fontSize: 22,
                      },
                    }}
                  >
                    {item.icon}
                    <Typography sx={{ fontSize: '0.925rem', fontWeight: 800, color: 'inherit' }}>
                      {item.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Profile Card at bottom of Sidebar */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${colors.surface.sidebarBorder}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
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
                {volunteerInitials}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    color: colors.text.primary,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {volunteerName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#52796F',
                    lineHeight: 1.2,
                  }}
                >
                  Volunteer
                </Typography>
              </Box>
            </Box>

            {onLogout && (
              <Box
                component="button"
                type="button"
                onClick={onLogout}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  py: 1,
                  px: 1.5,
                  borderRadius: '8px',
                  border: `1px solid ${colors.surface.sidebarBorder}`,
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: '#FEE2E2',
                    borderColor: '#FCA5A5',
                    color: '#B91C1C',
                  },
                }}
              >
                <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
                Logout
              </Box>
            )}
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            ml: { xs: 0, md: '250px' }, // Offset for fixed sidebar
            pb: { xs: '64px', md: 4 }, // Space for mobile bottom nav
          }}
        >
          {/* Desktop Top Header */}
          <Box
            component="header"
            sx={{
              display: { xs: 'none', md: 'flex' },
              height: 64,
              backgroundColor: colors.surface.header,
              borderBottom: `1px solid ${colors.surface.border}`,
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 4,
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
            }}
          >
            {/* Left: Branding & Role */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                component="img"
                src="/ridetrack-emblem.png"
                alt="RideTrack"
                sx={{
                  height: 24,
                  width: 'auto',
                  borderRadius: '5px',
                  objectFit: 'contain',
                }}
              />
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: colors.text.primary,
                  letterSpacing: '-0.01em',
                }}
              >
                RideTrack
              </Typography>
              <Box
                sx={{
                  width: '1px',
                  height: 18,
                  backgroundColor: colors.surface.border,
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: colors.text.secondary,
                  fontWeight: 500,
                }}
              >
                Volunteer Checkpoint Portal
              </Typography>
            </Box>

            {/* Right: Notifications, Help, User profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <RideIconButton label="Notifications" size="sm" variant="default">
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
              </RideIconButton>

              <RideIconButton label="Help" size="sm" variant="default">
                <HelpOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              </RideIconButton>

              <Box
                sx={{
                  width: '1px',
                  height: 24,
                  backgroundColor: colors.surface.border,
                  mx: 0.5,
                }}
              />

              {/* Profile Pill */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  pl: 0.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    backgroundColor: colors.brand.accent,
                    color: '#FFFFFF',
                  }}
                >
                  {volunteerInitials}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: colors.text.primary,
                      lineHeight: 1.2,
                    }}
                  >
                    {volunteerName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      color: colors.text.muted,
                      lineHeight: 1.2,
                    }}
                  >
                    Volunteer
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Page Content Container */}
          <Box sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
            {children}
          </Box>
        </Box>
      </Box>

      {/* 4. Mobile Bottom Navigation (Visible on < md) */}
      <Box
        component="nav"
        aria-label="Volunteer Mobile Navigation"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: '#FFFFFF',
          borderTop: `1px solid ${colors.surface.border}`,
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 1000,
          boxShadow: '0 -2px 10px 0 rgba(15, 23, 42, 0.05)',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeNavId === item.id;
          return (
            <Box
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.25,
                cursor: 'pointer',
                color: isActive ? colors.brand.accent : colors.text.muted,
                transition: 'color 0.15s ease',
              }}
            >
              {item.icon}
              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
