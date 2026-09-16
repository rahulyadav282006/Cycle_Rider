import React from 'react';
import { Box, Typography } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { colors } from '../../../theme/colors';
import { ScannerState } from './ScannerMockData';

export interface ScannerStateSwitcherProps {
  currentState: ScannerState;
  isOffline: boolean;
  onStateChange: (state: ScannerState) => void;
  onToggleOffline: () => void;
  onSimulateScan: () => void;
}

export const ScannerStateSwitcher: React.FC<ScannerStateSwitcherProps> = ({
  currentState,
  isOffline,
  onStateChange,
  onToggleOffline,
  onSimulateScan,
}) => {
  const states: { id: ScannerState; label: string; icon: React.ReactNode }[] = [
    { id: 'ready', label: '1. Ready to Scan', icon: <QrCodeScannerIcon sx={{ fontSize: 14 }} /> },
    { id: 'detected', label: '2. Rider Detected', icon: <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} /> },
    { id: 'success', label: '3. Scan Recorded', icon: <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} /> },
    { id: 'duplicate', label: '4. Duplicate Scan', icon: <WarningAmberIcon sx={{ fontSize: 14 }} /> },
    { id: 'invalid', label: '5. Invalid QR', icon: <ErrorOutlinedIcon sx={{ fontSize: 14 }} /> },
    { id: 'wrong-checkpoint', label: '6. Wrong Checkpoint', icon: <WrongLocationIcon sx={{ fontSize: 14 }} /> },
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.borderStrong}`,
        borderRadius: '8px',
        p: 2,
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 1.5,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Simulation Quick Trigger */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="button"
          type="button"
          onClick={onSimulateScan}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 2,
            py: 1,
            borderRadius: '6px',
            fontSize: '0.8125rem',
            fontWeight: 800,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#0F172A',
            color: '#38BDF8',
            boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.2)',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: '#1E293B',
              color: '#7DD3FC',
            },
          }}
        >
          <FlashOnIcon sx={{ fontSize: 17, color: '#38BDF8' }} />
          Simulate Successful Scan
        </Box>

        {/* Offline Mode Switcher */}
        <Box
          component="button"
          type="button"
          onClick={onToggleOffline}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 1,
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: isOffline ? 800 : 600,
            cursor: 'pointer',
            border: `1px solid ${isOffline ? '#F59E0B' : colors.surface.borderStrong}`,
            backgroundColor: isOffline ? '#FEF3C7' : '#FFFFFF',
            color: isOffline ? '#92400E' : colors.text.secondary,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: isOffline ? '#FDE68A' : colors.surface.page,
            },
          }}
        >
          <WifiOffIcon sx={{ fontSize: 14 }} />
          {isOffline ? 'Offline Active' : 'Test Offline Mode'}
        </Box>
      </Box>

      {/* State Switcher Pills */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          overflowX: 'auto',
          pb: { xs: 0.5, md: 0 },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: colors.text.muted,
            display: { xs: 'none', lg: 'block' },
            mr: 0.5,
          }}
        >
          Review State:
        </Typography>

        {states.map((st) => {
          const isSelected = currentState === st.id;
          return (
            <Box
              component="button"
              type="button"
              key={st.id}
              onClick={() => onStateChange(st.id)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: '6px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: isSelected ? colors.brand.accent : 'transparent',
                color: isSelected ? '#FFFFFF' : colors.text.secondary,
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: isSelected ? colors.brand.accent : colors.surface.page,
                },
              }}
            >
              {st.icon}
              {st.label}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
