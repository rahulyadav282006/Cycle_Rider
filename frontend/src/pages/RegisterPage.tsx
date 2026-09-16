import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import { colors } from '../theme/colors';
import { authService } from '../api/services';

export interface RegisterPageProps {
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setMobileError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Organizer Name is required');
      hasError = true;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email address');
      hasError = true;
    }

    if (!mobile.trim() || !/^\+?[\d\s-]{7,15}$/.test(mobile.trim())) {
      setMobileError('Invalid mobile number');
      hasError = true;
    }

    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        phone: mobile.trim(),
        password,
        role: 'ORGANIZER',
        organizationName: name.trim(),
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setEmailError(err?.message || 'Registration failed. Email may already be in use.');
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Main Authentication Card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 460,
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
        {isSuccess ? (
          /* SUCCESS STATE (Image 1) */
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1 }}>
            {/* Green Success Badge */}
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
                mb: 2.25,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 38 }} />
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                mb: 1,
              }}
            >
              Account Created
            </Typography>

            <Typography
              sx={{
                fontSize: '0.84rem',
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 1.45,
                mb: 3,
                maxWidth: 320,
              }}
            >
              Your organizer account has been created successfully.
            </Typography>

            {/* Welcome banner */}
            <Box
              sx={{
                width: '100%',
                p: 2,
                borderRadius: '8px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #DCFCE7',
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16A34A',
                  flexShrink: 0,
                }}
              >
                <PersonIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: '#166534', mb: 0.25 }}>
                  Welcome to RideTrack!
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#15803D', lineHeight: 1.4 }}>
                  You can now sign in to manage your cycling events, riders, checkpoints, volunteers, and reports.
                </Typography>
              </Box>
            </Box>

            {/* Primary Continue button */}
            <Box
              component="button"
              type="button"
              onClick={onNavigateLogin}
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                transition: 'background-color 0.15s ease',
                '&:hover': {
                  backgroundColor: colors.brand.accentHover,
                },
              }}
            >
              <span>Continue to Sign In</span>
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2.5, width: '100%' }}>
              <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.surface.border }} />
              <Typography sx={{ px: 2, fontSize: '0.72rem', fontWeight: 600, color: colors.text.muted }}>
                OR
              </Typography>
              <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.surface.border }} />
            </Box>

            {/* Back to registration link */}
            <Box
              component="button"
              type="button"
              onClick={() => setIsSuccess(false)}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                color: colors.brand.accent,
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Back to Registration
            </Box>
          </Box>
        ) : (
          /* REGISTRATION FORM */
          <>
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
                mb: 2,
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
              }}
            >
              <DirectionsBikeIcon sx={{ fontSize: 28 }} />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.4rem' },
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                mb: 1,
              }}
            >
              Create Organizer Account
            </Typography>

            <Typography
              sx={{
                fontSize: '0.84rem',
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 1.45,
                mb: 3,
              }}
            >
              Register to manage cycling events with RideTrack.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Organizer Name */}
              <Box>
                <Box component="label" sx={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                  Organizer Name
                </Box>
                <Box
                  component="input"
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
                  disabled={isSubmitting}
                  sx={{
                    width: '100%',
                    height: 42,
                    px: 1.5,
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    color: colors.text.primary,
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${nameError ? colors.status.error.dot : colors.surface.border}`,
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    '&:focus': {
                      borderColor: nameError ? colors.status.error.dot : colors.brand.accent,
                      boxShadow: nameError ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : '0 0 0 3px rgba(2, 132, 199, 0.15)',
                    },
                  }}
                />
                {nameError && (
                  <Typography sx={{ fontSize: '0.78rem', color: colors.status.error.dot, fontWeight: 500, mt: 0.5 }}>
                    {nameError}
                  </Typography>
                )}
              </Box>

              {/* Email Address */}
              <Box>
                <Box component="label" sx={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                  Email Address
                </Box>
                <Box
                  component="input"
                  type="email"
                  placeholder="organizer@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                  disabled={isSubmitting}
                  sx={{
                    width: '100%',
                    height: 42,
                    px: 1.5,
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    color: colors.text.primary,
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${emailError ? colors.status.error.dot : colors.surface.border}`,
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    '&:focus': {
                      borderColor: emailError ? colors.status.error.dot : colors.brand.accent,
                      boxShadow: emailError ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : '0 0 0 3px rgba(2, 132, 199, 0.15)',
                    },
                  }}
                />
                {emailError && (
                  <Typography sx={{ fontSize: '0.78rem', color: colors.status.error.dot, fontWeight: 500, mt: 0.5 }}>
                    {emailError}
                  </Typography>
                )}
              </Box>

              {/* Mobile Number */}
              <Box>
                <Box component="label" sx={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                  Mobile Number
                </Box>
                <Box
                  component="input"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value); if (mobileError) setMobileError(''); }}
                  disabled={isSubmitting}
                  sx={{
                    width: '100%',
                    height: 42,
                    px: 1.5,
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    color: colors.text.primary,
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${mobileError ? colors.status.error.dot : colors.surface.border}`,
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    '&:focus': {
                      borderColor: mobileError ? colors.status.error.dot : colors.brand.accent,
                      boxShadow: mobileError ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : '0 0 0 3px rgba(2, 132, 199, 0.15)',
                    },
                  }}
                />
                {mobileError && (
                  <Typography sx={{ fontSize: '0.78rem', color: colors.status.error.dot, fontWeight: 500, mt: 0.5 }}>
                    {mobileError}
                  </Typography>
                )}
              </Box>

              {/* Password */}
              <Box>
                <Box component="label" sx={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                  Password
                </Box>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                    disabled={isSubmitting}
                    sx={{
                      width: '100%',
                      height: 42,
                      px: 1.5,
                      pr: 4.5,
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      color: colors.text.primary,
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${passwordError ? colors.status.error.dot : colors.surface.border}`,
                      borderRadius: '6px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      '&:focus': {
                        borderColor: passwordError ? colors.status.error.dot : colors.brand.accent,
                        boxShadow: passwordError ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : '0 0 0 3px rgba(2, 132, 199, 0.15)',
                      },
                    }}
                  />
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ position: 'absolute', right: 8, border: 'none', background: 'none', p: 0.5, cursor: 'pointer', color: colors.text.muted }}
                  >
                    {showPassword ? <Visibility sx={{ fontSize: 20 }} /> : <VisibilityOff sx={{ fontSize: 20 }} />}
                  </Box>
                </Box>
                {passwordError && (
                  <Typography sx={{ fontSize: '0.78rem', color: colors.status.error.dot, fontWeight: 500, mt: 0.5 }}>
                    {passwordError}
                  </Typography>
                )}
              </Box>

              {/* Confirm Password */}
              <Box>
                <Box component="label" sx={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: colors.text.primary, mb: 0.75 }}>
                  Confirm Password
                </Box>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPasswordError) setConfirmPasswordError(''); }}
                    disabled={isSubmitting}
                    sx={{
                      width: '100%',
                      height: 42,
                      px: 1.5,
                      pr: 4.5,
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      color: colors.text.primary,
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${confirmPasswordError ? colors.status.error.dot : colors.surface.border}`,
                      borderRadius: '6px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      '&:focus': {
                        borderColor: confirmPasswordError ? colors.status.error.dot : colors.brand.accent,
                        boxShadow: confirmPasswordError ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : '0 0 0 3px rgba(2, 132, 199, 0.15)',
                      },
                    }}
                  />
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    sx={{ position: 'absolute', right: 8, border: 'none', background: 'none', p: 0.5, cursor: 'pointer', color: colors.text.muted }}
                  >
                    {showConfirmPassword ? <Visibility sx={{ fontSize: 20 }} /> : <VisibilityOff sx={{ fontSize: 20 }} />}
                  </Box>
                </Box>
                {confirmPasswordError && (
                  <Typography sx={{ fontSize: '0.78rem', color: colors.status.error.dot, fontWeight: 500, mt: 0.5 }}>
                    {confirmPasswordError}
                  </Typography>
                )}
              </Box>

              {/* Submit Button */}
              <Box
                component="button"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  width: '100%',
                  height: 46,
                  mt: 1,
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
                  transition: 'background-color 0.15s ease',
                  '&:hover:not(:disabled)': {
                    backgroundColor: colors.brand.accentHover,
                  },
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={18} thickness={5} sx={{ color: '#FFFFFF' }} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </Box>

              {/* Divider with "OR" */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2, width: '100%' }}>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.surface.border }} />
                <Typography sx={{ px: 2, fontSize: '0.75rem', fontWeight: 600, color: colors.text.muted, letterSpacing: '0.06em' }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.surface.border }} />
              </Box>

              {/* Back to Sign In Link */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                  Already have an account?
                </Typography>
                <Box
                  component="button"
                  type="button"
                  onClick={onNavigateLogin}
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
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign In
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
