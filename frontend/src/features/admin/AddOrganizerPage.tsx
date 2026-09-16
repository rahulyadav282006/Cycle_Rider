import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';
import { adminService } from '../../api/services';

export interface AddOrganizerPageProps {
  onCancel: () => void;
  onSuccessReturn: () => void;
}

export const AddOrganizerPage: React.FC<AddOrganizerPageProps> = ({
  onCancel,
  onSuccessReturn,
}) => {
  // Form fields: Organizer Name, Email, Password, Confirm Password
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Organizer name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password mismatch. Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminService.createOrganizer({
        name: name.trim(),
        email: email.trim(),
        password: password,
        organization: name.trim(),
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create organizer account. Please check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 800, mx: 'auto' }}>
      {/* Header & Back Button */}
      <Box sx={{ mb: 3 }}>
        <Box
          component="button"
          onClick={onCancel}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            backgroundColor: 'transparent',
            border: 'none',
            color: colors.text.secondary,
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            mb: 1,
            p: 0,
            '&:hover': { color: colors.primary.main },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Back to Organizers
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
            }}
          >
            Add Organizer
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: '9999px',
              backgroundColor: colors.brand.accentLight,
              color: colors.brand.accentHover,
              border: `1px solid #BAE6FD`,
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 13 }} />
            Super Admin
          </Box>
        </Box>
        <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
          Create a new organizer account for RideTrack.
        </Typography>
      </Box>

      {/* Form Card or Success Confirmation */}
      {isSuccess ? (
        <Card
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
            p: { xs: 3, sm: 5 },
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              border: '1px solid #A7F3D0',
            }}
          >
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: colors.text.primary,
              mb: 1,
            }}
          >
            Organizer created successfully.
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary, mb: 3 }}>
            The organizer account <strong>{name}</strong> (<strong>{email}</strong>) has been provisioned.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
            <RideButton variant="secondary" size="sm" onClick={handleResetForm}>
              Add Another Organizer
            </RideButton>
            <RideButton variant="primary" size="sm" onClick={onSuccessReturn}>
              Return to Organizer List
            </RideButton>
          </Box>
        </Card>
      ) : (
        <Card
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '10px',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Field 1: Organizer Name */}
                <Box>
                  <Typography
                    component="label"
                    htmlFor="organizer-name"
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 0.75,
                    }}
                  >
                    Organizer Name <span style={{ color: '#DC2626' }}>*</span>
                  </Typography>
                  <TextField
                    id="organizer-name"
                    fullWidth
                    size="small"
                    placeholder="e.g. Pune Endurance Cycling Club"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </Box>

                {/* Field 2: Email */}
                <Box>
                  <Typography
                    component="label"
                    htmlFor="organizer-email"
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 0.75,
                    }}
                  >
                    Email <span style={{ color: '#DC2626' }}>*</span>
                  </Typography>
                  <TextField
                    id="organizer-email"
                    fullWidth
                    type="email"
                    size="small"
                    placeholder="organizer@cyclingclub.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </Box>

                {/* Field 3: Password */}
                <Box>
                  <Typography
                    component="label"
                    htmlFor="organizer-password"
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 0.75,
                    }}
                  >
                    Password <span style={{ color: '#DC2626' }}>*</span>
                  </Typography>
                  <TextField
                    id="organizer-password"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    size="small"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label="toggle password visibility"
                            >
                              {showPassword ? (
                                <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                              ) : (
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </Box>

                {/* Field 4: Confirm Password */}
                <Box>
                  <Typography
                    component="label"
                    htmlFor="organizer-confirm-password"
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: colors.text.primary,
                      mb: 0.75,
                    }}
                  >
                    Confirm Password <span style={{ color: '#DC2626' }}>*</span>
                  </Typography>
                  <TextField
                    id="organizer-confirm-password"
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    size="small"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              aria-label="toggle confirm password visibility"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                              ) : (
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Form Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 1.5,
                  mt: 4,
                  pt: 2.5,
                  borderTop: `1px solid ${colors.surface.border}`,
                }}
              >
                <RideButton
                  variant="secondary"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </RideButton>

                <RideButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} color="inherit" />
                      Adding Organizer...
                    </Box>
                  ) : (
                    '+ Add Organizer'
                  )}
                </RideButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
