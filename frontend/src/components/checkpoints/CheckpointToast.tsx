import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

export interface CheckpointToastProps {
  message: string | null;
  onClose: () => void;
}

export const CheckpointToast: React.FC<CheckpointToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 72, md: 32 },
        right: { xs: 16, sm: 32 },
        zIndex: 2000,
        backgroundColor: '#065F46',
        color: '#FFFFFF',
        borderRadius: '8px',
        px: 2.5,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        boxShadow: '0 10px 25px -5px rgba(6, 95, 70, 0.4), 0 4px 6px -2px rgba(6, 95, 70, 0.2)',
        animation: 'slideUp 0.25s ease-out',
        '@keyframes slideUp': {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 20, color: '#A7F3D0' }} />
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
        {message}
      </Typography>
      <IconButton
        size="small"
        aria-label="Close notification"
        onClick={onClose}
        sx={{ color: 'rgba(255, 255, 255, 0.8)', ml: 1, p: 0.25 }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};
