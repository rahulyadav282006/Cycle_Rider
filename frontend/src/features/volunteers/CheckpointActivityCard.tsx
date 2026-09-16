import React from 'react';
import { Box, Typography } from '@mui/material';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { colors } from '../../theme/colors';
import { CheckpointActivity } from './VolunteerMockData';

export interface CheckpointActivityCardProps {
  activity: CheckpointActivity;
}

export const CheckpointActivityCard: React.FC<CheckpointActivityCardProps> = ({ activity }) => {
  const percentage = Math.round((activity.scannedHere / activity.ridersExpected) * 100);

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 2.5 },
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Header */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InsightsOutlinedIcon sx={{ fontSize: 18, color: colors.brand.accent }} />
          <Typography
            variant="h3"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: colors.text.muted,
            }}
          >
            Checkpoint Activity
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.2,
            borderRadius: '4px',
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            fontSize: '0.6875rem',
            fontWeight: 700,
          }}
        >
          {percentage}% Complete
        </Box>
      </Box>

      {/* 3 Metric Counters */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1.5,
          mb: 2.5,
        }}
      >
        {/* Riders Expected */}
        <Box
          sx={{
            p: 1.5,
            backgroundColor: colors.surface.page,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: colors.text.muted,
              display: 'block',
              mb: 0.5,
            }}
          >
            Expected
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 800,
              color: colors.text.primary,
              lineHeight: 1,
            }}
          >
            {activity.ridersExpected}
          </Typography>
        </Box>

        {/* Scanned Here */}
        <Box
          sx={{
            p: 1.5,
            backgroundColor: '#F0FDF4',
            borderRadius: '6px',
            border: '1px solid #BBF7D0',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#15803D',
              display: 'block',
              mb: 0.5,
            }}
          >
            Scanned Here
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 800,
              color: '#166534',
              lineHeight: 1,
            }}
          >
            {activity.scannedHere}
          </Typography>
        </Box>

        {/* Remaining */}
        <Box
          sx={{
            p: 1.5,
            backgroundColor: '#FFFBEB',
            borderRadius: '6px',
            border: '1px solid #FDE68A',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#B45309',
              display: 'block',
              mb: 0.5,
            }}
          >
            Remaining
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 800,
              color: '#92400E',
              lineHeight: 1,
            }}
          >
            {activity.remaining}
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
            Scanning Progress
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.primary }}>
            {activity.scannedHere} / {activity.ridersExpected} Riders
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 8,
            borderRadius: '4px',
            backgroundColor: colors.surface.border,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: '#10B981',
              borderRadius: '4px',
              transition: 'width 0.4s ease-in-out',
            }}
          />
        </Box>
      </Box>

      {/* Last Scan Information */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          p: 1.5,
          borderRadius: '6px',
          backgroundColor: colors.surface.page,
          border: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: colors.brand.accentLight,
              color: colors.brand.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.6875rem', color: colors.text.muted, display: 'block' }}>
              Last Scan
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                {activity.lastScan.riderName}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: colors.brand.accent,
                  backgroundColor: colors.brand.accentLight,
                  px: 0.6,
                  py: 0.1,
                  borderRadius: '3px',
                }}
              >
                {activity.lastScan.riderId}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: { xs: 5.25, sm: 0 } }}>
          <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.secondary }}>
            {activity.lastScan.time}
          </Typography>
          <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: '#10B981', ml: 0.5 }} />
        </Box>
      </Box>
    </Box>
  );
};
