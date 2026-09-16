import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { colors } from '../../../theme/colors';
import { RideBadge } from '../../../components/ui/RideBadge';
import { RideButton } from '../../../components/ui/RideButton';

export type LiveTrackingPrototypeState =
  | 'populated'
  | 'empty'
  | 'rider_selected'
  | 'checkpoint_filter'
  | 'offline_warning';

export interface LiveTrackingHeaderProps {
  onBackToEvent?: () => void;
  activeState?: LiveTrackingPrototypeState;
  onStateChange?: (state: LiveTrackingPrototypeState) => void;
  lastUpdatedText?: string;
}

export const LiveTrackingHeader: React.FC<LiveTrackingHeaderProps> = ({
  onBackToEvent,
  activeState = 'populated',
  onStateChange,
  lastUpdatedText = 'Just now',
}) => {
  const states: { key: LiveTrackingPrototypeState; label: string }[] = [
    { key: 'populated', label: '1. Populated' },
    { key: 'empty', label: '2. Empty State' },
    { key: 'rider_selected', label: '3. Rider Selected' },
    { key: 'checkpoint_filter', label: '4. Checkpoint Filter' },
    { key: 'offline_warning', label: '5. Connection Warning' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Interactive Prototype States Switcher */}
      {onStateChange && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2.5,
            p: 1.25,
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
            <LayersOutlinedIcon sx={{ fontSize: 18, color: colors.primary.main }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Prototype States:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {states.map((s) => {
              const isSelected = activeState === s.key;
              return (
                <Box
                  key={s.key}
                  component="button"
                  onClick={() => onStateChange(s.key)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 700 : 500,
                    border: '1px solid',
                    borderColor: isSelected ? colors.primary.main : colors.surface.borderStrong,
                    backgroundColor: isSelected ? colors.brand.accentLight : 'transparent',
                    color: isSelected ? colors.primary.dark : colors.text.secondary,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: isSelected ? colors.brand.accentLight : colors.surface.subtle,
                    },
                  }}
                >
                  {s.label}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Breadcrumb Navigation */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
          fontSize: '0.8125rem',
          color: colors.text.secondary,
        }}
      >
        <Typography
          component="span"
          sx={{
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            '&:hover': { color: colors.primary.main },
          }}
          onClick={onBackToEvent}
        >
          RideTrack
        </Typography>
        <Typography component="span" sx={{ color: colors.text.muted }}>
          &gt;
        </Typography>
        <Typography
          component="span"
          sx={{
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            '&:hover': { color: colors.primary.main },
          }}
          onClick={onBackToEvent}
        >
          Events
        </Typography>
        <Typography component="span" sx={{ color: colors.text.muted }}>
          &gt;
        </Typography>
        <Typography
          component="span"
          sx={{
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            '&:hover': { color: colors.primary.main },
          }}
          onClick={onBackToEvent}
        >
          Kolhapur Endurance Ride
        </Typography>
        <Typography component="span" sx={{ color: colors.text.muted }}>
          &gt;
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: colors.text.primary,
          }}
        >
          Live Tracking
        </Typography>
      </Box>

      {/* Title & Back Action */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' },
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            Live Tracking
          </Typography>
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: colors.text.secondary,
              lineHeight: 1.4,
            }}
          >
            Monitor rider progress and checkpoint activity in real time.
          </Typography>
        </Box>

        <RideButton
          variant="secondary"
          onClick={onBackToEvent}
          startIcon={<ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />}
        >
          Back to Event
        </RideButton>
      </Box>

      {/* Event Header Summary Strip */}
      <Box
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          px: { xs: 2, sm: 2.5 },
          py: 1.75,
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left: Event Name and Active Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 800,
              color: colors.text.primary,
              lineHeight: 1.2,
            }}
          >
            Kolhapur Endurance Ride
          </Typography>
          <RideBadge status="active" label="ACTIVE" size="sm" />
        </Box>

        {/* Center: Metadata */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2.5 },
            fontSize: '0.8125rem',
            color: colors.text.secondary,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              13 September 2026
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              Kolhapur
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <StraightenOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary }}>
              200 km
            </Typography>
          </Box>
        </Box>

        {/* Right: Prominent Status Indicator (LIVE & Last updated) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            px: 1.5,
            py: 0.6,
            borderRadius: '9999px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)',
              }}
            />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#065F46',
                letterSpacing: '0.05em',
              }}
            >
              LIVE
            </Typography>
          </Box>

          <Box sx={{ width: '1px', height: 12, backgroundColor: '#A7F3D0' }} />

          <Typography sx={{ fontSize: '0.75rem', color: '#047857', fontWeight: 500 }}>
            Last updated: {lastUpdatedText}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
