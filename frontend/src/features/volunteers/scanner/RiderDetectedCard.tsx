import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';
import { DetectedRider } from './ScannerTypes';

export interface RiderDetectedCardProps {
  rider: DetectedRider;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RiderDetectedCard: React.FC<RiderDetectedCardProps> = ({
  rider,
  onConfirm,
  onCancel,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 460,
        backgroundColor: colors.surface.card,
        border: `2px solid ${colors.brand.accent}`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px -4px rgba(2, 132, 199, 0.18), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Top Banner: ✓ Rider QR Detected */}
      <Box
        sx={{
          backgroundColor: '#0284C7',
          color: '#FFFFFF',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 22, color: '#38BDF8' }} />
        <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.01em' }}>
          Rider QR Detected
        </Typography>
      </Box>

      {/* Main Details Body */}
      <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Rider Identification Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: '#EFF6FF',
            borderRadius: '8px',
            border: '1px solid #BFDBFE',
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#DBEAFE',
                color: '#1D4ED8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonOutlineOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 800, color: colors.text.primary, lineHeight: 1.2 }}>
                {rider.name}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                Registered Participant
              </Typography>
            </Box>
          </Box>

          <Typography
            component="span"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              fontWeight: 800,
              color: '#1E40AF',
              backgroundColor: '#FFFFFF',
              border: '1px solid #93C5FD',
              px: 1.25,
              py: 0.5,
              borderRadius: '6px',
            }}
          >
            {rider.riderId}
          </Typography>
        </Box>

        {/* Verification Metadata Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
            mb: 3,
          }}
        >
          {/* Jersey Number */}
          <Box sx={{ p: 1.5, backgroundColor: colors.surface.page, borderRadius: '6px', border: `1px solid ${colors.surface.border}` }}>
            <Typography variant="caption" sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.text.muted, display: 'block', textTransform: 'uppercase' }}>
              Jersey Number
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <BadgeOutlinedIcon sx={{ fontSize: 16, color: colors.brand.accent }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: colors.text.primary }}>
                {rider.jerseyNumber}
              </Typography>
            </Box>
          </Box>

          {/* Scan Time */}
          <Box sx={{ p: 1.5, backgroundColor: colors.surface.page, borderRadius: '6px', border: `1px solid ${colors.surface.border}` }}>
            <Typography variant="caption" sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.text.muted, display: 'block', textTransform: 'uppercase' }}>
              Scan Time
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: colors.text.primary, fontFamily: 'monospace' }}>
                {rider.scanTime}
              </Typography>
            </Box>
          </Box>

          {/* Checkpoint */}
          <Box sx={{ gridColumn: 'span 2', p: 1.5, backgroundColor: colors.surface.page, borderRadius: '6px', border: `1px solid ${colors.surface.border}` }}>
            <Typography variant="caption" sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.text.muted, display: 'block', textTransform: 'uppercase' }}>
              Checkpoint
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 16, color: colors.brand.accent }} />
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.text.primary }}>
                {rider.checkpoint}
              </Typography>
            </Box>
          </Box>

          {/* Event */}
          <Box sx={{ gridColumn: 'span 2', p: 1.5, backgroundColor: colors.surface.page, borderRadius: '6px', border: `1px solid ${colors.surface.border}` }}>
            <Typography variant="caption" sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.text.muted, display: 'block', textTransform: 'uppercase' }}>
              Event
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <EventAvailableOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.secondary }}>
                {rider.event}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons: Confirm Arrival (Primary) & Cancel / Scan Again (Secondary) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <RideButton
            variant="primary"
            size="lg"
            fullWidth
            startIcon={<HowToRegOutlinedIcon sx={{ fontSize: 22 }} />}
            onClick={onConfirm}
            sx={{
              minHeight: 52,
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              backgroundColor: '#0284C7',
              boxShadow: '0 4px 10px 0 rgba(2, 132, 199, 0.3)',
              '&:hover': {
                backgroundColor: '#0369A1',
              },
            }}
          >
            Confirm Arrival
          </RideButton>

          <RideButton
            variant="secondary"
            size="md"
            fullWidth
            startIcon={<ReplayOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onCancel}
            sx={{
              minHeight: 44,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Cancel / Scan Again
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
