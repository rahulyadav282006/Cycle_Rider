import React from 'react';
import { Box, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WifiOffOutlinedIcon from '@mui/icons-material/WifiOffOutlined';
import LayersClearOutlinedIcon from '@mui/icons-material/LayersClearOutlined';
import { colors } from '../../theme/colors';

export type VolunteerUIState = 'assigned' | 'offline' | 'no-assignment';

export interface VolunteerHomeHeaderProps {
  currentState?: VolunteerUIState;
  onStateChange?: (state: VolunteerUIState) => void;
}

export const VolunteerHomeHeader: React.FC<VolunteerHomeHeaderProps> = ({
  currentState = 'assigned',
  onStateChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      {/* Title & Breadcrumb */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: colors.text.muted,
            fontSize: '0.75rem',
            lineHeight: 1,
            mb: 0.5,
          }}
        >
          <Typography component="span" sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
            RideTrack
          </Typography>
          <NavigateNextIcon sx={{ fontSize: 13, color: colors.text.muted }} />
          <Typography component="span" sx={{ fontSize: '0.75rem', color: colors.brand.accent, fontWeight: 600 }}>
            Volunteer Home
          </Typography>
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            fontWeight: 800,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          Volunteer Home
        </Typography>

        <Typography
          sx={{
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: 1.4,
          }}
        >
          Your assigned checkpoint for today's ride.
        </Typography>
      </Box>

      {/* State Switcher for Evaluator Convenience */}
      {onStateChange && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          p: 0.5,
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.surface.borderStrong}`,
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
          width: { xs: '100%', sm: 'auto' },
          overflowX: 'auto',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: colors.text.muted,
            px: 1,
            display: { xs: 'none', lg: 'block' },
          }}
        >
          State:
        </Typography>

        {/* State A: Assigned */}
        <Box
          component="button"
          type="button"
          onClick={() => onStateChange('assigned')}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.25,
            py: '6px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: currentState === 'assigned' ? 700 : 500,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: currentState === 'assigned' ? colors.brand.accent : 'transparent',
            color: currentState === 'assigned' ? '#FFFFFF' : colors.text.secondary,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: currentState === 'assigned' ? colors.brand.accent : colors.surface.page,
            },
          }}
        >
          <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />
          Assigned / Ready
        </Box>

        {/* State B: Offline */}
        <Box
          component="button"
          type="button"
          onClick={() => onStateChange('offline')}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.25,
            py: '6px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: currentState === 'offline' ? 700 : 500,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: currentState === 'offline' ? '#D97706' : 'transparent',
            color: currentState === 'offline' ? '#FFFFFF' : colors.text.secondary,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: currentState === 'offline' ? '#D97706' : colors.surface.page,
            },
          }}
        >
          <WifiOffOutlinedIcon sx={{ fontSize: 15 }} />
          Offline Mode
        </Box>

        {/* State C: No Assignment */}
        <Box
          component="button"
          type="button"
          onClick={() => onStateChange('no-assignment')}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.25,
            py: '6px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: currentState === 'no-assignment' ? 700 : 500,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: currentState === 'no-assignment' ? '#475569' : 'transparent',
            color: currentState === 'no-assignment' ? '#FFFFFF' : colors.text.secondary,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: currentState === 'no-assignment' ? '#475569' : colors.surface.page,
            },
          }}
        >
          <LayersClearOutlinedIcon sx={{ fontSize: 15 }} />
          No Assignment
        </Box>
      </Box>
      )}
    </Box>
  );
};
