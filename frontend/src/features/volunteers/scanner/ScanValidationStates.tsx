import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WrongLocationOutlinedIcon from '@mui/icons-material/WrongLocationOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';
import { DetectedRider } from './ScannerTypes';

export interface ScanValidationStatesProps {
  type: 'duplicate' | 'invalid' | 'wrong-checkpoint';
  rider?: DetectedRider;
  currentCheckpoint?: string;
  onScanAgain: () => void;
  onNavigateHome: () => void;
}

export const ScanValidationStates: React.FC<ScanValidationStatesProps> = ({
  type,
  rider,
  currentCheckpoint = 'Assigned Checkpoint',
  onScanAgain,
  onNavigateHome,
}) => {
  // 1. Duplicate Scan State
  if (type === 'duplicate') {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: 460,
          backgroundColor: colors.surface.card,
          border: '2px solid #F59E0B',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.18)',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#F59E0B',
            color: '#FFFFFF',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <WarningAmberOutlinedIcon sx={{ fontSize: 26 }} />
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', lineHeight: 1.2 }}>
              Already Scanned
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', opacity: 0.95 }}>
              Duplicate scan prevention active
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#FFFBEB',
              borderRadius: '8px',
              border: '1px solid #FDE68A',
              mb: 2.5,
            }}
          >
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#92400E', mb: 1 }}>
              {rider?.name || 'Rider'} has already been recorded at:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 0.5 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#B45309' }}>
                Checkpoint: <strong>{rider?.checkpoint || currentCheckpoint}</strong>
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#B45309' }}>
                Recorded at: <strong>{rider?.scanTime || 'Previously recorded'}</strong>
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#92400E', fontWeight: 700, mt: 0.5 }}>
                Do NOT create another scan.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <RideButton
              variant="primary"
              size="lg"
              fullWidth
              startIcon={<QrCodeScannerOutlinedIcon sx={{ fontSize: 22 }} />}
              onClick={onScanAgain}
              sx={{
                minHeight: 52,
                fontSize: '1rem',
                fontWeight: 800,
                backgroundColor: '#D97706',
                '&:hover': { backgroundColor: '#B45309' },
              }}
            >
              Scan Another Rider
            </RideButton>

            <RideButton
              variant="secondary"
              size="md"
              fullWidth
              startIcon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={onNavigateHome}
              sx={{ minHeight: 44 }}
            >
              Back to Volunteer Home
            </RideButton>
          </Box>
        </Box>
      </Box>
    );
  }

  // 2. Invalid QR State
  if (type === 'invalid') {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: 460,
          backgroundColor: colors.surface.card,
          border: '2px solid #EF4444',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px -4px rgba(239, 68, 68, 0.18)',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <ErrorOutlineOutlinedIcon sx={{ fontSize: 26 }} />
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', lineHeight: 1.2 }}>
              Invalid Rider QR
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', opacity: 0.95 }}>
              QR code verification error
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              border: '1px solid #FECACA',
              mb: 2.5,
            }}
          >
            <Typography sx={{ fontSize: '0.875rem', color: '#991B1B', lineHeight: 1.5 }}>
              This QR code is not recognized as a registered RideTrack rider. Please ensure the rider is scanning their official event tag.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <RideButton
              variant="primary"
              size="lg"
              fullWidth
              startIcon={<QrCodeScannerOutlinedIcon sx={{ fontSize: 22 }} />}
              onClick={onScanAgain}
              sx={{
                minHeight: 52,
                fontSize: '1rem',
                fontWeight: 800,
                backgroundColor: '#DC2626',
                '&:hover': { backgroundColor: '#B91C1C' },
              }}
            >
              Scan Again
            </RideButton>

            <RideButton
              variant="secondary"
              size="md"
              fullWidth
              startIcon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={onNavigateHome}
              sx={{ minHeight: 44 }}
            >
              Back to Volunteer Home
            </RideButton>
          </Box>
        </Box>
      </Box>
    );
  }

  // 3. Wrong Checkpoint State
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 460,
        backgroundColor: colors.surface.card,
        border: '2px solid #F97316',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px -4px rgba(249, 115, 22, 0.18)',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#F97316',
          color: '#FFFFFF',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <WrongLocationOutlinedIcon sx={{ fontSize: 26 }} />
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', lineHeight: 1.2 }}>
            Wrong Checkpoint
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', opacity: 0.95 }}>
            Route checkpoint mismatch
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            p: 2,
            backgroundColor: '#FFF7ED',
            borderRadius: '8px',
            border: '1px solid #FFEDD5',
            mb: 2.5,
          }}
        >
          <Typography sx={{ fontSize: '0.875rem', color: '#9A3412', lineHeight: 1.5, mb: 1 }}>
            This rider cannot be recorded at the current checkpoint. Checkpoint sequence order has not been met.
          </Typography>
          <Box
            sx={{
              p: 1.25,
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              border: '1px solid #FED7AA',
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '0.6875rem', color: colors.text.muted, display: 'block', textTransform: 'uppercase' }}>
              Current Checkpoint Station
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: '#C2410C' }}>
              {currentCheckpoint}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <RideButton
            variant="primary"
            size="lg"
            fullWidth
            startIcon={<QrCodeScannerOutlinedIcon sx={{ fontSize: 22 }} />}
            onClick={onScanAgain}
            sx={{
              minHeight: 52,
              fontSize: '1rem',
              fontWeight: 800,
              backgroundColor: '#EA580C',
              '&:hover': { backgroundColor: '#C2410C' },
            }}
          >
            Scan Again
          </RideButton>

          <RideButton
            variant="secondary"
            size="md"
            fullWidth
            startIcon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onNavigateHome}
            sx={{ minHeight: 44 }}
          >
            Back to Volunteer Home
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
