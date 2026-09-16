import React from 'react';
import { Box, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { colors } from '../../theme/colors';

export interface EventFormFieldProps {
  label: string;
  required?: boolean;
  errorText?: string;
  helperText?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export const EventFormField: React.FC<EventFormFieldProps> = ({
  label,
  required = false,
  errorText,
  helperText,
  htmlFor,
  children,
}) => {
  const isError = Boolean(errorText);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Label Row */}
      <Box
        component="label"
        htmlFor={htmlFor}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: isError ? colors.status.error.dot : colors.text.primary,
          mb: 0.75,
        }}
      >
        <span>{label}</span>
        {required && (
          <Box
            component="span"
            sx={{
              color: colors.status.error.dot,
              fontWeight: 700,
              fontSize: '0.875rem',
              lineHeight: 1,
            }}
          >
            *
          </Box>
        )}
      </Box>

      {/* Input Control Child */}
      {children}

      {/* Error or Helper Message */}
      {isError ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
            color: colors.status.error.dot,
          }}
        >
          <ErrorIcon sx={{ fontSize: 14, flexShrink: 0 }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            {errorText}
          </Typography>
        </Box>
      ) : helperText ? (
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: colors.text.muted,
            mt: 0.5,
            lineHeight: 1.3,
          }}
        >
          {helperText}
        </Typography>
      ) : null}
    </Box>
  );
};
