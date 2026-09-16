import React, { useState } from 'react';
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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';
import {
  CheckpointType,
  CheckpointRequirement,
  CHECKPOINT_TYPES,
} from './mockCheckpointsData';

export interface EditCheckpointModalProps {
  open: boolean;
  onClose: () => void;
  onSavedSuccess?: () => void;
}

export type EditCheckpointVisualState =
  | 'default'
  | 'modified'
  | 'validation_error'
  | 'saving'
  | 'success';

export const EditCheckpointModal: React.FC<EditCheckpointModalProps> = ({
  open,
  onClose,
  onSavedSuccess,
}) => {
  const [visualState, setVisualState] = useState<EditCheckpointVisualState>('default');

  // Fields
  const [name, setName] = useState<string>('Lunch');
  const [type, setType] = useState<CheckpointType>('Refreshment');
  const [sequence, setSequence] = useState<string>('06');
  const [requirement, setRequirement] = useState<CheckpointRequirement>('Optional');

  const [errors, setErrors] = useState<{
    name?: string;
    sequence?: string;
  }>({});

  const handleStateChange = (state: EditCheckpointVisualState) => {
    setVisualState(state);

    if (state === 'default') {
      setName('Lunch');
      setType('Refreshment');
      setSequence('06');
      setRequirement('Optional');
      setErrors({});
    } else if (state === 'modified') {
      setName('Lunch Station (Mandatory)');
      setType('Refreshment');
      setSequence('06');
      setRequirement('Mandatory');
      setErrors({});
    } else if (state === 'validation_error') {
      setName('');
      setType('Refreshment');
      setSequence('06');
      setRequirement('Optional');
      setErrors({
        name: 'Checkpoint name is required.',
      });
    } else if (state === 'saving') {
      setName('Lunch');
      setType('Refreshment');
      setSequence('06');
      setRequirement('Optional');
      setErrors({});
    } else if (state === 'success') {
      setName('Lunch');
      setType('Refreshment');
      setSequence('06');
      setRequirement('Optional');
      setErrors({});
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Checkpoint name is required.' });
      setVisualState('validation_error');
      return;
    }
    setVisualState('saving');
    setTimeout(() => {
      setVisualState('success');
      if (onSavedSuccess) onSavedSuccess();
    }, 500);
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
            border: `1px solid ${colors.surface.borderStrong}`,
            p: 1,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
          },
        },
      }}
    >
      {/* State Switcher inside modal for reviewer */}
      <Box
        sx={{
          backgroundColor: colors.surface.subtle,
          borderBottom: `1px solid ${colors.surface.border}`,
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted }}>
          Edit Checkpoint States:
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {[
            { id: 'default', label: 'Default' },
            { id: 'modified', label: 'Modified' },
            { id: 'validation_error', label: 'Error' },
            { id: 'saving', label: 'Saving' },
            { id: 'success', label: 'Success' },
          ].map((st) => (
            <Box
              key={st.id}
              component="button"
              type="button"
              onClick={() => handleStateChange(st.id as EditCheckpointVisualState)}
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                fontSize: '0.6875rem',
                fontWeight: visualState === st.id ? 700 : 500,
                cursor: 'pointer',
                border: `1px solid ${
                  visualState === st.id ? colors.primary.main : colors.surface.borderStrong
                }`,
                backgroundColor:
                  visualState === st.id ? '#EFF6FF' : colors.surface.card,
                color: visualState === st.id ? colors.primary.main : colors.text.secondary,
              }}
            >
              {st.label}
            </Box>
          ))}
        </Box>
      </Box>

      {visualState === 'success' ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              color: colors.status.success,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircleOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text.primary, mb: 1 }}>
            Checkpoint Updated
          </Typography>
          <Typography sx={{ color: colors.text.secondary, fontSize: '0.9375rem', mb: 3 }}>
            <strong>Lunch</strong> checkpoint has been updated successfully.
          </Typography>
          <RideButton variant="primary" onClick={onClose}>
            Done
          </RideButton>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle sx={{ pb: 1, pt: 2, px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text.primary }}>
                Edit Checkpoint
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 3, py: 2 }}>
            {/* Field 1: Checkpoint Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                component="label"
                htmlFor="edit-checkpoint-name"
                sx={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 0.75,
                }}
              >
                Checkpoint Name *
              </Typography>
              <Box
                component="input"
                id="edit-checkpoint-name"
                disabled={visualState === 'saving'}
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                sx={{
                  width: '100%',
                  height: 40,
                  px: 1.5,
                  fontSize: '0.875rem',
                  color: colors.text.primary,
                  backgroundColor: colors.surface.card,
                  border: `1px solid ${
                    errors.name ? colors.status.error.dot : colors.surface.borderStrong
                  }`,
                  borderRadius: '6px',
                  outline: 'none',
                }}
              />
              {errors.name && (
                <Typography
                  sx={{
                    color: colors.status.error.dot,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <ErrorOutlinedIcon sx={{ fontSize: 13 }} />
                  {errors.name}
                </Typography>
              )}
            </Box>

            {/* Field 2: Checkpoint Type */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                component="label"
                htmlFor="edit-checkpoint-type"
                sx={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 0.75,
                }}
              >
                Checkpoint Type *
              </Typography>
              <Select
                id="edit-checkpoint-type"
                disabled={visualState === 'saving'}
                value={type}
                onChange={(e) => setType(e.target.value as CheckpointType)}
                fullWidth
                size="small"
                sx={{ height: 40, fontSize: '0.875rem', borderRadius: '6px' }}
              >
                {CHECKPOINT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Field 3: Sequence */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                component="label"
                htmlFor="edit-checkpoint-seq"
                sx={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 0.75,
                }}
              >
                Sequence Number *
              </Typography>
              <Box
                component="input"
                id="edit-checkpoint-seq"
                disabled={visualState === 'saving'}
                value={sequence}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSequence(e.target.value);
                  if (errors.sequence) setErrors((prev) => ({ ...prev, sequence: undefined }));
                }}
                sx={{
                  width: '100%',
                  height: 40,
                  px: 1.5,
                  fontSize: '0.875rem',
                  color: colors.text.primary,
                  backgroundColor: colors.surface.card,
                  border: `1px solid ${
                    errors.sequence ? colors.status.error : colors.surface.borderStrong
                  }`,
                  borderRadius: '6px',
                  outline: 'none',
                }}
              />
            </Box>

            {/* Field 4: Requirement */}
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 0.75,
                }}
              >
                Requirement *
              </Typography>
              <RadioGroup
                row
                value={requirement}
                onChange={(e) => setRequirement(e.target.value as CheckpointRequirement)}
              >
                <FormControlLabel
                  value="Mandatory"
                  control={<Radio size="small" />}
                  label={<Typography sx={{ fontSize: '0.875rem' }}>Mandatory</Typography>}
                  disabled={visualState === 'saving'}
                />
                <FormControlLabel
                  value="Optional"
                  control={<Radio size="small" />}
                  label={<Typography sx={{ fontSize: '0.875rem' }}>Optional</Typography>}
                  disabled={visualState === 'saving'}
                />
              </RadioGroup>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
            <RideButton variant="secondary" onClick={onClose} disabled={visualState === 'saving'}>
              Cancel
            </RideButton>
            <RideButton
              variant="primary"
              type="submit"
              disabled={visualState === 'saving'}
              startIcon={
                visualState === 'saving' ? <CircularProgress size={16} color="inherit" /> : undefined
              }
            >
              {visualState === 'saving' ? 'Saving Changes...' : 'Save Changes'}
            </RideButton>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};
