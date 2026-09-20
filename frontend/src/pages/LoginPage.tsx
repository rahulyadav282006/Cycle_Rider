import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EastIcon from '@mui/icons-material/East';
import CheckIcon from '@mui/icons-material/Check';

import { authService } from '../api/services';

export interface LoginPageProps {
  onNavigateRegister: () => void;
  onLoginSuccess?: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErr = false;

    if (!email.trim()) {
      setEmailError('Email or username is required');
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
    setGeneralError('');

    try {
      const res = await authService.login({ email: email.trim(), password });
      setIsSubmitting(false);
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setGeneralError(err?.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'flex-end' },
        backgroundImage: 'url("/login-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: { xs: 'center center', md: 'center 42%' },
        backgroundRepeat: 'no-repeat',
        pr: { xs: 0, md: '6%', lg: '8%', xl: '10%' },
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* Subtle overlay to enhance contrast */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          pointerEvents: 'none',
        }}
      />

      {/* Glassmorphism Authentication Card */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
          backgroundColor: 'rgba(28, 36, 44, 0.74)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 1px rgba(255, 255, 255, 0.25) inset',
          p: { xs: 3.5, sm: 4.5 },
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          color: '#FFFFFF',
        }}
      >
        {/* RideTrack Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            component="img"
            src="/ridetrack-logo.png"
            alt="RideTrack - Track · Connect · Ride Together"
            sx={{
              width: 220,
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
            }}
          />
        </Box>

        {/* Title & Subtitle */}
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.45rem',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.01em',
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          sx={{
            fontSize: '0.86rem',
            color: '#94A3B8',
            lineHeight: 1.4,
            mb: 3,
          }}
        >
          Sign in to your RideTrack account
        </Typography>

        {/* General Error Banner */}
        {generalError && (
          <Box
            id="login-error-alert"
            sx={{
              mb: 2.5,
              p: 1.5,
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              fontSize: '0.84rem',
            }}
          >
            {generalError}
          </Box>
        )}

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {/* Email or Username Field */}
          <Box sx={{ mb: 2, width: '100%' }}>
            <Box
              sx={{
                width: '100%',
                height: 48,
                borderRadius: '10px',
                backgroundColor: 'rgba(42, 53, 64, 0.65)',
                border: `1px solid ${emailError ? '#EF4444' : 'rgba(255, 255, 255, 0.12)'}`,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                gap: 1.5,
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                '&:focus-within': {
                  borderColor: emailError ? '#EF4444' : '#5EC576',
                  boxShadow: emailError
                    ? '0 0 0 2px rgba(239, 68, 68, 0.25)'
                    : '0 0 0 2px rgba(94, 197, 118, 0.25)',
                  backgroundColor: 'rgba(42, 53, 64, 0.85)',
                },
              }}
            >
              <PersonOutlineOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20, flexShrink: 0 }} />
              <Box
                component="input"
                id="login-email-input"
                name="email"
                type="text"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                  if (generalError) setGeneralError('');
                }}
                disabled={isSubmitting}
                sx={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.9rem',
                  color: '#FFFFFF',
                  fontFamily: 'inherit',
                  '&::placeholder': {
                    color: '#94A3B8',
                    opacity: 1,
                  },
                }}
              />
            </Box>
            {emailError && (
              <Typography sx={{ color: '#EF4444', fontSize: '0.78rem', mt: 0.6, pl: 0.5 }}>
                {emailError}
              </Typography>
            )}
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 2, width: '100%' }}>
            <Box
              sx={{
                width: '100%',
                height: 48,
                borderRadius: '10px',
                backgroundColor: 'rgba(42, 53, 64, 0.65)',
                border: `1px solid ${passwordError ? '#EF4444' : 'rgba(255, 255, 255, 0.12)'}`,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                gap: 1.5,
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                '&:focus-within': {
                  borderColor: passwordError ? '#EF4444' : '#5EC576',
                  boxShadow: passwordError
                    ? '0 0 0 2px rgba(239, 68, 68, 0.25)'
                    : '0 0 0 2px rgba(94, 197, 118, 0.25)',
                  backgroundColor: 'rgba(42, 53, 64, 0.85)',
                },
              }}
            >
              <LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20, flexShrink: 0 }} />
              <Box
                component="input"
                id="login-password-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                  if (generalError) setGeneralError('');
                }}
                disabled={isSubmitting}
                sx={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.9rem',
                  color: '#FFFFFF',
                  fontFamily: 'inherit',
                  '&::placeholder': {
                    color: '#94A3B8',
                    opacity: 1,
                  },
                }}
              />
              <Box
                component="button"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                sx={{
                  border: 'none',
                  background: 'none',
                  p: 0.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: '#FFFFFF' },
                }}
              >
                {showPassword ? (
                  <VisibilityOutlinedIcon sx={{ fontSize: 19 }} />
                ) : (
                  <VisibilityOffOutlinedIcon sx={{ fontSize: 19 }} />
                )}
              </Box>
            </Box>
            {passwordError && (
              <Typography sx={{ color: '#EF4444', fontSize: '0.78rem', mt: 0.6, pl: 0.5 }}>
                {passwordError}
              </Typography>
            )}
          </Box>

          {/* Options Row: Remember Me & Forgot Password */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 0.5,
              mb: 3,
              width: '100%',
            }}
          >
            {/* Remember Me Checkbox */}
            <Box
              component="div"
              onClick={() => setRememberMe(!rememberMe)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '5px',
                  backgroundColor: rememberMe ? '#5EC576' : 'transparent',
                  border: rememberMe ? '1px solid #5EC576' : '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {rememberMe && <CheckIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />}
              </Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 500 }}>
                Remember me
              </Typography>
            </Box>

            {/* Forgot Password */}
            <Typography
              component="button"
              type="button"
              onClick={() => alert('Please contact administrator to reset your password.')}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                color: '#5EC576',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'color 0.15s ease',
                '&:hover': {
                  color: '#4ADE80',
                  textDecoration: 'underline',
                },
              }}
            >
              Forgot password?
            </Typography>
          </Box>

          {/* Full-width Sign In Button */}
          <Box
            component="button"
            type="submit"
            id="login-submit-button"
            disabled={isSubmitting}
            sx={{
              width: '100%',
              height: 48,
              borderRadius: '10px',
              background: 'linear-gradient(180deg, #66D27E 0%, #54C26E 100%)',
              color: '#FFFFFF',
              fontSize: '0.96rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.25,
              boxShadow: '0 4px 14px rgba(84, 194, 110, 0.35)',
              transition: 'all 0.15s ease',
              '&:hover:not(:disabled)': {
                background: 'linear-gradient(180deg, #57C36F 0%, #4AB764 100%)',
                boxShadow: '0 6px 20px rgba(84, 194, 110, 0.5)',
                transform: 'translateY(-1px)',
              },
              '&:active:not(:disabled)': {
                transform: 'translateY(1px)',
              },
              '&:disabled': {
                opacity: 0.65,
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
              <>
                <span>Sign In</span>
                <EastIcon sx={{ fontSize: 18 }} />
              </>
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
            <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
            <Typography
              sx={{
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94A3B8',
                letterSpacing: '0.06em',
              }}
            >
              OR
            </Typography>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
          </Box>

          {/* Registration Link */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Don't have an account?
            </Typography>
            <Box
              component="button"
              type="button"
              id="link-register"
              onClick={onNavigateRegister}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                color: '#5EC576',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'color 0.15s ease',
                '&:hover': {
                  color: '#4ADE80',
                  textDecoration: 'underline',
                },
              }}
            >
              Register
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
