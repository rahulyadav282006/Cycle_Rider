import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import PeopleIcon from '@mui/icons-material/People';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { colors } from '../../theme/colors';
import { RideBadge } from '../ui/RideBadge';
import { RideButton } from '../ui/RideButton';
import { DashboardEvent } from './mockDashboardData';

export interface ActiveEventHighlightProps {
  event: DashboardEvent;
  onOpenScanner: () => void;
}

export const ActiveEventHighlight: React.FC<ActiveEventHighlightProps> = ({
  event,
  onOpenScanner,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: '1px solid #A7F3D0', // Soft emerald border indicating active course
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3 },
        mb: 3,
        position: 'relative',
        boxShadow: '0 2px 4px 0 rgba(16, 185, 129, 0.06)',
        background: 'linear-gradient(180deg, #FAFCFD 0%, #FFFFFF 100%)',
      }}
    >
      {/* Top Header Row with Active Status */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Pulsing Live Dot */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '9999px',
              px: 1.25,
              py: 0.35,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#059669',
                boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)',
              }}
            />
            <Typography
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#065F46',
                textTransform: 'uppercase',
              }}
            >
              Currently Active
            </Typography>
          </Box>
          <RideBadge status="active" label="Active" size="sm" />
        </Box>

        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            color: colors.text.muted,
            fontWeight: 500,
          }}
        >
          {event.tagline}
        </Typography>
      </Box>

      {/* Main Info Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2.5,
        }}
      >
        {/* Left: Title and Metadata */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
              mb: 1.25,
            }}
          >
            {event.name}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2.5 },
              color: colors.text.secondary,
              fontSize: '0.8125rem',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                {event.date}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PlaceOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                {event.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <StraightenOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                {event.distanceKm} km course
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PeopleIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                {event.riderCount} riders
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <FlagOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                {event.checkpointCount} checkpoints
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right: Action Button */}
        <Box sx={{ alignSelf: { xs: 'stretch', md: 'auto' } }}>
          <RideButton
            variant="secondary"
            size="md"
            startIcon={<QrCodeScannerIcon />}
            onClick={onOpenScanner}
            sx={{
              minHeight: 44,
              width: { xs: '100%', md: 'auto' },
              borderColor: '#A7F3D0',
              color: '#065F46',
              '&:hover': {
                backgroundColor: '#ECFDF5',
                borderColor: '#059669',
              },
            }}
          >
            Scanner Station
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
