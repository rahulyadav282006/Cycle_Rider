import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Drawer,
} from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';

export type AdminPrototypeState =
  | 'dashboard'
  | 'organizers'
  | 'add_organizer'
  | 'organizer_details'
  | 'all_events'
  | 'settings'
  | 'reports'
  | 'report_detail'
  | 'empty_states';

export interface AdminShellProps {
  children: React.ReactNode;
  activeNavId: 'dashboard' | 'organizers' | 'events' | 'reports' | 'settings';
  onNavigate: (id: 'dashboard' | 'organizers' | 'events' | 'reports' | 'settings') => void;
  activePrototypeState?: AdminPrototypeState;
  onPrototypeStateChange?: (state: AdminPrototypeState) => void;
  onExitAdmin?: () => void;
  onLogout?: () => void;
  showPrototypeSwitcher?: boolean;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  activeNavId,
  onNavigate,
  activePrototypeState = 'dashboard',
  onPrototypeStateChange,
  onExitAdmin,
  onLogout,
  showPrototypeSwitcher = false,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: <SpaceDashboardOutlinedIcon sx={{ fontSize: 20 }} /> },
    { id: 'organizers' as const, label: 'Organizers', icon: <PeopleAltOutlinedIcon sx={{ fontSize: 20 }} /> },
    { id: 'events' as const, label: 'All Events', icon: <EventAvailableOutlinedIcon sx={{ fontSize: 20 }} /> },
    { id: 'reports' as const, label: 'Platform Reports', icon: <AssessmentOutlinedIcon sx={{ fontSize: 20 }} /> },
    { id: 'settings' as const, label: 'System Settings', icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} /> },
  ];

  const prototypeStates: { key: AdminPrototypeState; label: string }[] = [
    { key: 'dashboard', label: '1. Platform Dashboard' },
    { key: 'organizers', label: '2. Organizers' },
    { key: 'add_organizer', label: '3. Add Organizer' },
    { key: 'organizer_details', label: '4. Organizer Details' },
    { key: 'all_events', label: '5. All Events' },
    { key: 'settings', label: '6. System Settings' },
    { key: 'reports', label: '7. Platform Reports' },
    { key: 'report_detail', label: '8. Platform Report Detail' },
    { key: 'empty_states', label: '9. Empty States' },
  ];

  const handleNavClick = (id: 'dashboard' | 'organizers' | 'events' | 'reports' | 'settings') => {
    setMobileDrawerOpen(false);
    onNavigate(id);
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
      {/* 1. Mobile Header (< md) */}
      <Box
        component="header"
        sx={{
          display: { xs: 'flex', md: 'none' },
          height: 56,
          px: 2,
          backgroundColor: colors.surface.sidebar,
          color: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <IconButton
            size="small"
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ color: '#FFFFFF' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                backgroundColor: colors.brand.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <DirectionsBikeIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
              RideTrack
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: '4px',
              backgroundColor: 'rgba(67, 56, 202, 0.2)',
              color: '#A5B4FC',
              border: '1px solid rgba(165, 180, 252, 0.4)',
              fontSize: '0.6875rem',
              fontWeight: 700,
            }}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 12 }} />
            Super Admin
          </Box>
          {onLogout && (
            <IconButton
              size="small"
              onClick={onLogout}
              title="Logout"
              sx={{
                color: '#F87171',
                p: 0.5,
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
              }}
            >
              <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* 2. Mobile Drawer (< md) */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              backgroundColor: colors.surface.sidebar,
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
            },
          },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
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
                <DirectionsBikeIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  RideTrack
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                  Super Admin Console
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)} sx={{ color: '#94A3B8' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <Box
                  key={item.id}
                  component="button"
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.25,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? colors.surface.sidebarActive : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    '&:hover': {
                      backgroundColor: colors.surface.sidebarActive,
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {item.icon}
                  {item.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {onExitAdmin && (
            <RideButton
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => {
                setMobileDrawerOpen(false);
                onExitAdmin();
              }}
              sx={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              Exit to Organizer
            </RideButton>
          )}
          {onLogout && (
            <RideButton
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => {
                setMobileDrawerOpen(false);
                onLogout();
              }}
              sx={{
                color: '#F87171',
                borderColor: 'rgba(239, 68, 68, 0.35)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.25)', borderColor: '#EF4444' },
              }}
            >
              <LogoutOutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
              Logout
            </RideButton>
          )}
        </Box>
      </Drawer>

      {/* 3. Main Desktop Body */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
        {/* Desktop Sidebar (>= md) */}
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            width: 250,
            flexShrink: 0,
            backgroundColor: colors.surface.sidebar,
            color: '#FFFFFF',
            borderRight: `1px solid ${colors.brand.primaryLight}`,
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: 1100,
          }}
        >
          {/* Brand Header */}
          <Box
            sx={{
              height: 64,
              px: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '6px',
                backgroundColor: colors.brand.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
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
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                }}
              >
                RideTrack
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                <ShieldOutlinedIcon sx={{ fontSize: 11, color: '#38BDF8' }} />
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.04em' }}>
                  SUPER ADMIN
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Navigation Items */}
          <Box
            component="nav"
            sx={{
              flex: 1,
              px: 1.5,
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              overflowY: 'auto',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <Box
                  key={item.id}
                  component="button"
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    backgroundColor: isActive ? colors.surface.sidebarActive : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      backgroundColor: colors.surface.sidebarActive,
                      color: '#FFFFFF',
                    },
                  }}
                >
                  <Box sx={{ color: isActive ? '#38BDF8' : '#94A3B8', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'inherit', color: 'inherit' }}>
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Profile & Exit Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                }}
              >
                SA
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                  Super Admin
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  admin@ridetrack.com
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {onExitAdmin && (
                <Box
                  component="button"
                  type="button"
                  onClick={onExitAdmin}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.75,
                    py: 0.75,
                    px: 1,
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: '#CBD5E1',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  Exit to Organizer
                </Box>
              )}

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
                    gap: 0.75,
                    py: 0.85,
                    px: 1.5,
                    borderRadius: '6px',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#FCA5A5',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.25)',
                      color: '#FFFFFF',
                      borderColor: 'rgba(239, 68, 68, 0.6)',
                    },
                  }}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
                  Logout
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            ml: { xs: 0, md: '250px' },
          }}
        >
          {/* Top Prototype State Switcher Bar (optional / hidden in production) */}
          {showPrototypeSwitcher && onPrototypeStateChange && (
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                borderBottom: `1px solid ${colors.surface.border}`,
                px: { xs: 2, sm: 3, md: 4 },
                py: 1.25,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
                <LayersOutlinedIcon sx={{ fontSize: 18, color: colors.primary.main }} />
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: colors.text.secondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Super Admin Prototype States:
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {prototypeStates.map((s) => {
                  const isSelected = activePrototypeState === s.key;
                  return (
                    <Box
                      key={s.key}
                      component="button"
                      type="button"
                      onClick={() => onPrototypeStateChange(s.key)}
                      sx={{
                        px: 1.25,
                        py: 0.4,
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 700 : 500,
                        border: '1px solid',
                        borderColor: isSelected ? colors.primary.main : colors.surface.borderStrong,
                        backgroundColor: isSelected ? colors.brand.accentLight : 'transparent',
                        color: isSelected ? colors.primary.dark : colors.text.secondary,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          backgroundColor: isSelected ? colors.brand.accentLight : colors.surface.subtle,
                        },
                      }}
                    >
                      {s.label}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Page Contents */}
          <Box sx={{ flex: 1, width: '100%' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
