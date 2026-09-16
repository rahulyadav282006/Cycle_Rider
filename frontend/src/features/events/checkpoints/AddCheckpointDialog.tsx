import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import { colors } from '../../../theme/colors';
import { CheckpointForm, CheckpointFormData, CheckpointFormErrors, CheckpointFormFieldValue } from './CheckpointForm';
import { CheckpointItem, CheckpointType } from './mockCheckpointData';

export interface AddCheckpointDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newCheckpoint: Omit<CheckpointItem, 'id' | 'volunteersAssigned'>) => void;
  isFilledPreview?: boolean;
}

export const AddCheckpointDialog: React.FC<AddCheckpointDialogProps> = ({
  open,
  onClose,
  onAdd,
  isFilledPreview = false,
}) => {
  const [formData, setFormData] = useState<CheckpointFormData>({
    name: '',
    type: '',
    sequence: '',
    requirement: 'Mandatory',
  });

  const [errors, setErrors] = useState<CheckpointFormErrors>({});

  useEffect(() => {
    if (open) {
      if (isFilledPreview) {
        setFormData({
          name: 'Water Station',
          type: 'Refreshment',
          sequence: '06',
          requirement: 'Optional',
        });
      } else {
        setFormData({
          name: '',
          type: '',
          sequence: '',
          requirement: 'Mandatory',
        });
      }
      setErrors({});
    }
  }, [open, isFilledPreview]);

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

    onAdd({
      name: formData.name.trim(),
      type: formData.type as CheckpointType,
      sequence: Number(formData.sequence),
      requirement: formData.requirement,
    });
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
              backgroundColor: colors.brand.accentLight,
              color: colors.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AddLocationAltOutlinedIcon sx={{ fontSize: 22 }} />
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
              Add Checkpoint
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
              Add a checkpoint to the event route.
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
          submitLabel="Add Checkpoint"
          isEdit={false}
        />
      </DialogContent>
    </Dialog>
  );
};
