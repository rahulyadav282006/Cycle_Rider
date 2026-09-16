import React from 'react';
import { Box, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import WcOutlinedIcon from '@mui/icons-material/WcOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';
import { RiderProfileData } from './mockRiderProfileData';

export interface RiderInformationCardProps {
  profile: RiderProfileData;
  onEditRider: () => void;
}

export const RiderInformationCard: React.FC<RiderInformationCardProps> = ({
  profile,
  onEditRider,
}) => {
  const infoFields = [
    {
      label: 'Name',
      value: profile.name,
      icon: <PersonOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Mobile Number',
      value: profile.mobile,
      icon: <PhoneOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Emergency Contact',
      value: profile.emergencyContact,
      icon: <ContactEmergencyOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Blood Group',
      value: profile.bloodGroup,
      icon: <BloodtypeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Age',
      value: `${profile.age} years`,
      icon: <CakeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Gender',
      value: profile.gender,
      icon: <WcOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Club',
      value: profile.club,
      icon: <GroupsOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Bicycle Type',
      value: profile.bicycleType,
      icon: <DirectionsBikeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Jersey Number',
      value: `#${profile.jerseyNumber}`,
      icon: <BadgeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
    {
      label: 'Rider ID',
      value: profile.id,
      isMonospace: true,
      icon: <FingerprintOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Card Header with Title and "Edit Rider" Action */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.5,
          pb: 1.5,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: '-0.01em',
          }}
        >
          Rider Information
        </Typography>

        <RideButton
          variant="secondary"
          size="sm"
          startIcon={<EditOutlinedIcon fontSize="small" />}
          onClick={onEditRider}
          sx={{
            minHeight: 34,
            fontSize: '0.8125rem',
            borderColor: colors.surface.borderStrong,
          }}
        >
          Edit Rider
        </RideButton>
      </Box>

      {/* Two-Column Read-Only Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {infoFields.map((field, idx) => (
          <Box
            key={idx}
            sx={{
              p: 1.5,
              borderRadius: '6px',
              backgroundColor: colors.surface.subtle,
              border: `1px solid ${colors.surface.border}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              {field.icon}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: colors.text.muted,
                }}
              >
                {field.label}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: colors.text.primary,
                fontFamily: field.isMonospace ? 'monospace' : 'inherit',
                letterSpacing: field.isMonospace ? '0.04em' : 'normal',
              }}
            >
              {field.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
