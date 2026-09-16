import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditLocationAltOutlinedIcon from '@mui/icons-material/EditLocationAltOutlined';
import { colors } from '../../../theme/colors';
import { CheckpointForm, CheckpointFormData, CheckpointFormErrors, CheckpointFormFieldValue } from './CheckpointForm';
import { CheckpointItem, CheckpointType } from './mockCheckpointData';

export interface EditCheckpointDialogProps {
  open: boolean;
  checkpoint: CheckpointItem | null;
  onClose: () => void;
  onSave: (updated: CheckpointItem) => void;
}

export const EditCheckpointDialog: React.FC<EditCheckpointDialogProps> = ({
  open,
  checkpoint,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CheckpointFormData>({
    name: 'Lunch',
    type: 'Refreshment',
    sequence: '06',
    requirement: 'Optional',
  });

  const [errors, setErrors] = useState<CheckpointFormErrors>({});

  useEffect(() => {
    if (open) {
      if (checkpoint) {
        setFormData({
          name: checkpoint.name,
          type: checkpoint.type,
          sequence: checkpoint.sequence.toString().padStart(2, '0'),
          requirement: checkpoint.requirement,
        });
      } else {
        // Default example populated data per spec:
        setFormData({
          name: 'Lunch',
          type: 'Refreshment',
          sequence: '06',
          requirement: 'Optional',
        });
      }
      setErrors({});
    }
  }, [open, checkpoint]);

  const handleChange = (field: keyof CheckpointFormData, value: CheckpointFormFieldValue) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof CheckpointFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: CheckpointFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Checkpoint name is required.';
    }
    if (!formData.type) {
      newErrors.type = 'Checkpoint type is required.';
    }
    if (!formData.sequence || String(formData.sequence).trim() === '') {
      newErrors.sequence = 'Sequence number is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      newErrors.general = 'Please fix the highlighted fields before saving.';
      setErrors(newErrors);
      return;
    }

    if (checkpoint) {
      onSave({
        ...checkpoint,
        name: formData.name.trim(),
        type: formData.type as CheckpointType,
        sequence: Number(formData.sequence),
        requirement: formData.requirement,
      });
    }
    onClose();
  };

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
            boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2.5, sm: 3 },
          py: 2,
          borderBottom: `1px solid ${colors.surface.border}`,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              backgroundColor: colors.surface.subtle,
              color: colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EditLocationAltOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.01em',
              }}
            >
              Edit Checkpoint
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
              Update checkpoint configuration and requirement.
            </Typography>
          </Box>
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
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, backgroundColor: '#FFFFFF' }}>
        <CheckpointForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Save Changes"
          isEdit={true}
          assignedVolunteersCount={checkpoint?.volunteersAssigned ?? 0}
        />
      </DialogContent>
    </Dialog>
  );
};
