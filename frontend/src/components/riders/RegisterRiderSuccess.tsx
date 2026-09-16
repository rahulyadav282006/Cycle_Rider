import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface RegisterRiderSuccessProps {
  summary: {
    riderId: string;
    name: string;
    event: string;
    jerseyNumber: string;
  };
  onGenerateQrCode: () => void;
  onBackToRiders: () => void;
}

export const RegisterRiderSuccess: React.FC<RegisterRiderSuccessProps> = ({
  summary,
  onGenerateQrCode,
  onBackToRiders,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 3, sm: 5 },
        maxWidth: 640,
        mx: 'auto',
        textAlign: 'center',
        boxShadow: '0 2px 4px 0 rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 1. Green Success Badge */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#059669',
          mb: 2.5,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 42 }} />
      </Box>

      {/* 2. Success Title & Message */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.375rem', sm: '1.625rem' },
          fontWeight: 800,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        Rider Registered
      </Typography>

      <Typography
        sx={{
          fontSize: '0.9375rem',
          color: colors.text.secondary,
          maxWidth: 460,
          mb: 3.5,
          lineHeight: 1.5,
        }}
      >
        The rider has been successfully registered for the event.
      </Typography>

      {/* 3. Rider Summary Card */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: colors.surface.page,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          p: 2.5,
          mb: 4,
          textAlign: 'left',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
            pb: 1.5,
            borderBottom: `1px solid ${colors.surface.border}`,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: colors.text.muted,
                display: 'block',
              }}
            >
              Rider Name
            </Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: colors.text.primary }}>
              {summary.name || 'Rahul Patil'}
            </Typography>
          </Box>

          <Box
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: colors.brand.accent,
              backgroundColor: colors.brand.accentLight,
              border: '1px solid #BAE6FD',
              px: 1.25,
              py: 0.4,
              borderRadius: '4px',
            }}
          >
            {summary.riderId || 'RT-0011'}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            fontSize: '0.8125rem',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventAvailableOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', color: colors.text.muted, fontWeight: 600 }}>
                EVENT
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                {summary.event || 'Kolhapur Endurance Ride'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BadgeOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', color: colors.text.muted, fontWeight: 600 }}>
                JERSEY NUMBER
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                #{summary.jerseyNumber || '111'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 4. Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          alignItems: 'center',
          gap: 2,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {/* Secondary: Back to Riders */}
        <RideButton
          variant="secondary"
          size="md"
          startIcon={<ArrowBackIcon />}
          onClick={onBackToRiders}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minHeight: 44,
          }}
        >
          Back to Riders
        </RideButton>

        {/* Primary: Generate QR Code */}
        <RideButton
          variant="primary"
          size="md"
          startIcon={<QrCode2OutlinedIcon />}
          onClick={onGenerateQrCode}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minHeight: 44,
            fontWeight: 700,
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.12)',
          }}
        >
          Generate QR Code
        </RideButton>
      </Box>
    </Box>
  );
};
