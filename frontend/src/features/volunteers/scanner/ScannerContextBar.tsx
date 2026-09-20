import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import WifiOffOutlinedIcon from '@mui/icons-material/WifiOffOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';
import { ScannerCheckpointContext } from './ScannerTypes';

export interface ScannerContextBarProps {
  context: ScannerCheckpointContext;
  isOffline: boolean;
  onNavigateHome: () => void;
}

export const ScannerContextBar: React.FC<ScannerContextBarProps> = ({
  context,
  isOffline,
  onNavigateHome,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 1.75, sm: 2 },
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Left: Checkpoint & Event details */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
        {/* CP Badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: '6px',
            backgroundColor: colors.brand.accent,
            color: '#FFFFFF',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.9375rem',
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {context.checkpointCode}
          </Typography>
          <Box sx={{ width: '1px', height: 14, backgroundColor: 'rgba(255,255,255,0.4)' }} />
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            {context.checkpointName}
          </Typography>
        </Box>

        {/* Event Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <EventAvailableOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary }}>
            {context.event}
          </Typography>
        </Box>

        {/* Status Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: '9999px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            fontSize: '0.6875rem',
            fontWeight: 700,
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
          {context.status}
        </Box>

        {/* Connection status badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: '9999px',
            backgroundColor: isOffline ? '#FEF3C7' : '#EFF6FF',
            border: `1px solid ${isOffline ? '#FDE68A' : '#BFDBFE'}`,
            color: isOffline ? '#92400E' : '#1D4ED8',
            fontSize: '0.6875rem',
            fontWeight: 700,
          }}
        >
          {isOffline ? (
            <>
              <WifiOffOutlinedIcon sx={{ fontSize: 13, color: '#D97706' }} />
              Offline — scans will sync automatically
            </>
          ) : (
            <>
              <WifiOutlinedIcon sx={{ fontSize: 13, color: '#0284C7' }} />
              Online
            </>
          )}
        </Box>

        {/* Pending sync counter badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: '9999px',
            backgroundColor: context.pendingSyncCount > 0 ? '#FEF3C7' : '#F1F5F9',
            border: `1px solid ${context.pendingSyncCount > 0 ? '#FDE68A' : '#CBD5E1'}`,
            color: context.pendingSyncCount > 0 ? '#92400E' : colors.text.secondary,
            fontSize: '0.6875rem',
            fontWeight: 700,
          }}
        >
          Pending sync: {context.pendingSyncCount}
        </Box>
      </Box>

      {/* Right: Back to Volunteer Home action */}
      <RideButton
        variant="secondary"
        size="sm"
        startIcon={<ArrowBackIcon fontSize="small" />}
        onClick={onNavigateHome}
        sx={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          minHeight: 36,
          alignSelf: { xs: 'stretch', sm: 'auto' },
        }}
      >
        Back to Volunteer Home
      </RideButton>
    </Box>
  );
};
