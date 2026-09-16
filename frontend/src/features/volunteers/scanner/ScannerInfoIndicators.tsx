import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { colors } from '../../../theme/colors';

export const ScannerInfoIndicators: React.FC = () => {
  const features = [
    'Instant local timestamp',
    'Duplicate scan protection',
    'Offline queue supported',
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 1. Scan Status Area (Default state) */}
      <Box
        sx={{
          p: 2,
          borderRadius: '8px',
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#DBEAFE',
            color: '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E40AF', lineHeight: 1.2 }}>
            Ready to Scan
          </Typography>
          <Typography sx={{ fontSize: '0.78125rem', color: '#1E3A8A' }}>
            Point the camera at a rider QR code.
          </Typography>
        </Box>
      </Box>

      {/* 2. Fast Scan Mode Banner & 3 Features */}
      <Box
        sx={{
          p: 2,
          borderRadius: '8px',
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <BoltOutlinedIcon sx={{ fontSize: 18, color: colors.brand.accent }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: colors.brand.accent,
            }}
          >
            Fast Scan Mode
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mb: 1.5, lineHeight: 1.4 }}>
          QR detection is optimized for rapid rider check-in (under 3 seconds).
        </Typography>

        {/* 3 Checkmark Indicators */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {features.map((feat) => (
            <Box key={feat} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#10B981', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary }}>
                {feat}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
