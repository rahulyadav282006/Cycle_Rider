import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ErrorIcon from '@mui/icons-material/Error';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import { colors } from '../theme/colors';

import { authService } from '../api/services';

export interface LoginPageProps {
  onNavigateRegister: () => void;
  onLoginSuccess?: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErr = false;

    if (!email.trim()) {
      setEmailError('Email address is required');
      hasErr = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Invalid email address');
      hasErr = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      hasErr = true;
    } else {
      setPasswordError('');
    }

    if (hasErr) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.login({ email: email.trim(), password });
      setIsSubmitting(false);
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setPasswordError(err?.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const isEmailInError = Boolean(emailError);
  const isPasswordInError = Boolean(passwordError);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Main Authentication Card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: `1px solid ${colors.surface.border}`,
          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
          p: { xs: 3, sm: 4.5 },
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Centered Cycling Brand Badge */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '10px',
            backgroundColor: colors.brand.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            mb: 2.25,
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
          }}
        >
          <DirectionsBikeIcon sx={{ fontSize: 28 }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.4rem' },
            fontWeight: 800,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          Sign in to RideTrack
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: '0.84rem',
            color: colors.text.secondary,
            textAlign: 'center',
            lineHeight: 1.45,
            mb: 3.5,
            maxWidth: 340,
          }}
        >
          Manage cycling events, riders, checkpoints, volunteers, and reports.
        </Typography>

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {/* Email Address Field */}
          <Box sx={{ mb: 2.25, width: '100%' }}>
            <Box
              component="label"
              htmlFor="login-email"
              sx={{
                display: 'block',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: colors.text.primary,
                mb: 0.75,
              }}
            >
              Email Address
            </Box>
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
                id="login-email"
                type="email"
                placeholder="organizer@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                disabled={isSubmitting}
                aria-invalid={isEmailInError}
                aria-describedby={isEmailInError ? 'email-error-msg' : undefined}
                sx={{
                  width: '100%',
                  height: 42,
                  px: 1.5,
                  pr: isEmailInError ? 4.5 : 1.5,
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  color: colors.text.primary,
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${isEmailInError ? colors.status.error.dot : colors.surface.border}`,
                  borderRadius: '6px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  '&:hover:not(:disabled)': {
                    borderColor: isEmailInError ? colors.status.error.dot : colors.surface.borderStrong,
                  },
                  '&:focus': {
                    borderColor: isEmailInError ? colors.status.error.dot : colors.brand.accent,
                    boxShadow: isEmailInError
                      ? '0 0 0 3px rgba(220, 38, 38, 0.15)'
                      : '0 0 0 3px rgba(2, 132, 199, 0.15)',
                  },
                  '&::placeholder': {
                    color: colors.text.muted,
                  },
                }}
              />
              {/* Red Error Icon inside input on the right */}
              {isEmailInError && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.status.error.dot,
                    pointerEvents: 'none',
                  }}
                >
                  <ErrorIcon sx={{ fontSize: 20 }} />
                </Box>
              )}
            </Box>
            {/* Error message directly below field */}
            {isEmailInError && (
              <Typography
                id="email-error-msg"
                role="alert"
                sx={{
                  fontSize: '0.78rem',
                  color: colors.status.error.dot,
                  fontWeight: 500,
                  mt: 0.6,
                  lineHeight: 1.3,
                }}
              >
                {emailError}
              </Typography>
            )}
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 3, width: '100%' }}>
            <Box
              component="label"
              htmlFor="login-password"
              sx={{
                display: 'block',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: colors.text.primary,
                mb: 0.75,
              }}
            >
              Password
            </Box>
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
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                disabled={isSubmitting}
                aria-invalid={isPasswordInError}
                aria-describedby={isPasswordInError ? 'password-error-msg' : undefined}
                sx={{
                  width: '100%',
                  height: 42,
                  px: 1.5,
                  pr: 4.5,
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  color: colors.text.primary,
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${isPasswordInError ? colors.status.error.dot : colors.surface.border}`,
                  borderRadius: '6px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  '&:hover:not(:disabled)': {
                    borderColor: isPasswordInError ? colors.status.error.dot : colors.surface.borderStrong,
                  },
                  '&:focus': {
                    borderColor: isPasswordInError ? colors.status.error.dot : colors.brand.accent,
                    boxShadow: isPasswordInError
                      ? '0 0 0 3px rgba(220, 38, 38, 0.15)'
                      : '0 0 0 3px rgba(2, 132, 199, 0.15)',
                  },
                  '&::placeholder': {
                    color: colors.text.muted,
                  },
                }}
              />
              {/* Show/Hide password toggle icon button */}
              <Box
                component="button"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                sx={{
                  position: 'absolute',
                  right: 8,
                  border: 'none',
                  background: 'none',
                  p: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: colors.text.muted,
                  borderRadius: '4px',
                  '&:hover': {
                    color: colors.text.primary,
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${colors.brand.accent}`,
                  },
                }}
              >
                {showPassword ? (
                  <Visibility sx={{ fontSize: 20 }} />
                ) : (
                  <VisibilityOff sx={{ fontSize: 20 }} />
                )}
              </Box>
            </Box>
            {/* Error message directly below field */}
            {isPasswordInError && (
              <Typography
                id="password-error-msg"
                role="alert"
                sx={{
                  fontSize: '0.78rem',
                  color: colors.status.error.dot,
                  fontWeight: 500,
                  mt: 0.6,
                  lineHeight: 1.3,
                }}
              >
                {passwordError}
              </Typography>
            )}
          </Box>

          {/* Full-width Sign In Button */}
          <Box
            component="button"
            type="submit"
            disabled={isSubmitting}
            sx={{
              width: '100%',
              height: 46,
              borderRadius: '6px',
              backgroundColor: colors.brand.accent,
              color: '#FFFFFF',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.25,
              transition: 'background-color 0.15s ease, transform 0.1s ease',
              '&:hover:not(:disabled)': {
                backgroundColor: colors.brand.accentHover,
              },
              '&:active:not(:disabled)': {
                transform: 'translateY(1px)',
              },
              '&:focus-visible': {
                outline: `2px solid ${colors.brand.accent}`,
                outlineOffset: '2px',
              },
              '&:disabled': {
                backgroundColor: '#94A3B8',
                cursor: 'not-allowed',
              },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={18} thickness={5} sx={{ color: '#FFFFFF' }} />
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Box>

          {/* Divider with "OR" */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              my: 3,
              width: '100%',
            }}
          >
            <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.surface.border }} />
            <Typography
              sx={{
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: colors.text.muted,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              OR
            </Typography>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.surface.border }} />
          </Box>

          {/* Registration Secondary Navigation */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              Don't have an organizer account?
            </Typography>
            <Box
              component="button"
              type="button"
              onClick={onNavigateRegister}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                color: colors.brand.accent,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                '&:hover': {
                  color: colors.brand.accentHover,
                  textDecoration: 'underline',
                },
                '&:focus-visible': {
                  outline: `2px solid ${colors.brand.accent}`,
                  outlineOffset: '2px',
                  borderRadius: '2px',
                },
              }}
            >
              Create Organizer Account
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
