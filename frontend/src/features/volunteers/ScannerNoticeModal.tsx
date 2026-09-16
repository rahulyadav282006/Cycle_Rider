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
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';

export interface ScannerNoticeModalProps {
  open: boolean;
  onClose: () => void;
  checkpointName: string;
}

export const ScannerNoticeModal: React.FC<ScannerNoticeModalProps> = ({
  open,
  onClose,
  checkpointName,
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
            borderRadius: '10px',
            border: `1px solid ${colors.surface.border}`,
            p: 1,
            boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.15)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
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
            <QrCodeScannerOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', color: colors.text.primary }}>
            QR Scanner Ready
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="Close">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <Box
          sx={{
            p: 2,
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            mb: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#1E40AF',
              mb: 0.5,
            }}
          >
            Checkpoint: {checkpointName}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: '#1E3A8A',
              lineHeight: 1.4,
            }}
          >
            Camera verification pipeline is configured for rider check-in at this station.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#10B981' }} />
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              Fast Rider QR code matrix decoding
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#10B981' }} />
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              Instant local timestamp recording
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#10B981' }} />
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              Offline sync queue supported
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: '0.75rem',
            color: colors.text.muted,
            mt: 2,
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          Dedicated Scanner UI screen will be implemented in the next milestone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <RideButton variant="primary" size="md" fullWidth onClick={onClose} sx={{ minHeight: 44 }}>
          Got It
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};
