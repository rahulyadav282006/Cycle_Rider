import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';
import { DetectedRider } from './ScannerTypes';

export interface ScanSuccessStateProps {
  rider: DetectedRider;
  onScanNext: () => void;
  onNavigateHome: () => void;
}

export const ScanSuccessState: React.FC<ScanSuccessStateProps> = ({
  rider,
  onScanNext,
  onNavigateHome,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 460,
        backgroundColor: colors.surface.card,
        border: '2px solid #10B981',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.18), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Top Banner: ✓ Scan Recorded */}
      <Box
        sx={{
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 26 }} />
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', letterSpacing: '0.01em', lineHeight: 1.2 }}>
            Scan Recorded
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', opacity: 0.9 }}>
            Rider arrival confirmed at checkpoint
          </Typography>
        </Box>
      </Box>

      {/* Details Box */}
      <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Status Confirmation Pill */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.75,
            backgroundColor: '#ECFDF5',
            borderRadius: '8px',
            border: '1px solid #A7F3D0',
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#065F46' }}>
              Status: Confirmed
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#065F46',
            }}
          >
            VERIFIED
          </Typography>
        </Box>

        {/* Info Grid */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            p: 2,
            backgroundColor: colors.surface.page,
            borderRadius: '8px',
            border: `1px solid ${colors.surface.border}`,
            mb: 3,
          }}
        >
          {/* Rider */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                Rider
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: colors.text.primary }}>
                {rider.name}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: colors.brand.accent,
                  backgroundColor: colors.brand.accentLight,
                  px: 0.75,
                  py: 0.15,
                  borderRadius: '4px',
                }}
              >
                {rider.riderId}
              </Typography>
            </Box>
          </Box>

          {/* Checkpoint */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                Checkpoint
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {rider.checkpoint}
            </Typography>
          </Box>

          {/* Recorded At */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                Recorded
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'monospace', color: colors.text.primary }}>
              {rider.scanTime}
            </Typography>
          </Box>
        </Box>

        {/* Actions: Scan Next Rider (Primary) & Back to Volunteer Home (Secondary) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <RideButton
            variant="primary"
            size="lg"
            fullWidth
            startIcon={<QrCodeScannerOutlinedIcon sx={{ fontSize: 22 }} />}
            onClick={onScanNext}
            sx={{
              minHeight: 52,
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              backgroundColor: '#10B981',
              boxShadow: '0 4px 10px 0 rgba(16, 185, 129, 0.3)',
              '&:hover': {
                backgroundColor: '#059669',
              },
            }}
          >
            Scan Next Rider
          </RideButton>

          <RideButton
            variant="secondary"
            size="md"
            fullWidth
            startIcon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onNavigateHome}
            sx={{
              minHeight: 44,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Back to Volunteer Home
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
