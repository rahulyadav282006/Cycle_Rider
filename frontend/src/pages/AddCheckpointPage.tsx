import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { PageContainer } from '../components/layout/PageContainer';
import { colors } from '../theme/colors';
import { RideButton } from '../components/ui/RideButton';
import {
  CheckpointType,
  CheckpointRequirement,
  CHECKPOINT_TYPES,
} from '../components/checkpoints/mockCheckpointsData';
import { checkpointService } from '../api/services';

export interface AddCheckpointPageProps {
  eventId?: string;
  onBackToCheckpoints: () => void;
}

export const AddCheckpointPage: React.FC<AddCheckpointPageProps> = ({
  eventId,
  onBackToCheckpoints,
}) => {
  // Form inputs
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<CheckpointType>('Checkpoint');
  const [sequence, setSequence] = useState<string>('');
  const [requirement, setRequirement] = useState<CheckpointRequirement>('Mandatory');

  const [errors, setErrors] = useState<{
    name?: string;
    sequence?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; sequence?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Checkpoint name is required.';
    }
    if (!sequence.trim()) {
      newErrors.sequence = 'Sequence number is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      if (eventId) {
        await checkpointService.createCheckpoint(eventId, {
          name: name.trim(),
          sequenceNumber: Number(sequence) || 1,
          type: type,
          mandatory: requirement === 'Mandatory',
        });
      }
      setIsSuccess(true);
    } catch (err: any) {
      setErrors({ name: err?.message || 'Failed to add checkpoint. Please verify backend connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%', pb: 6 }}>
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <Box
            component="button"
            type="button"
            onClick={onBackToCheckpoints}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: colors.text.secondary,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              p: 0,
              fontSize: '0.875rem',
              fontWeight: 600,
              '&:hover': { color: colors.text.primary },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Back to Checkpoints
          </Box>
        </Box>

        {/* Header Title */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: colors.text.primary,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
            }}
          >
            Add Checkpoint
          </Typography>
          <Typography sx={{ color: colors.text.secondary, mt: 0.5, fontSize: '0.9375rem' }}>
            Define a new checkpoint stop along the cycling route.
          </Typography>
        </Box>

        {/* Success State */}
        {isSuccess ? (
          <Box
            sx={{
              backgroundColor: colors.surface.card,
              border: `1px solid ${colors.surface.borderStrong}`,
              borderRadius: '8px',
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
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
              <CheckCircleOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary, mb: 1 }}>
              Checkpoint Added
            </Typography>

            <Typography sx={{ color: colors.text.secondary, fontSize: '0.9375rem', mb: 3 }}>
              <strong>{name}</strong> has been added to the event checkpoints.
            </Typography>

            <RideButton variant="primary" onClick={onBackToCheckpoints}>
              Back to Checkpoints
            </RideButton>
          </Box>
        ) : (
          /* Add Checkpoint Form */
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: colors.surface.card,
              border: `1px solid ${colors.surface.borderStrong}`,
              borderRadius: '8px',
              p: { xs: 2.5, sm: 4 },
              boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
            }}
          >
            {/* Field 1: Checkpoint Name */}
            <Box sx={{ mb: 3 }}>
              <Typography
                component="label"
                htmlFor="checkpoint-name-input"
                sx={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 1,
                }}
              >
                Checkpoint Name *
              </Typography>
              <Box
                component="input"
                id="checkpoint-name-input"
                disabled={isSubmitting}
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Lunch"
                sx={{
                  width: '100%',
                  height: 44,
                  px: 1.5,
                  fontSize: '0.875rem',
                  color: colors.text.primary,
                  backgroundColor: colors.surface.card,
                  border: `1px solid ${
                    errors.name ? colors.status.error : colors.surface.borderStrong
                  }`,
                  borderRadius: '6px',
                  outline: 'none',
                  '&:focus': {
                    borderColor: errors.name ? colors.status.error : colors.primary.main,
                    boxShadow: `0 0 0 3px ${
                      errors.name ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)'
                    }`,
                  },
                }}
              />
              {errors.name && (
                <Typography
                  sx={{
                    color: colors.status.error.dot,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    mt: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <ErrorOutlinedIcon sx={{ fontSize: 14 }} />
                  {errors.name}
                </Typography>
              )}
            </Box>

            {/* Field 2: Checkpoint Type */}
            <Box sx={{ mb: 3 }}>
              <Typography
                component="label"
                htmlFor="checkpoint-type-select"
                sx={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 1,
                }}
              >
                Checkpoint Type *
              </Typography>
              <Select
                id="checkpoint-type-select"
                disabled={isSubmitting}
                value={type}
                onChange={(e) => setType(e.target.value as CheckpointType)}
                fullWidth
                size="small"
                sx={{
                  height: 44,
                  fontSize: '0.875rem',
                  backgroundColor: colors.surface.card,
                  borderRadius: '6px',
                }}
              >
                {CHECKPOINT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Field 3: Sequence Number */}
            <Box sx={{ mb: 3 }}>
              <Typography
                component="label"
                htmlFor="checkpoint-seq-input"
                sx={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 1,
                }}
              >
                Sequence Number *
              </Typography>
              <Box
                component="input"
                id="checkpoint-seq-input"
                disabled={isSubmitting}
                value={sequence}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSequence(e.target.value);
                  if (errors.sequence) setErrors((prev) => ({ ...prev, sequence: undefined }));
                }}
                placeholder="e.g. 06"
                sx={{
                  width: '100%',
                  height: 44,
                  px: 1.5,
                  fontSize: '0.875rem',
                  color: colors.text.primary,
                  backgroundColor: colors.surface.card,
                  border: `1px solid ${
                    errors.sequence ? colors.status.error.dot : colors.surface.borderStrong
                  }`,
                  borderRadius: '6px',
                  outline: 'none',
                  '&:focus': {
                    borderColor: errors.sequence ? colors.status.error.dot : colors.primary.main,
                    boxShadow: `0 0 0 3px ${
                      errors.sequence ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)'
                    }`,
                  },
                }}
              />
              {errors.sequence ? (
                <Typography
                  sx={{
                    color: colors.status.error.dot,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    mt: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <ErrorOutlinedIcon sx={{ fontSize: 14 }} />
                  {errors.sequence}
                </Typography>
              ) : (
                <Typography sx={{ color: colors.text.muted, fontSize: '0.75rem', mt: 0.75 }}>
                  Checkpoint sequence determines the order shown to volunteers and riders.
                </Typography>
              )}
            </Box>

            {/* Field 4: Requirement */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 1,
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
                  label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>Mandatory</Typography>}
                  disabled={isSubmitting}
                />
                <FormControlLabel
                  value="Optional"
                  control={<Radio size="small" />}
                  label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>Optional</Typography>}
                  disabled={isSubmitting}
                />
              </RadioGroup>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 1 }}>
              <RideButton
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
                  )
                }
              >
                {isSubmitting ? 'Adding Checkpoint...' : 'Add Checkpoint'}
              </RideButton>

              <RideButton
                variant="secondary"
                onClick={onBackToCheckpoints}
                disabled={isSubmitting}
              >
                Cancel
              </RideButton>
            </Box>
          </Box>
        )}
      </Box>
    </PageContainer>
  );
};
