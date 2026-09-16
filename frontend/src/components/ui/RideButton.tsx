import React, { forwardRef } from 'react';
import { Button as MuiButton, IconButton as MuiIconButton, Tooltip } from '@mui/material';
import { colors } from '../../theme/colors';

export type RideButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type RideButtonSize = 'sm' | 'md' | 'lg';

export interface RideButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: RideButtonVariant;
  size?: RideButtonSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: object;
  children: React.ReactNode;
}

export const RideButton = forwardRef<HTMLButtonElement, RideButtonProps>(({
  variant = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  className = '',
  type = 'button',
  sx = {},
  ...rest
}, ref) => {
  // Styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.brand.primary,
          color: colors.text.inverse,
          border: '1px solid transparent',
          '&:hover': {
            backgroundColor: colors.brand.primaryLight,
          },
          '&:active': {
            backgroundColor: colors.brand.primaryDark,
            transform: 'translateY(1px)',
          },
          '&.Mui-disabled': {
            backgroundColor: colors.interactive.disabledBg,
            color: colors.interactive.disabledText,
            border: `1px solid ${colors.interactive.disabledBorder}`,
          },
        };
      case 'secondary':
        return {
          backgroundColor: '#FFFFFF',
          color: colors.text.primary,
          border: `1px solid ${colors.surface.borderStrong}`,
          '&:hover': {
            backgroundColor: colors.surface.subtle,
            borderColor: colors.text.secondary,
          },
          '&:active': {
            backgroundColor: colors.surface.border,
            transform: 'translateY(1px)',
          },
          '&.Mui-disabled': {
            backgroundColor: colors.interactive.disabledBg,
            color: colors.interactive.disabledText,
            borderColor: colors.interactive.disabledBorder,
          },
        };
      case 'tertiary':
        return {
          backgroundColor: 'transparent',
          color: colors.text.secondary,
          border: '1px solid transparent',
          '&:hover': {
            backgroundColor: colors.surface.subtle,
            color: colors.text.primary,
          },
          '&:active': {
            backgroundColor: colors.surface.border,
            transform: 'translateY(1px)',
          },
          '&.Mui-disabled': {
            backgroundColor: 'transparent',
            color: colors.interactive.disabledText,
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 36,
          padding: '0 12px',
          fontSize: '0.8125rem',
        };
      case 'md':
        return {
          height: 42,
          padding: '0 16px',
          fontSize: '0.875rem',
        };
      case 'lg':
        return {
          height: 48,
          padding: '0 20px',
          fontSize: '0.9375rem',
        };
    }
  };

  return (
    <MuiButton
      ref={ref}
      type={type}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      className={className}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        borderRadius: '6px',
        fontWeight: 600,
        textTransform: 'none',
        minWidth: 44, // Minimum touch target width
        letterSpacing: '0.01em',
        transition: 'all 0.15s ease-in-out',
        '&:focus-visible': {
          outline: `2px solid ${colors.brand.accent}`,
          outlineOffset: '2px',
        },
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MuiButton>
  );
});

RideButton.displayName = 'RideButton';

export interface RideIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  label: string; // Required for accessibility
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  disabled?: boolean;
  sx?: object;
}

export const RideIconButton = forwardRef<HTMLButtonElement, RideIconButtonProps>(({
  label,
  children,
  size = 'md',
  variant = 'default',
  disabled = false,
  onClick,
  sx = {},
  ...rest
}, ref) => {
  const getDimension = () => {
    switch (size) {
      case 'sm': return 36;
      case 'md': return 42;
      case 'lg': return 48;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.surface.subtle,
          border: `1px solid ${colors.surface.border}`,
          '&:hover': {
            backgroundColor: colors.surface.border,
          },
        };
      case 'outlined':
        return {
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.surface.border}`,
          '&:hover': {
            backgroundColor: colors.surface.subtle,
            borderColor: colors.surface.borderStrong,
          },
        };
      case 'default':
      default:
        return {
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          '&:hover': {
            backgroundColor: colors.surface.subtle,
          },
        };
    }
  };

  const dim = getDimension();

  return (
    <Tooltip title={label} arrow>
      <MuiIconButton
        ref={ref}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        sx={{
          width: dim,
          height: dim,
          borderRadius: '6px',
          color: colors.text.secondary,
          transition: 'all 0.15s ease-in-out',
          '&:active': {
            transform: 'scale(0.96)',
          },
          '&:focus-visible': {
            outline: `2px solid ${colors.brand.accent}`,
            outlineOffset: '2px',
          },
          '&.Mui-disabled': {
            color: colors.interactive.disabledText,
          },
          ...getVariantStyles(),
          ...sx,
        }}
        {...rest}
      >
        {children}
      </MuiIconButton>
    </Tooltip>
  );
});

RideIconButton.displayName = 'RideIconButton';
