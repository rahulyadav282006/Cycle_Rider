import React from 'react';
import { Box, Typography } from '@mui/material';
import SyncProblemOutlinedIcon from '@mui/icons-material/SyncProblemOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { RideButton } from '../../../components/ui/RideButton';

export interface LiveTrackingConnectionWarningProps {
  lastSyncTime?: string;
  onRetry?: () => void;
}

export const LiveTrackingConnectionWarning: React.FC<LiveTrackingConnectionWarningProps> = ({
  lastSyncTime = '10:42 AM',
  onRetry,
}) => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.25 },
        mb: 3,
        backgroundColor: '#FFFBEB',
        border: '1px solid #FDE68A',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        boxShadow: '0 1px 3px 0 rgba(217, 119, 6, 0.08)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          <SyncProblemOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#D97706',
              }}
            />
            <Typography
              sx={{
                fontSize: '0.9375rem',
                fontWeight: 800,
                color: '#92400E',
                letterSpacing: '-0.01em',
              }}
            >
              Connection Interrupted
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#B45309',
                backgroundColor: '#FEF3C7',
                px: 1,
                py: 0.25,
                borderRadius: '4px',
              }}
            >
              Last synchronized: {lastSyncTime}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: '#92400E',
              lineHeight: 1.4,
            }}
          >
            Live tracking updates are temporarily unavailable. Showing the most recent synchronized data.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ alignSelf: { xs: 'flex-end', md: 'center' }, flexShrink: 0 }}>
        <RideButton
          variant="secondary"
          size="sm"
          onClick={onRetry}
          startIcon={<RefreshOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderColor: '#FCD34D',
            color: '#92400E',
            backgroundColor: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#FEF3C7',
              borderColor: '#F59E0B',
            },
          }}
        >
          Retry Connection
        </RideButton>
      </Box>
    </Box>
  );
};
