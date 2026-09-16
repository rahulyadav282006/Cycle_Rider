import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';
import {
  Checkpoint,
  CheckpointType,
  CheckpointRequirement,
  CHECKPOINT_TYPES,
} from './mockCheckpointsData';

export interface AddEditCheckpointModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData?: Checkpoint | null;
  defaultSequence?: number;
  onClose: () => void;
  onSave: (data: {
    name: string;
    type: CheckpointType;
    sequence: number;
    requirement: CheckpointRequirement;
  }) => void;
}

export const AddEditCheckpointModal: React.FC<AddEditCheckpointModalProps> = ({
  open,
  mode,
  initialData,
  defaultSequence = 1,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<CheckpointType>('Checkpoint');
  const [sequence, setSequence] = useState<number>(defaultSequence);
  const [requirement, setRequirement] = useState<CheckpointRequirement>('Mandatory');

  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    sequence?: string;
  }>({});

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setName(initialData.name);
        setType(initialData.type);
        setSequence(initialData.sequence);
        setRequirement(initialData.requirement);
      } else {
        setName('');
        setType('Checkpoint');
        setSequence(defaultSequence);
        setRequirement('Mandatory');
      }
      setErrors({});
      setIsSaving(false);
    }
  }, [open, mode, initialData, defaultSequence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; type?: string; sequence?: string } = {};
    if (!name.trim()) newErrors.name = 'Checkpoint Name is required.';
    if (!type) newErrors.type = 'Checkpoint Type is required.';
    if (!sequence || sequence < 1) newErrors.sequence = 'Sequence Number is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      onSave({
        name: name.trim(),
        type,
        sequence: Number(sequence),
        requirement,
      });
      onClose();
    }, 600);
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '8px',
            border: `1px solid ${colors.surface.border}`,
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
          },
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: { xs: 2.5, sm: 3 },
            py: 2.5,
            borderBottom: `1px solid ${colors.surface.border}`,
            color: colors.text.primary,
            fontWeight: 700,
            fontSize: '1.125rem',
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
            }}
          >
            <FlagOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          {mode === 'add' ? 'Add Checkpoint' : 'Edit Checkpoint'}
        </DialogTitle>

        {/* Dialog Content with Form Fields */}
        <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* 1. Checkpoint Name * */}
          <Box>
            <Box
              component="label"
              htmlFor="checkpoint-name-input"
              sx={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: errors.name ? colors.status.error.dot : colors.text.primary,
                mb: 0.75,
              }}
            >
              Checkpoint Name *
            </Box>
            <Box
              component="input"
              id="checkpoint-name-input"
              type="text"
              disabled={isSaving}
              placeholder="e.g. Registration, Start, CP1, Breakfast"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              sx={{
                width: '100%',
                height: 44,
                px: 1.5,
                fontSize: '0.875rem',
                color: colors.text.primary,
                backgroundColor: isSaving ? colors.surface.subtle : '#FFFFFF',
                border: `1px solid ${errors.name ? colors.status.error.dot : colors.surface.borderStrong}`,
                borderRadius: '6px',
                outline: 'none',
                boxSizing: 'border-box',
                '&:focus': {
                  borderColor: errors.name ? colors.status.error.dot : colors.brand.accent,
                  boxShadow: `0 0 0 2px ${errors.name ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'}`,
                },
              }}
            />
            {errors.name && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: colors.status.error.dot }}>
                <ErrorIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{errors.name}</Typography>
              </Box>
            )}
          </Box>

          {/* 2-Column Grid: Checkpoint Type * & Sequence Number * */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            {/* 2. Checkpoint Type * */}
            <Box>
              <Box
                component="label"
                htmlFor="checkpoint-type-select"
                sx={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: errors.type ? colors.status.error.dot : colors.text.primary,
                  mb: 0.75,
                }}
              >
                Checkpoint Type *
              </Box>
              <Select
                id="checkpoint-type-select"
                fullWidth
                size="small"
                disabled={isSaving}
                value={type}
                onChange={(e) => {
                  setType(e.target.value as CheckpointType);
                  if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
                }}
                sx={{
                  height: 44,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  '& fieldset': {
                    borderColor: errors.type ? colors.status.error.dot : colors.surface.borderStrong,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.text.secondary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.brand.accent,
                  },
                }}
              >
                {CHECKPOINT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: colors.status.error.dot }}>
                  <ErrorIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{errors.type}</Typography>
                </Box>
              )}
            </Box>

            {/* 3. Sequence Number * */}
            <Box>
              <Box
                component="label"
                htmlFor="checkpoint-sequence-input"
                sx={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: errors.sequence ? colors.status.error.dot : colors.text.primary,
                  mb: 0.75,
                }}
              >
                Sequence Number *
              </Box>
              <Box
                component="input"
                id="checkpoint-sequence-input"
                type="number"
                min="1"
                disabled={isSaving}
                value={sequence}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSequence(Number(e.target.value));
                  if (errors.sequence) setErrors((prev) => ({ ...prev, sequence: undefined }));
                }}
                sx={{
                  width: '100%',
                  height: 44,
                  px: 1.5,
                  fontSize: '0.875rem',
                  color: colors.text.primary,
                  backgroundColor: isSaving ? colors.surface.subtle : '#FFFFFF',
                  border: `1px solid ${errors.sequence ? colors.status.error.dot : colors.surface.borderStrong}`,
                  borderRadius: '6px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  '&:focus': {
                    borderColor: errors.sequence ? colors.status.error.dot : colors.brand.accent,
                    boxShadow: `0 0 0 2px ${errors.sequence ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'}`,
                  },
                }}
              />
              {errors.sequence && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: colors.status.error.dot }}>
                  <ErrorIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{errors.sequence}</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* 4. Checkpoint Requirement * (Mandatory vs Optional) */}
          <Box>
            <Box
              sx={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: colors.text.primary,
                mb: 1,
              }}
            >
              Checkpoint Requirement *
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {(['Mandatory', 'Optional'] as CheckpointRequirement[]).map((req) => {
                const isSelected = requirement === req;
                return (
                  <Box
                    key={req}
                    component="button"
                    type="button"
                    disabled={isSaving}
                    onClick={() => setRequirement(req)}
                    sx={{
                      height: 44,
                      borderRadius: '6px',
                      border: `1px solid ${isSelected ? (req === 'Mandatory' ? '#059669' : colors.brand.primary) : colors.surface.borderStrong}`,
                      backgroundColor: isSelected ? (req === 'Mandatory' ? '#ECFDF5' : colors.surface.subtle) : '#FFFFFF',
                      color: isSelected ? (req === 'Mandatory' ? '#065F46' : colors.text.primary) : colors.text.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-in-out',
                      '&:hover': {
                        borderColor: req === 'Mandatory' ? '#059669' : colors.text.secondary,
                      },
                    }}
                  >
                    {req}
                  </Box>
                );
              })}
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, mt: 0.75 }}>
              Mandatory checkpoints require bib scanning for riders to earn completion credits.
            </Typography>
          </Box>
        </DialogContent>

        {/* Dialog Actions: Cancel & Submit Button */}
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3 },
            py: 2,
            borderTop: `1px solid ${colors.surface.border}`,
            gap: 1.5,
          }}
        >
          <RideButton
            variant="secondary"
            size="md"
            disabled={isSaving}
            onClick={onClose}
            sx={{ minHeight: 44, minWidth: 90 }}
          >
            Cancel
          </RideButton>

          <RideButton
            variant="primary"
            size="md"
            type="submit"
            disabled={isSaving}
            sx={{ minHeight: 44, minWidth: 130, fontWeight: 700 }}
          >
            {isSaving ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />
                <span>Saving...</span>
              </Box>
            ) : mode === 'add' ? (
              'Add Checkpoint'
            ) : (
              'Save Changes'
            )}
          </RideButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
