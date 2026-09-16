import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { colors } from '../../theme/colors';
import { NAV_ITEMS } from './navItems';

export interface SidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeId, onNavigate, onLogout }) => {
  return (
    <Box
      component="aside"
      aria-label="Desktop Main Navigation"
      sx={{
        width: 250,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: colors.surface.sidebar,
        color: '#FFFFFF',
        borderRight: `1px solid ${colors.brand.primaryLight}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1100,
        userSelect: 'none',
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
        </Box>
      </Box>

      {/* Navigation List */}
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
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;

          return (
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
                transition: 'all 0.15s ease-in-out',
                position: 'relative',
                '&:hover': {
                  backgroundColor: isActive ? colors.surface.sidebarActive : 'rgba(255, 255, 255, 0.08)',
                  '& .sidebar-label': {
                    color: '#FFFFFF',
                  },
                  '& .sidebar-icon': {
                    color: '#FFFFFF',
                  },
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.brand.accent}`,
                  outlineOffset: '2px',
                },
              }}
            >
              {/* Active vertical accent bar */}
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
                className="sidebar-icon"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#38BDF8' : '#CBD5E1', // High contrast slate-300 / sky-400
                  transition: 'color 0.15s ease',
                }}
              >
                {item.icon}
              </Box>
              <Typography
                component="span"
                className="sidebar-label"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.01em',
                  color: isActive ? '#FFFFFF' : '#E2E8F0', // High contrast visible slate-200 / white
                  transition: 'color 0.15s ease',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* User / Profile Area (Visual Only) */}
      <Box
        sx={{
          p: 1.75,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1,
            py: 0.75,
            borderRadius: '6px',
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
            OP
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#FFFFFF',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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

        {onLogout && (
          <Box
            component="button"
            type="button"
            onClick={onLogout}
            sx={{
              mt: 1.25,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              py: 0.75,
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
  );
};
