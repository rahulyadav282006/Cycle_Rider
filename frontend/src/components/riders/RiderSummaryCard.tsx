import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { colors } from '../../theme/colors';
import { RiderProfileData } from './mockRiderProfileData';
import { RiderStatusBadge } from './RiderStatusBadge';

export interface RiderSummaryCardProps {
  profile: RiderProfileData;
}

export const RiderSummaryCard: React.FC<RiderSummaryCardProps> = ({ profile }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3 },
        mb: 3,
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2.5,
        }}
      >
        {/* Left Side: Avatar + Name + ID + Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Avatar / Rider Icon */}
          <Box
            sx={{
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              borderRadius: '50%',
              backgroundColor: colors.brand.primaryLight,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 4px 0 rgba(15, 23, 42, 0.1)',
            }}
          >
            <PersonIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 800,
                  color: colors.text.primary,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                {profile.name}
              </Typography>
              <RiderStatusBadge status={profile.status} size="sm" />
            </Box>

            {/* Monospace Rider ID Badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: colors.brand.accent,
                  backgroundColor: colors.brand.accentLight,
                  border: '1px solid #BAE6FD',
                  px: 1,
                  py: 0.25,
                  borderRadius: '4px',
                }}
              >
                Rider ID: {profile.id}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side: Clean Horizontal Metadata Badges */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2.5 },
            flexWrap: 'wrap',
            pt: { xs: 1.5, sm: 0 },
            borderTop: { xs: `1px solid ${colors.surface.border}`, sm: 'none' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {/* Event */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <EventAvailableOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: colors.text.muted,
                  display: 'block',
                  lineHeight: 1,
                  mb: 0.25,
                }}
              >
                Event
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                {profile.event}
              </Typography>
            </Box>
          </Box>

          {/* Jersey Number */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <BadgeOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: colors.text.muted,
                  display: 'block',
                  lineHeight: 1,
                  mb: 0.25,
                }}
              >
                Jersey No.
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                #{profile.jerseyNumber}
              </Typography>
            </Box>
          </Box>

          {/* Distance */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <StraightenOutlinedIcon sx={{ fontSize: 18, color: colors.text.muted }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: colors.text.muted,
                  display: 'block',
                  lineHeight: 1,
                  mb: 0.25,
                }}
              >
                Distance
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
                {profile.rideDistance}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
