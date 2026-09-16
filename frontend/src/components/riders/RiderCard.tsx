import React from 'react';
import { Box, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { colors } from '../../theme/colors';
import { Rider } from './mockRidersData';
import { RiderStatusBadge } from './RiderStatusBadge';
import { RideButton } from '../ui/RideButton';

export interface RiderCardListProps {
  riders: Rider[];
  onViewRider: (rider: Rider) => void;
}

export const RiderCard: React.FC<RiderCardListProps> = ({ riders, onViewRider }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {riders.map((rider) => (
        <Box
          key={rider.id}
          sx={{
            backgroundColor: colors.surface.card,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '8px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Header Row: ID + Name and Status Badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: colors.brand.accent,
                    backgroundColor: colors.brand.accentLight,
                    px: 0.8,
                    py: 0.2,
                    borderRadius: '4px',
                  }}
                >
                  {rider.id}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 0.75,
                    py: 0.1,
                    borderRadius: '4px',
                    backgroundColor: colors.surface.subtle,
                    border: `1px solid ${colors.surface.borderStrong}`,
                    color: colors.text.primary,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  #{rider.jerseyNo}
                </Box>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  lineHeight: 1.3,
                }}
              >
                {rider.name}
              </Typography>
            </Box>

            <Box sx={{ flexShrink: 0 }}>
              <RiderStatusBadge status={rider.status} size="sm" />
            </Box>
          </Box>

          {/* Rider Details Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5,
              py: 1.5,
              borderTop: `1px solid ${colors.surface.border}`,
              borderBottom: `1px solid ${colors.surface.border}`,
              fontSize: '0.8125rem',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PhoneOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: colors.text.secondary,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {rider.mobile}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <DirectionsBikeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: colors.text.secondary,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {rider.bicycleType}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, gridColumn: 'span 2' }}>
              <EventAvailableOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: colors.text.secondary,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {rider.event}
              </Typography>
            </Box>
          </Box>

          {/* Action Row */}
          <Box>
            <RideButton
              variant="secondary"
              size="md"
              fullWidth
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => onViewRider(rider)}
              aria-label={`View profile for ${rider.name}`}
              sx={{
                minHeight: 44, // Minimum 44px comfortable touch target
                fontWeight: 600,
                fontSize: '0.875rem',
                borderColor: colors.surface.borderStrong,
              }}
            >
              View Profile
            </RideButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
