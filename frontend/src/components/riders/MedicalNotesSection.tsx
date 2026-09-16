import React from 'react';
import { Box, Typography } from '@mui/material';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { colors } from '../../theme/colors';
import { RiderFormField } from './RiderFormField';

export interface MedicalNotesSectionProps {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const MedicalNotesSection: React.FC<MedicalNotesSectionProps> = ({
  value,
  error,
  disabled = false,
  onChange,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3.5 },
        mb: 3.5,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2.5,
          pb: 1.5,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <MedicalServicesOutlinedIcon sx={{ fontSize: 20, color: colors.brand.accent }} />
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: colors.text.primary,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            Medical Notes
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
            Allergies, chronic conditions, or medications for course medical volunteers.
          </Typography>
        </Box>
      </Box>

      {/* Multiline Textarea */}
      <RiderFormField
        label="Medical Notes"
        required
        errorText={error}
        helperText="Add information that may be important during the ride (or enter 'None')."
        htmlFor="rider-medical-notes-input"
      >
        <Box
          component="textarea"
          id="rider-medical-notes-input"
          rows={3}
          disabled={disabled}
          placeholder="Enter relevant medical notes or 'None'..."
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          sx={{
            width: '100%',
            p: 1.5,
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            color: colors.text.primary,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${error ? colors.status.error.border : colors.surface.borderStrong}`,
            borderRadius: '6px',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:hover:not(:disabled)': {
              borderColor: colors.brand.accent,
            },
            '&:focus': {
              borderColor: colors.brand.accent,
              outline: `2px solid ${colors.brand.accent}`,
              outlineOffset: '1px',
            },
            '&:disabled': {
              backgroundColor: colors.surface.subtle,
              color: colors.text.secondary,
              cursor: 'not-allowed',
            },
            '&::placeholder': {
              color: colors.text.muted,
              fontSize: '0.8125rem',
            },
          }}
        />
      </RiderFormField>
    </Box>
  );
};
