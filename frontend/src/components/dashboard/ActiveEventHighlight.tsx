import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import PeopleIcon from '@mui/icons-material/People';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { DashboardEvent } from './mockDashboardData';

export interface ActiveEventHighlightProps {
  event: DashboardEvent | null;
  onOpenScanner?: () => void;
  onViewAllEvents?: () => void;
}

export const ActiveEventHighlight: React.FC<ActiveEventHighlightProps> = ({
  event,
  onOpenScanner,
  onViewAllEvents,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '14px',
        p: { xs: 2.5, sm: 3 },
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Top Controls Row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.5,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Current Event Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.85,
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            borderRadius: '9999px',
            px: 1.5,
            py: 0.45,
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          Current Event
        </Box>

        {/* View All Events Action */}
        <Box
          component="button"
          type="button"
          onClick={onViewAllEvents}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.5,
            py: 0.6,
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#135F63',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: '#F8FAFC',
              borderColor: '#CBD5E1',
            },
          }}
        >
          View All Events
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
          minHeight: 90,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left Side: Event Information or Empty State */}
        <Box sx={{ maxWidth: { xs: '100%', md: '55%' } }}>
          {event ? (
            <>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  mb: 1,
                }}
              >
                {event.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  color: '#475569',
                  fontSize: '0.8125rem',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                  <span>{event.date}</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PlaceOutlinedIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                  <span>{event.location}</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StraightenOutlinedIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                  <span>{event.distanceKm} km</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PeopleIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                  <span>{event.riderCount} riders</span>
                </Box>
              </Box>
              {onOpenScanner && (
                <Box
                  component="button"
                  type="button"
                  onClick={onOpenScanner}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#135F63',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#0E4E52',
                    },
                  }}
                >
                  <QrCodeScannerIcon sx={{ fontSize: 18 }} />
                  Open Scanner
                </Box>
              )}
            </>
          ) : (
            <>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  mb: 0.5,
                }}
              >
                No active event
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  fontWeight: 400,
                }}
              >
                No event is currently in progress.
              </Typography>
            </>
          )}
        </Box>

        {/* Right Side: Mountain Ridges with Cyclist Illustration */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            width: { sm: 300, md: 380 },
            height: 100,
            overflow: 'hidden',
            pointerEvents: 'none',
            ml: 'auto',
          }}
        >
          <svg
            viewBox="0 0 380 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Background Mountains */}
            <path
              d="M0 80 Q 90 40, 180 65 T 320 35 T 380 50 L 380 100 L 0 100 Z"
              fill="#E6F4EA"
              opacity="0.75"
            />
            {/* Mid Mountain Ridge */}
            <path
              d="M50 85 Q 150 50, 240 70 T 360 48 L 380 55 L 380 100 L 50 100 Z"
              fill="#D1FAE5"
              opacity="0.8"
            />
            {/* Foreground Slope */}
            <path
              d="M120 90 Q 220 62, 300 75 L 380 68 L 380 100 L 120 100 Z"
              fill="#CCFBF1"
              opacity="0.9"
            />
            {/* Mountain Cyclist Outline */}
            <g transform="translate(230, 28) scale(0.68)">
              {/* Back Wheel */}
              <circle cx="12" cy="30" r="10" stroke="#0D9488" strokeWidth="2.5" fill="none" opacity="0.85" />
              {/* Front Wheel */}
              <circle cx="48" cy="30" r="10" stroke="#0D9488" strokeWidth="2.5" fill="none" opacity="0.85" />
              {/* Bike Frame */}
              <path
                d="M12 30 L 26 30 L 38 18 L 22 18 Z M 26 30 L 32 14 M 38 18 L 48 30 M 38 18 L 34 8"
                stroke="#0D9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.85"
              />
              {/* Handlebars */}
              <path d="M31 7 L 37 7" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              {/* Rider Head */}
              <circle cx="28" cy="2" r="3.5" fill="#0D9488" opacity="0.85" />
              {/* Rider Torso */}
              <path
                d="M27 6 L 22 16 L 33 11 L 34 8"
                stroke="#0D9488"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.85"
              />
              {/* Pedaling Legs */}
              <path
                d="M22 16 L 27 24 L 25 30"
                stroke="#0D9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.85"
              />
            </g>
          </svg>
        </Box>
      </Box>
    </Box>
  );
};
