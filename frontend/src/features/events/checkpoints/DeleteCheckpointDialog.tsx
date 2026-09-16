import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';
import { CheckpointItem } from './mockCheckpointData';

export interface DeleteCheckpointDialogProps {
  open: boolean;
  checkpoint: CheckpointItem | null;
  onClose: () => void;
  onConfirmDelete: (checkpointId: string) => void;
  // Allows demonstrating the warning state when 1 volunteer assigned
  forceVolunteerWarning?: boolean;
}

export const DeleteCheckpointDialog: React.FC<DeleteCheckpointDialogProps> = ({
  open,
  checkpoint,
  onClose,
  onConfirmDelete,
  forceVolunteerWarning = false,
}) => {
  const checkpointName = checkpoint?.name || 'Lunch';
  const volunteersCount = forceVolunteerWarning
    ? 1
    : (checkpoint?.volunteersAssigned ?? 1);

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
            boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.15)',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 1.5,
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: colors.status.error.bg,
              color: colors.status.error.dot,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: colors.text.primary,
            }}
          >
            Delete Checkpoint?
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
          sx={{
            color: colors.text.muted,
            '&:hover': { color: colors.text.primary, backgroundColor: colors.surface.subtle },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, py: 1.5 }}>
        <Typography sx={{ fontSize: '0.875rem', color: colors.text.primary, mb: 1.5 }}>
          Are you sure you want to delete &ldquo;{checkpointName}&rdquo;?
        </Typography>

        <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, mb: 2 }}>
          This checkpoint will be removed from the event route configuration.
        </Typography>

        {/* Warning if volunteers are assigned */}
        {volunteersCount > 0 && (
          <Box
            sx={{
              p: 1.5,
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
            }}
          >
            <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: '#D97706', mt: '1px', flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E', mb: 0.25 }}>
                Warning:
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#92400E', lineHeight: 1.4 }}>
                {volunteersCount} volunteer is currently assigned to this checkpoint.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 2,
          pb: 1.5,
          pt: 1,
          gap: 1.25,
          justifyContent: 'flex-end',
        }}
      >
        <RideButton variant="secondary" onClick={onClose}>
          Cancel
        </RideButton>

        <Box
          component="button"
          type="button"
          onClick={() => {
            if (checkpoint) onConfirmDelete(checkpoint.id);
            onClose();
          }}
          sx={{
            px: 2,
            py: 1,
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            backgroundColor: colors.status.error.dot,
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
            boxShadow: '0 1px 2px 0 rgba(220, 38, 38, 0.2)',
            '&:hover': {
              backgroundColor: '#B91C1C',
            },
          }}
        >
          Delete Checkpoint
        </Box>
      </DialogActions>
    </Dialog>
  );
};
