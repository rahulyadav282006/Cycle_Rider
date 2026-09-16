import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { colors } from '../../theme/colors';
import { Rider } from './mockRidersData';
import { RiderStatusBadge } from './RiderStatusBadge';
import { RideButton } from '../ui/RideButton';

export interface RiderProfileModalProps {
  open: boolean;
  onClose: () => void;
  rider: Rider | null;
}

export interface RegisterRiderNoticeModalProps {
  open: boolean;
  onClose: () => void;
}

export const RiderProfileModal: React.FC<RiderProfileModalProps> = ({ open, onClose, rider }) => {
  if (!rider) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '8px',
            border: `1px solid ${colors.surface.border}`,
            boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          backgroundColor: colors.surface.page,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: colors.brand.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.brand.accent,
            }}
          >
            <PersonIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: colors.text.primary, lineHeight: 1.2 }}>
              Rider Profile
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
              Route: /riders/{rider.id.toLowerCase()}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="Close dialog">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ p: 3 }}>
        {/* Main Identity Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: colors.surface.subtle,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            mb: 2.5,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: colors.brand.accent,
                  backgroundColor: colors.brand.accentLight,
                  px: 0.75,
                  py: 0.2,
                  borderRadius: '4px',
                }}
              >
                {rider.id}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  backgroundColor: '#FFFFFF',
                  px: 0.75,
                  py: 0.2,
                  borderRadius: '4px',
                  border: `1px solid ${colors.surface.borderStrong}`,
                }}
              >
                Jersey #{rider.jerseyNo}
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontSize: '1.25rem', fontWeight: 700, color: colors.text.primary }}>
              {rider.name}
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              Registered for {rider.event}
            </Typography>
          </Box>

          <RiderStatusBadge status={rider.status} size="md" />
        </Box>

        {/* Details Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box sx={{ p: 1.5, border: `1px solid ${colors.surface.border}`, borderRadius: '6px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <PhoneOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                Contact Number
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
              {rider.mobile}
            </Typography>
          </Box>

          <Box sx={{ p: 1.5, border: `1px solid ${colors.surface.border}`, borderRadius: '6px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <DirectionsBikeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                Bicycle Type
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
              {rider.bicycleType}
            </Typography>
          </Box>

          <Box sx={{ p: 1.5, border: `1px solid ${colors.surface.border}`, borderRadius: '6px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <ContactEmergencyOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                Emergency Contact
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
              {rider.emergencyContact ? `${rider.emergencyContact.name} (${rider.emergencyContact.relation})` : 'Not provided'}
            </Typography>
            {rider.emergencyContact && (
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                {rider.emergencyContact.phone}
              </Typography>
            )}
          </Box>

          <Box sx={{ p: 1.5, border: `1px solid ${colors.surface.border}`, borderRadius: '6px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                Blood Group
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
              {rider.bloodGroup || 'O+'}
            </Typography>
          </Box>
        </Box>

        {/* QR Generation Prototype Notice (Section 1 requirement) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '6px',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCode2OutlinedIcon sx={{ color: '#16A34A', fontSize: 22 }} />
            <Box>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534' }}>
                Rider QR Pass & Tracking ID
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#15803D' }}>
                QR code is linked to ID: {rider.id} for checkpoint scanner tracking.
              </Typography>
            </Box>
          </Box>
          <RideButton
            variant="secondary"
            size="sm"
            onClick={onClose}
            sx={{
              minHeight: 32,
              fontSize: '0.75rem',
              borderColor: '#86EFAC',
              color: '#166534',
              backgroundColor: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            Generate QR Pass
          </RideButton>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, borderTop: `1px solid ${colors.surface.border}`, pt: 1.5 }}>
        <RideButton variant="secondary" size="sm" onClick={onClose}>
          Close
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};

export const RegisterRiderNoticeModal: React.FC<RegisterRiderNoticeModalProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '8px',
            border: `1px solid ${colors.surface.border}`,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontWeight: 700,
          fontSize: '1.0625rem',
          color: colors.text.primary,
          pb: 1,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: colors.brand.accentLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.brand.accent,
            flexShrink: 0,
          }}
        >
          <PersonAddOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        Register Rider Action
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box
          sx={{
            display: 'inline-block',
            backgroundColor: colors.surface.subtle,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '4px',
            px: 1,
            py: 0.25,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: colors.brand.accentHover,
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          Target Route: /riders/register
        </Box>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.5,
          }}
        >
          The <strong>+ Register Rider</strong> button leads to the individual Rider Registration form. In accordance with the prompt instructions, this dedicated form will be designed as the subsequent UI task.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <RideButton variant="primary" size="sm" onClick={onClose} fullWidth>
          Understood
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};
