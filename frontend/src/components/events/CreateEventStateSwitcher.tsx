import React from 'react';
import { Box, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { colors } from '../../theme/colors';

export type CreateEventVisualState = 'default' | 'filled' | 'validation_error' | 'submitting' | 'success';

export interface CreateEventStateSwitcherProps {
  currentState: CreateEventVisualState;
  onStateChange: (state: CreateEventVisualState) => void;
}

export const CreateEventStateSwitcher: React.FC<CreateEventStateSwitcherProps> = ({
  currentState,
  onStateChange,
}) => {
  const states: { id: CreateEventVisualState; label: string }[] = [
    { id: 'default', label: 'Default' },
    { id: 'filled', label: 'Filled' },
    { id: 'validation_error', label: 'Validation Error' },
    { id: 'submitting', label: 'Submitting' },
    { id: 'success', label: 'Success' },
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: 1.5,
        mb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TuneIcon sx={{ fontSize: 18, color: colors.brand.accent }} />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: colors.text.secondary,
          }}
        >
          Visual State Preview:
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {states.map((s) => {
          const isSelected = currentState === s.id;
          return (
            <Box
              component="button"
              type="button"
              key={s.id}
              onClick={() => onStateChange(s.id)}
              sx={{
                minHeight: 32,
                px: 1.5,
                py: 0.5,
                borderRadius: '6px',
                border: `1px solid ${isSelected ? colors.brand.primary : colors.surface.border}`,
                backgroundColor: isSelected ? colors.brand.primary : colors.surface.subtle,
                color: isSelected ? '#FFFFFF' : colors.text.primary,
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  backgroundColor: isSelected ? colors.brand.primaryLight : colors.surface.border,
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.brand.accent}`,
                  outlineOffset: '2px',
                },
              }}
            >
              {s.label}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
