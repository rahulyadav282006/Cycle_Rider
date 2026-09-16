import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../ui/RideButton';

export interface ArchiveEventDialogProps {
  open: boolean;
  eventName: string;
  onClose: () => void;
  onConfirmArchive: () => void;
}

export const ArchiveEventDialog: React.FC<ArchiveEventDialogProps> = ({
  open,
  eventName,
  onClose,
  onConfirmArchive,
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
            border: `1px solid ${colors.surface.borderStrong}`,
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.15)',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2, px: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.status.error.dot,
              flexShrink: 0,
            }}
          >
            <WarningAmberOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text.primary, fontSize: '1.125rem' }}>
            Archive Event?
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 1.5 }}>
        <Typography sx={{ color: colors.text.secondary, fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Are you sure you want to archive <strong>{eventName}</strong>?
        </Typography>
        <Typography sx={{ color: colors.text.muted, fontSize: '0.8125rem', mt: 1, lineHeight: 1.5 }}>
          Archiving will remove this event from active operations. Historical rider records and checkpoint data will remain in storage.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, pt: 1, gap: 1 }}>
        <RideButton variant="secondary" onClick={onClose}>
          Cancel
        </RideButton>
        <RideButton
          variant="primary"
          onClick={onConfirmArchive}
          sx={{
            backgroundColor: colors.status.error.dot,
            borderColor: colors.status.error.dot,
            '&:hover': {
              backgroundColor: '#B91C1C',
              borderColor: '#B91C1C',
            },
          }}
        >
          Archive Event
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};
