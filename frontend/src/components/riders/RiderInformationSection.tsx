import React from 'react';
import { Box, Typography, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { colors } from '../../theme/colors';
import { RiderFormField } from './RiderFormField';

export interface RiderInfoValues {
  riderId: string;
  name: string;
  mobile: string;
  emergencyContact: string;
  bloodGroup: string;
  age: string;
  gender: string;
  club: string;
  bicycleType: string;
  jerseyNumber: string;
}

export interface RiderInfoErrors {
  name?: string;
  mobile?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  age?: string;
  gender?: string;
  club?: string;
  bicycleType?: string;
  jerseyNumber?: string;
}

export interface RiderInformationSectionProps {
  values: RiderInfoValues;
  errors: RiderInfoErrors;
  disabled?: boolean;
  onChange: (field: keyof RiderInfoValues, value: string) => void;
}

export const RiderInformationSection: React.FC<RiderInformationSectionProps> = ({
  values,
  errors,
  disabled = false,
  onChange,
}) => {
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const bicycleOptions = ['Road Bike', 'MTB', 'Hybrid Bike', 'Gravel Bike', 'Other'];

  const inputBaseStyles = (hasError: boolean) => ({
    width: '100%',
    height: 44,
    px: 1.5,
    fontSize: '0.875rem',
    color: colors.text.primary,
    backgroundColor: '#FFFFFF',
    border: `1px solid ${hasError ? colors.status.error.border : colors.surface.borderStrong}`,
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    '&:hover:not(:disabled)': {
      borderColor: hasError ? colors.status.error.dot : colors.brand.accent,
    },
    '&:focus': {
      borderColor: hasError ? colors.status.error.dot : colors.brand.accent,
      outline: `2px solid ${hasError ? colors.status.error.dot : colors.brand.accent}`,
      outlineOffset: '1px',
    },
    '&:disabled': {
      backgroundColor: colors.surface.subtle,
      color: colors.text.secondary,
      cursor: 'not-allowed',
    },
    '&::placeholder': {
      color: colors.text.muted,
      fontSize: '0.8125rem',
    },
  });

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3.5 },
        mb: 3,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Section Header */}
      <Box sx={{ mb: 3, pb: 1.5, borderBottom: `1px solid ${colors.surface.border}` }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: '-0.01em',
            mb: 0.25,
          }}
        >
          Rider Information
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
          Personal identity and cycling details for race timing and identification.
        </Typography>
      </Box>

      {/* Two-Column Responsive Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2.5, sm: 3 },
        }}
      >
        {/* 1. Name * */}
        <RiderFormField
          label="Name"
          required
          errorText={errors.name}
          htmlFor="rider-name-input"
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Box
              component="input"
              id="rider-name-input"
              type="text"
              disabled={disabled}
              placeholder="e.g. Rahul Patil"
              value={values.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('name', e.target.value)}
              sx={inputBaseStyles(Boolean(errors.name))}
            />
            <PersonIcon
              sx={{
                position: 'absolute',
                right: 12,
                fontSize: 18,
                color: colors.text.muted,
                pointerEvents: 'none',
              }}
            />
          </Box>
        </RiderFormField>

        {/* 2. Mobile Number * */}
        <RiderFormField
          label="Mobile Number"
          required
          errorText={errors.mobile}
          htmlFor="rider-mobile-input"
          helperText="10-digit mobile number (e.g. 98765 43210)"
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Box
              component="input"
              id="rider-mobile-input"
              type="tel"
              disabled={disabled}
              maxLength={15}
              placeholder="e.g. 98765 43210"
              value={values.mobile}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                if (/^[+\d\s()-]*$/.test(val)) {
                  onChange('mobile', val);
                }
              }}
              sx={inputBaseStyles(Boolean(errors.mobile))}
            />
            <PhoneOutlinedIcon
              sx={{
                position: 'absolute',
                right: 12,
                fontSize: 18,
                color: colors.text.muted,
                pointerEvents: 'none',
              }}
            />
          </Box>
        </RiderFormField>

        {/* 3. Emergency Contact * */}
        <RiderFormField
          label="Emergency Contact"
          required
          errorText={errors.emergencyContact}
          htmlFor="rider-emergency-input"
          helperText="10-digit number (must be different from rider's mobile)"
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Box
              component="input"
              id="rider-emergency-input"
              type="tel"
              disabled={disabled}
              maxLength={15}
              placeholder="e.g. 98765 12345"
              value={values.emergencyContact}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                if (/^[+\d\s()-]*$/.test(val)) {
                  onChange('emergencyContact', val);
                }
              }}
              sx={inputBaseStyles(Boolean(errors.emergencyContact))}
            />
            <ContactEmergencyOutlinedIcon
              sx={{
                position: 'absolute',
                right: 12,
                fontSize: 18,
                color: colors.text.muted,
                pointerEvents: 'none',
              }}
            />
          </Box>
        </RiderFormField>

        {/* 4. Blood Group * */}
        <RiderFormField
          label="Blood Group"
          required
          errorText={errors.bloodGroup}
          htmlFor="rider-blood-group-select"
        >
          <Select
            id="rider-blood-group-select"
            value={values.bloodGroup || ''}
            displayEmpty
            disabled={disabled}
            onChange={(e: SelectChangeEvent<string>) => onChange('bloodGroup', e.target.value)}
            sx={{
              height: 44,
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${errors.bloodGroup ? colors.status.error.border : colors.surface.borderStrong}`,
              borderRadius: '6px',
              color: values.bloodGroup ? colors.text.primary : colors.text.muted,
              fontWeight: 600,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover': { borderColor: errors.bloodGroup ? colors.status.error.dot : colors.brand.accent },
              '&.Mui-focused': {
                outline: `2px solid ${errors.bloodGroup ? colors.status.error.dot : colors.brand.accent}`,
                outlineOffset: '1px',
              },
            }}
          >
            <MenuItem value="" disabled sx={{ fontSize: '0.875rem', color: colors.text.muted }}>
              Select blood group
            </MenuItem>
            {bloodGroupOptions.map((bg) => (
              <MenuItem key={bg} value={bg} sx={{ fontSize: '0.875rem' }}>
                {bg}
              </MenuItem>
            ))}
          </Select>
        </RiderFormField>

        {/* 5. Age * (Must be between 18 and 60) */}
        <RiderFormField
          label="Age"
          required
          errorText={errors.age}
          htmlFor="rider-age-input"
          helperText="Rider age must be between 18 and 60 years"
        >
          <Box
            component="input"
            id="rider-age-input"
            type="number"
            min="18"
            max="60"
            disabled={disabled}
            placeholder="e.g. 28 (18–60)"
            value={values.age}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('age', e.target.value)}
            sx={inputBaseStyles(Boolean(errors.age))}
          />
        </RiderFormField>

        {/* 6. Gender * */}
        <RiderFormField
          label="Gender"
          required
          errorText={errors.gender}
          htmlFor="rider-gender-select"
        >
          <Select
            id="rider-gender-select"
            value={values.gender || ''}
            displayEmpty
            disabled={disabled}
            onChange={(e: SelectChangeEvent<string>) => onChange('gender', e.target.value)}
            sx={{
              height: 44,
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${errors.gender ? colors.status.error.border : colors.surface.borderStrong}`,
              borderRadius: '6px',
              color: values.gender ? colors.text.primary : colors.text.muted,
              fontWeight: 500,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover': { borderColor: errors.gender ? colors.status.error.dot : colors.brand.accent },
              '&.Mui-focused': {
                outline: `2px solid ${errors.gender ? colors.status.error.dot : colors.brand.accent}`,
                outlineOffset: '1px',
              },
            }}
          >
            <MenuItem value="" disabled sx={{ fontSize: '0.875rem', color: colors.text.muted }}>
              Select gender
            </MenuItem>
            {genderOptions.map((g) => (
              <MenuItem key={g} value={g} sx={{ fontSize: '0.875rem' }}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </RiderFormField>

        {/* 7. Club * */}
        <RiderFormField
          label="Club"
          required
          errorText={errors.club}
          htmlFor="rider-club-input"
          helperText="Cycling club affiliation or enter 'Independent'"
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Box
              component="input"
              id="rider-club-input"
              type="text"
              disabled={disabled}
              placeholder="e.g. Kolhapur Cycling Club"
              value={values.club}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('club', e.target.value)}
              sx={inputBaseStyles(Boolean(errors.club))}
            />
            <GroupsOutlinedIcon
              sx={{
                position: 'absolute',
                right: 12,
                fontSize: 18,
                color: colors.text.muted,
                pointerEvents: 'none',
              }}
            />
          </Box>
        </RiderFormField>

        {/* 8. Bicycle Type * */}
        <RiderFormField
          label="Bicycle Type"
          required
          errorText={errors.bicycleType}
          htmlFor="rider-bicycle-select"
        >
          <Select
            id="rider-bicycle-select"
            value={values.bicycleType || ''}
            displayEmpty
            disabled={disabled}
            onChange={(e: SelectChangeEvent<string>) => onChange('bicycleType', e.target.value)}
            startAdornment={
              <DirectionsBikeOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted, mr: 1 }} />
            }
            sx={{
              height: 44,
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${errors.bicycleType ? colors.status.error.border : colors.surface.borderStrong}`,
              borderRadius: '6px',
              color: values.bicycleType ? colors.text.primary : colors.text.muted,
              fontWeight: 500,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover': { borderColor: errors.bicycleType ? colors.status.error.dot : colors.brand.accent },
              '&.Mui-focused': {
                outline: `2px solid ${errors.bicycleType ? colors.status.error.dot : colors.brand.accent}`,
                outlineOffset: '1px',
              },
            }}
          >
            <MenuItem value="" disabled sx={{ fontSize: '0.875rem', color: colors.text.muted }}>
              Select bicycle type
            </MenuItem>
            {bicycleOptions.map((bt) => (
              <MenuItem key={bt} value={bt} sx={{ fontSize: '0.875rem' }}>
                {bt}
              </MenuItem>
            ))}
          </Select>
        </RiderFormField>

        {/* 9. Jersey Number * */}
        <RiderFormField
          label="Jersey Number"
          required
          errorText={errors.jerseyNumber}
          htmlFor="rider-jersey-input"
          helperText="Unique bib or jersey number assigned for this event"
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Box
              component="input"
              id="rider-jersey-input"
              type="text"
              disabled={disabled}
              placeholder="e.g. 101"
              value={values.jerseyNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('jerseyNumber', e.target.value)}
              sx={inputBaseStyles(Boolean(errors.jerseyNumber))}
            />
            <BadgeOutlinedIcon
              sx={{
                position: 'absolute',
                right: 12,
                fontSize: 18,
                color: colors.text.muted,
                pointerEvents: 'none',
              }}
            />
          </Box>
        </RiderFormField>

        {/* 10. Rider ID (Unique Identifier) */}
        <RiderFormField
          label="Rider ID"
          htmlFor="rider-id-input"
          helperText="Unique identifier auto-generated for QR pass generation"
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Box
              component="input"
              id="rider-id-input"
              type="text"
              disabled
              placeholder="e.g. RT-0011"
              value={values.riderId}
              sx={{
                ...inputBaseStyles(false),
                fontFamily: 'monospace',
                fontWeight: 700,
                color: colors.brand.accent,
                backgroundColor: colors.brand.accentLight,
                borderColor: '#BAE6FD',
              }}
            />
            <Box
              component="span"
              sx={{
                position: 'absolute',
                right: 10,
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: colors.brand.accent,
                backgroundColor: '#FFFFFF',
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                border: '1px solid #BAE6FD',
              }}
            >
              System ID
            </Box>
          </Box>
        </RiderFormField>
      </Box>
    </Box>
  );
};
