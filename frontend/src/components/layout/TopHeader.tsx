import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

export interface TopHeaderProps {
  pageTitle?: string;
  breadcrumb?: string[];
  onToggleSidebar?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).toLowerCase();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).toLowerCase()
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left: Hamburger menu toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          edge="start"
          aria-label="Toggle navigation menu"
          onClick={onToggleSidebar}
          sx={{
            color: '#475569',
            '&:hover': {
              backgroundColor: '#F1F5F9',
            },
          }}
        >
          <MenuIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Right: Status Pill, Clock, Bell, Help, Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 } }}>
        {/* System Online Status Badge */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 0.85,
            backgroundColor: '#E6F4EA',
            color: '#065F46',
            borderRadius: '9999px',
            px: 1.5,
            py: 0.45,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          System Online
        </Box>

        {/* Live Clock */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.75,
            color: '#334155',
            fontSize: '0.825rem',
            fontWeight: 500,
          }}
        >
          <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <span>{currentTime}</span>
        </Box>

        {/* Notification Bell */}
        <IconButton
          size="small"
          aria-label="Notifications"
          sx={{
            color: '#475569',
            '&:hover': {
              backgroundColor: '#F1F5F9',
            },
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Help Circle */}
        <IconButton
          size="small"
          aria-label="Help & Documentation"
          sx={{
            color: '#475569',
            '&:hover': {
              backgroundColor: '#F1F5F9',
            },
          }}
        >
          <HelpOutlineOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* User Profile Card */}
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
              backgroundColor: '#14B8A6',
              color: '#FFFFFF',
            }}
          >
            OA
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#0F172A',
                lineHeight: 1.2,
              }}
            >
              Organizer Admin
            </Typography>
            <Typography
              sx={{
                fontSize: '0.7rem',
                color: '#64748B',
                lineHeight: 1.2,
              }}
            >
              Organizer
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
