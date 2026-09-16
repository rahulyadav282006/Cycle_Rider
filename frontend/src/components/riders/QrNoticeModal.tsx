import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';

export interface QrNoticeModalProps {
  open: boolean;
  onClose: () => void;
  riderId: string;
  riderName: string;
}

export const QrNoticeModal: React.FC<QrNoticeModalProps> = ({
  open,
  onClose,
  riderId,
  riderName,
}) => {
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
          <QrCode2OutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        QR Code Generation
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
          Target Route: /riders/{riderId.toLowerCase()}/qr
        </Box>

        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.5,
            mb: 2,
          }}
        >
          Rider <strong>{riderName}</strong> ({riderId}) is queued for QR credential generation.
        </Typography>

        {/* Security & Privacy Notice (Rule 14) */}
        <Box
          sx={{
            p: 1.5,
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <SecurityOutlinedIcon sx={{ fontSize: 18, color: '#16A34A', mt: 0.2, flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.75rem', color: '#166534', lineHeight: 1.4 }}>
            <strong>Privacy & Security Rule:</strong> In accordance with RideTrack architecture, the QR code encodes <strong>ONLY the unique Rider ID ({riderId})</strong>. No personal or emergency data is embedded in the QR payload.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <RideButton variant="primary" size="sm" onClick={onClose} fullWidth>
          Understood
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};
