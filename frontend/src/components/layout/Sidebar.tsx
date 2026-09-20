import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { NAV_ITEMS } from './navItems';
import { colors } from '../../theme/colors';

export interface SidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onNavigate,
  onLogout,
  collapsed = false,
  onToggleCollapse,
}) => {
  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <Box
      component="aside"
      aria-label="Desktop Main Navigation"
      sx={{
        width: sidebarWidth,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: colors.surface.sidebar, // Light sage green (#EBF2ED)
        borderRight: `1px solid ${colors.surface.sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1100,
        userSelect: 'none',
        transition: 'width 0.2s ease-in-out',
        overflowX: 'hidden',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          height: 64,
          px: collapsed ? 1.5 : 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: `1px solid ${colors.surface.sidebarBorder}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          {/* Logo Badge */}
          <Box
            component="img"
            src="/ridetrack-emblem.png"
            alt="RideTrack Logo"
            sx={{
              height: collapsed ? 24 : 34,
              maxWidth: collapsed ? 50 : 82,
              width: 'auto',
              borderRadius: '7px',
              objectFit: 'contain',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          />

          {!collapsed && (
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: colors.text.primary,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              RideTrack
            </Typography>
          )}
        </Box>

        {/* Collapse / Expand Toggle Button */}
        {onToggleCollapse && (
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: colors.text.secondary,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  color: colors.text.primary,
                },
              }}
            >
              {collapsed ? <ChevronRightIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Navigation List */}
      <Box
        component="nav"
        sx={{
          flex: 1,
          px: collapsed ? 1 : 1.5,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          overflowY: 'auto',
          alignItems: collapsed ? 'center' : 'stretch',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;

          const buttonContent = (
            <Box
              key={item.id}
              component="button"
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: 1.5,
                px: collapsed ? 1 : 1.75,
                py: 1.2,
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? colors.surface.sidebarActive : 'transparent',
                color: isActive ? colors.surface.sidebarActiveText : colors.text.secondary,
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: isActive ? colors.surface.sidebarActive : 'rgba(0, 0, 0, 0.04)',
                  color: colors.text.primary,
                  '& .sidebar-icon': {
                    color: colors.brand.primary,
                  },
                },
              }}
            >
              <Box
                className="sidebar-icon"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? colors.brand.primary : colors.text.muted,
                  transition: 'color 0.15s ease',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Box>

              {!collapsed && (
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.01em',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    color: isActive ? colors.surface.sidebarActiveText : colors.text.secondary,
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          );

          return collapsed ? (
            <Tooltip key={item.id} title={item.label} placement="right" arrow>
              {buttonContent}
            </Tooltip>
          ) : (
            buttonContent
          );
        })}
      </Box>

      {/* Bottom Area: ONLY show the existing Logout action */}
      <Box
        sx={{
          p: collapsed ? 1.5 : 2,
          borderTop: `1px solid ${colors.surface.sidebarBorder}`,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {onLogout && (
          collapsed ? (
            <Tooltip title="Logout" placement="right" arrow>
              <IconButton
                onClick={onLogout}
                aria-label="Logout"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                  border: `1px solid ${colors.surface.border}`,
                  backgroundColor: '#FFFFFF',
                  color: colors.text.secondary,
                  '&:hover': {
                    backgroundColor: '#FEF2F2',
                    borderColor: '#FECACA',
                    color: '#DC2626',
                  },
                }}
              >
                <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          ) : (
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
                px: 2,
                borderRadius: '8px',
                border: `1px solid ${colors.surface.border}`,
                backgroundColor: '#FFFFFF',
                color: colors.text.secondary,
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: '#FEF2F2',
                  borderColor: '#FECACA',
                  color: '#DC2626',
                },
              }}
            >
              <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
              Logout
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};
