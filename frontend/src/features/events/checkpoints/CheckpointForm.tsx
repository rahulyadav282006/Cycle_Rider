import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';
import {
  CheckpointType,
  CheckpointRequirement,
  CHECKPOINT_TYPES,
} from './mockCheckpointData';

export interface CheckpointFormData {
  name: string;
  type: CheckpointType | '';
  sequence: string | number;
  requirement: CheckpointRequirement;
}

export interface CheckpointFormErrors {
  name?: string;
  type?: string;
  sequence?: string;
  general?: string;
}

export type CheckpointFormFieldValue =
  | string
  | number
  | CheckpointType
  | CheckpointRequirement;

export interface CheckpointFormProps {
  formData: CheckpointFormData;
  errors?: CheckpointFormErrors;
  onChange: (field: keyof CheckpointFormData, value: CheckpointFormFieldValue) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
  isEdit?: boolean;
  assignedVolunteersCount?: number;
  showErrorSummary?: boolean;
}

export const CheckpointForm: React.FC<CheckpointFormProps> = ({
  formData,
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  submitLabel = 'Add Checkpoint',
  isEdit = false,
  assignedVolunteersCount,
  showErrorSummary = false,
}) => {
  const hasErrors =
    showErrorSummary ||
    Boolean(errors.name || errors.sequence || errors.type || errors.general);

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ width: '100%' }}>
      {/* Top Error Summary Banner */}
      {hasErrors && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: 1.5,
            mb: 2.5,
            backgroundColor: colors.status.error.bg,
            border: `1px solid ${colors.status.error.border}`,
            borderRadius: '6px',
            color: colors.status.error.text,
          }}
        >
          <ErrorOutlineOutlinedIcon sx={{ fontSize: 20, color: colors.status.error.dot, flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {errors.general || 'Please fix the highlighted fields before saving.'}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
            placeholder="e.g. Water Station"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange('name', e.target.value)
            }
            sx={{
              width: '100%',
              height: 44,
              px: 1.5,
              fontSize: '0.875rem',
              color: colors.text.primary,
              backgroundColor: '#FFFFFF',
              border: `1px solid ${
                errors.name ? colors.status.error.dot : colors.surface.borderStrong
              }`,
              borderRadius: '6px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              '&:focus': {
                borderColor: errors.name ? colors.status.error.dot : colors.brand.accent,
                boxShadow: `0 0 0 2px ${
                  errors.name ? 'rgba(220, 38, 38, 0.15)' : 'rgba(2, 132, 199, 0.15)'
                }`,
              },
            }}
          />
          {errors.name && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.75,
                color: colors.status.error.dot,
              }}
            >
              <ErrorOutlineOutlinedIcon sx={{ fontSize: 15 }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {errors.name}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 2-Column Row: Checkpoint Type * & Sequence Number * */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {/* Checkpoint Type * */}
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
              displayEmpty
              value={formData.type}
              onChange={(e) =>
                onChange('type', e.target.value as CheckpointType)
              }
              sx={{
                height: 44,
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '0.875rem',
                '& fieldset': {
                  borderColor: errors.type
                    ? colors.status.error.dot
                    : colors.surface.borderStrong,
                },
                '&:hover fieldset': {
                  borderColor: colors.text.secondary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.brand.accent,
                },
              }}
            >
              <MenuItem value="" disabled>
                <em>Select type...</em>
              </MenuItem>
              {CHECKPOINT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
            {errors.type && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.75,
                  color: colors.status.error.dot,
                }}
              >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {errors.type}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Sequence Number * */}
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
              type="text"
              placeholder="06"
              value={formData.sequence}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange('sequence', e.target.value)
              }
              sx={{
                width: '100%',
                height: 44,
                px: 1.5,
                fontSize: '0.875rem',
                color: colors.text.primary,
                backgroundColor: '#FFFFFF',
                border: `1px solid ${
                  errors.sequence
                    ? colors.status.error.dot
                    : colors.surface.borderStrong
                }`,
                borderRadius: '6px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                '&:focus': {
                  borderColor: errors.sequence
                    ? colors.status.error.dot
                    : colors.brand.accent,
                  boxShadow: `0 0 0 2px ${
                    errors.sequence
                      ? 'rgba(220, 38, 38, 0.15)'
                      : 'rgba(2, 132, 199, 0.15)'
                  }`,
                },
              }}
            />
            {errors.sequence && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.75,
                  color: colors.status.error.dot,
                }}
              >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {errors.sequence}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Mandatory / Optional Radio Control */}
        <Box>
          <Box
            sx={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: colors.text.primary,
              mb: 0.75,
            }}
          >
            Mandatory / Optional *
          </Box>
          <RadioGroup
            row
            value={formData.requirement}
            onChange={(e) =>
              onChange('requirement', e.target.value as CheckpointRequirement)
            }
            sx={{ gap: 2 }}
          >
            <FormControlLabel
              value="Mandatory"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: colors.surface.borderStrong,
                    '&.Mui-checked': {
                      color: colors.primary.main,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                  Mandatory
                </Typography>
              }
            />
            <FormControlLabel
              value="Optional"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: colors.surface.borderStrong,
                    '&.Mui-checked': {
                      color: colors.primary.main,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                  Optional
                </Typography>
              }
            />
          </RadioGroup>

          {/* Small Informational Note */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              mt: 1.25,
              p: 1.25,
              backgroundColor: colors.surface.subtle,
              borderRadius: '6px',
              border: `1px solid ${colors.surface.border}`,
            }}
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 17, color: colors.primary.main, mt: '1px', flexShrink: 0 }}
            />
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, lineHeight: 1.45 }}>
              Mandatory checkpoints are required for the rider&apos;s event timeline.
              Optional checkpoints may be skipped.
            </Typography>
          </Box>
        </Box>

        {/* Section for Edit Mode: Volunteers Assigned */}
        {isEdit && (
          <Box
            sx={{
              p: 1.5,
              backgroundColor: colors.surface.page,
              border: `1px dashed ${colors.surface.borderStrong}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <PeopleAltOutlinedIcon sx={{ fontSize: 20, color: colors.text.muted }} />
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
                Checkpoint currently assigned:
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                {assignedVolunteersCount ?? 0} volunteers
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Action Buttons: [Cancel] and [Submit] */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1.5,
          mt: 3.5,
          pt: 2.5,
          borderTop: `1px solid ${colors.surface.border}`,
        }}
      >
        <RideButton variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </RideButton>
        <RideButton variant="primary" type="submit">
          {submitLabel}
        </RideButton>
      </Box>
    </Box>
  );
};
