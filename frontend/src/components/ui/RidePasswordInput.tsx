import React, { forwardRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FieldWrapper } from './RideInput';
import { colors } from '../../theme/colors';

export interface RidePasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  size?: 'sm' | 'md';
}

export const RidePasswordInput = forwardRef<HTMLInputElement, RidePasswordInputProps>(({
  label = 'Password',
  helperText,
  errorText,
  id,
  disabled = false,
  required = false,
  placeholder = '••••••••',
  value,
  onChange,
  size = 'md',
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'password-input');
  const isError = Boolean(errorText);

  return (
    <FieldWrapper
      label={label}
      helperText={helperText}
      errorText={errorText}
      required={required}
      disabled={disabled}
      htmlFor={inputId}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
          component="input"
          ref={ref}
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          sx={{
            width: '100%',
            height: size === 'sm' ? 36 : 42,
            pl: 1.5,
            pr: 5, // space for toggle icon
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            color: colors.text.primary,
            backgroundColor: disabled ? colors.surface.subtle : '#FFFFFF',
            border: `1px solid ${isError ? colors.status.error.dot : colors.surface.border}`,
            borderRadius: '6px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:hover:not(:disabled)': {
              borderColor: isError ? colors.status.error.dot : colors.surface.borderStrong,
            },
            '&:focus': {
              borderColor: isError ? colors.status.error.dot : colors.brand.accent,
              boxShadow: isError 
                ? '0 0 0 3px rgba(220, 38, 38, 0.15)' 
                : '0 0 0 3px rgba(2, 132, 199, 0.15)',
            },
            '&:disabled': {
              color: colors.interactive.disabledText,
              cursor: 'not-allowed',
            },
            '&::placeholder': {
              color: colors.text.muted,
            },
          }}
          {...rest}
        />

        <IconButton
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          sx={{
            position: 'absolute',
            right: 4,
            width: 34,
            height: 34,
            color: colors.text.muted,
            '&:hover': {
              color: colors.text.primary,
              backgroundColor: 'transparent',
            },
            '&:focus-visible': {
              outline: `2px solid ${colors.brand.accent}`,
              outlineOffset: '2px',
            },
          }}
        >
          {showPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
        </IconButton>
      </Box>
    </FieldWrapper>
  );
});

RidePasswordInput.displayName = 'RidePasswordInput';
