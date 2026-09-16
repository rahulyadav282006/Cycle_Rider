import React, { forwardRef } from 'react';
import {
  Box,
  Typography,
  Select as MuiSelect,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { colors } from '../../theme/colors';

// Base Label & Helper/Error Container
export interface FieldWrapperProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  disabled?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  helperText,
  errorText,
  required = false,
  disabled = false,
  htmlFor,
  children,
}) => {
  const isError = Boolean(errorText);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {label && (
        <Box
          component="label"
          htmlFor={htmlFor}
          sx={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: disabled ? colors.interactive.disabledText : isError ? colors.status.error.dot : colors.text.primary,
            mb: 0.75,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: colors.status.error.dot, ml: 0.5 }}>
              *
            </Box>
          )}
        </Box>
      )}

      {children}

      {/* Helper / Error text */}
      {(errorText || helperText) && (
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: isError ? colors.status.error.dot : colors.text.muted,
            mt: 0.5,
            lineHeight: 1.3,
            fontWeight: isError ? 500 : 400,
          }}
        >
          {errorText || helperText}
        </Typography>
      )}
    </Box>
  );
};

// 1. Text Input (also handles date, time, number, etc.)
export interface RideInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  size?: 'sm' | 'md';
}

export const RideInput = forwardRef<HTMLInputElement, RideInputProps>(({
  label,
  helperText,
  errorText,
  id,
  type = 'text',
  disabled = false,
  required = false,
  placeholder,
  value,
  onChange,
  size = 'md',
  ...rest
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
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
        component="input"
        ref={ref}
        id={inputId}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        sx={{
          width: '100%',
          height: size === 'sm' ? 36 : 42,
          px: 1.5,
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
              ? `0 0 0 3px rgba(220, 38, 38, 0.15)` 
              : `0 0 0 3px rgba(2, 132, 199, 0.15)`,
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
    </FieldWrapper>
  );
});

RideInput.displayName = 'RideInput';

// 2. Textarea
export interface RideTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  rows?: number;
}

export const RideTextarea = forwardRef<HTMLTextAreaElement, RideTextareaProps>(({
  label,
  helperText,
  errorText,
  id,
  disabled = false,
  required = false,
  placeholder,
  value,
  onChange,
  rows = 3,
  ...rest
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
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
        component="textarea"
        ref={ref}
        id={inputId}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        sx={{
          width: '100%',
          p: 1.5,
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          color: colors.text.primary,
          backgroundColor: disabled ? colors.surface.subtle : '#FFFFFF',
          border: `1px solid ${isError ? colors.status.error.dot : colors.surface.border}`,
          borderRadius: '6px',
          outline: 'none',
          boxSizing: 'border-box',
          resize: 'vertical',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:hover:not(:disabled)': {
            borderColor: isError ? colors.status.error.dot : colors.surface.borderStrong,
          },
          '&:focus': {
            borderColor: isError ? colors.status.error.dot : colors.brand.accent,
            boxShadow: isError 
              ? `0 0 0 3px rgba(220, 38, 38, 0.15)` 
              : `0 0 0 3px rgba(2, 132, 199, 0.15)`,
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
    </FieldWrapper>
  );
});

RideTextarea.displayName = 'RideTextarea';

// 3. Select
export interface SelectOption {
  value: string;
  label: string;
}

export interface RideSelectProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  id?: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export const RideSelect: React.FC<RideSelectProps> = ({
  label,
  helperText,
  errorText,
  id,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  placeholder,
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isError = Boolean(errorText);

  return (
    <FieldWrapper
      label={label}
      helperText={helperText}
      errorText={errorText}
      required={required}
      disabled={disabled}
      htmlFor={selectId}
    >
      <MuiSelect
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        displayEmpty
        sx={{
          height: 42,
          backgroundColor: disabled ? colors.surface.subtle : '#FFFFFF',
          borderRadius: '6px',
          fontSize: '0.875rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isError ? colors.status.error.dot : colors.surface.border,
            borderWidth: '1px !important',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isError ? colors.status.error.dot : colors.surface.borderStrong,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: isError ? colors.status.error.dot : `${colors.brand.accent} !important`,
            borderWidth: '2px !important',
          },
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled sx={{ color: colors.text.muted, fontSize: '0.875rem' }}>
            {placeholder}
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.875rem' }}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FieldWrapper>
  );
};
