import React from 'react';
import { Box, Typography } from '@mui/material';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import WifiOffOutlinedIcon from '@mui/icons-material/WifiOffOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';

export interface VolunteerOfflineStatusProps {
  isOffline: boolean;
  onToggleOffline?: () => void;
  variant?: 'banner' | 'pill';
}

export const VolunteerOfflineStatus: React.FC<VolunteerOfflineStatusProps> = ({
  isOffline,
  onToggleOffline,
  variant = 'banner',
}) => {
  if (variant === 'pill') {
    return (
      <Box
        onClick={onToggleOffline}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: '9999px',
          backgroundColor: isOffline ? '#FEF3C7' : '#ECFDF5',
          border: `1px solid ${isOffline ? '#FDE68A' : '#A7F3D0'}`,
          cursor: onToggleOffline ? 'pointer' : 'default',
          userSelect: 'none',
          transition: 'all 0.15s ease',
          '&:hover': onToggleOffline
            ? {
                backgroundColor: isOffline ? '#FDE68A' : '#D1FAE5',
              }
            : {},
        }}
        title="Click to toggle Online/Offline prototype state"
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: isOffline ? '#D97706' : '#10B981',
            boxShadow: isOffline ? 'none' : '0 0 0 2px rgba(16, 185, 129, 0.25)',
          }}
        />
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: isOffline ? '#92400E' : '#065F46',
            lineHeight: 1,
          }}
        >
          {isOffline ? 'Offline' : 'Online'}
        </Typography>
      </Box>
    );
  }

  // Full banner variant
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1.5,
        px: { xs: 2, sm: 2.5 },
        py: 1.25,
        borderRadius: '8px',
        backgroundColor: isOffline ? '#FFFBEB' : '#F0FDF4',
        border: `1px solid ${isOffline ? '#FDE68A' : '#BBF7D0'}`,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
        transition: 'all 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: isOffline ? '#FEF3C7' : '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isOffline ? '#D97706' : '#16A34A',
            flexShrink: 0,
          }}
        >
          {isOffline ? (
            <WifiOffOutlinedIcon sx={{ fontSize: 18 }} />
          ) : (
            <WifiOutlinedIcon sx={{ fontSize: 18 }} />
          )}
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: isOffline ? '#92400E' : '#166534',
              }}
            >
              {isOffline ? 'Offline Mode Active' : 'Connected — Online'}
            </Typography>
            <Box
              component="span"
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                px: 0.8,
                py: 0.15,
                borderRadius: '4px',
                backgroundColor: isOffline ? '#FEF3C7' : '#DCFCE7',
                color: isOffline ? '#B45309' : '#15803D',
              }}
            >
              {isOffline ? 'Offline' : 'Ready to sync'}
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: isOffline ? '#B45309' : '#15803D',
              lineHeight: 1.3,
            }}
          >
            {isOffline
              ? 'Scans will sync automatically when connection returns.'
              : 'Checkpoint scans sync in real time with event control.'}
          </Typography>
        </Box>
      </Box>

      {onToggleOffline && (
        <Box
          component="button"
          type="button"
          onClick={onToggleOffline}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.5,
            py: 0.5,
            fontSize: '0.6875rem',
            fontWeight: 600,
            borderRadius: '6px',
            border: `1px solid ${isOffline ? '#FCD34D' : '#86EFAC'}`,
            backgroundColor: '#FFFFFF',
            color: isOffline ? '#92400E' : '#166534',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: isOffline ? '#FEF3C7' : '#DCFCE7',
            },
          }}
        >
          {isOffline ? (
            <>
              <CloudDoneOutlinedIcon sx={{ fontSize: 14 }} />
              Simulate Online
            </>
          ) : (
            <>
              <SyncOutlinedIcon sx={{ fontSize: 14 }} />
              Simulate Offline
            </>
          )}
        </Box>
      )}
    </Box>
  );
};
