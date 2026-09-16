import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';

export const rideTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.brand.primary,
      dark: colors.brand.primaryDark,
      light: colors.brand.primaryLight,
      contrastText: colors.text.inverse,
    },
    secondary: {
      main: colors.brand.accent,
      dark: colors.brand.accentHover,
      light: colors.brand.accentLight,
      contrastText: colors.text.inverse,
    },
    background: {
      default: colors.surface.page,
      paper: colors.surface.card,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.interactive.disabledText,
    },
    divider: colors.surface.border,
    success: {
      main: colors.status.success.dot,
      light: colors.status.success.bg,
    },
    error: {
      main: colors.status.error.dot,
      light: colors.status.error.bg,
    },
    warning: {
      main: colors.status.pending.dot,
      light: colors.status.pending.bg,
    },
    info: {
      main: colors.status.completed.dot,
      light: colors.status.completed.bg,
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: {
      fontSize: '2.25rem', // 36px Extra Bold
      fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
      color: colors.text.primary,
    },
    h2: {
      fontSize: '1.75rem', // 28px
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.25,
      color: colors.text.primary,
    },
    h3: {
      fontSize: '1.375rem', // 22px
      fontWeight: 700,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    h4: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem', // 16px Regular
      fontWeight: 400,
      lineHeight: 1.6,
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: colors.text.muted,
    },
    button: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 6, // Crisp, enterprise 6px radius
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${colors.brand.accent}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${colors.surface.border}`,
          boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.surface.border,
            borderWidth: '1px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.surface.borderStrong,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.brand.accent,
            borderWidth: '2px',
          },
          '&.Mui-disabled': {
            backgroundColor: colors.surface.subtle,
          },
        },
        input: {
          fontSize: '0.875rem',
          padding: '10px 14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: colors.text.secondary,
          '&.Mui-focused': {
            color: colors.brand.accent,
          },
        },
      },
    },
  },
});
