import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';
import { Checkpoint } from './mockCheckpointsData';

export interface DeleteCheckpointModalProps {
  open: boolean;
  checkpoint: Checkpoint | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteCheckpointModal: React.FC<DeleteCheckpointModalProps> = ({
  open,
  checkpoint,
  onClose,
  onConfirmDelete,
}) => {
  if (!checkpoint) return null;

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
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
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
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626',
            flexShrink: 0,
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 20 }} />
        </Box>
        Delete Checkpoint?
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.5,
            mb: 1.5,
          }}
        >
          Are you sure you want to remove{' '}
          <Box component="span" sx={{ fontWeight: 700, color: colors.text.primary }}>
            {checkpoint.name} ({checkpoint.type})
          </Box>{' '}
          from the event route?
        </Typography>

        <Box
          sx={{
            p: 1.5,
            borderRadius: '6px',
            backgroundColor: colors.surface.page,
            border: `1px solid ${colors.surface.border}`,
            fontSize: '0.75rem',
            color: colors.text.muted,
          }}
        >
          Rider scan logs for this station will not be allocated unless re-added.
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
        <RideButton
          variant="secondary"
          size="md"
          onClick={onClose}
          sx={{ minHeight: 44 }}
        >
          Cancel
        </RideButton>

        <RideButton
          variant="primary"
          size="md"
          onClick={onConfirmDelete}
          sx={{
            minHeight: 44,
            backgroundColor: '#DC2626',
            borderColor: '#B91C1C',
            '&:hover': {
              backgroundColor: '#B91C1C',
            },
            '&:active': {
              backgroundColor: '#991B1B',
            },
          }}
        >
          Delete Checkpoint
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};
