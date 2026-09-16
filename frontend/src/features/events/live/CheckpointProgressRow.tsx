import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme/colors';
import { RideBadge } from '../../../components/ui/RideBadge';
import { LiveCheckpointProgressItem } from './mockLiveTrackingData';

export interface CheckpointProgressRowProps {
  checkpoint: LiveCheckpointProgressItem;
  isFirst: boolean;
  isLast: boolean;
}

export const CheckpointProgressRow: React.FC<CheckpointProgressRowProps> = ({
  checkpoint,
}) => {
  const sequenceStr = checkpoint.sequence.toString().padStart(2, '0');
  const isMandatory = checkpoint.requirement === 'Mandatory';
  const isCompleted = checkpoint.status === 'Completed';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        py: 1.75,
        px: { xs: 1.5, sm: 2 },
        borderBottom: `1px solid ${colors.surface.border}`,
        gap: { xs: 1.5, md: 2.5 },
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: colors.surface.page,
        },
      }}
    >
      {/* 1. Left: Sequence [01], Name, Type, Mandatory/Optional Badge */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minWidth: { md: 280 },
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            backgroundColor: isMandatory ? colors.brand.primary : '#FFFFFF',
            border: `1.5px solid ${isMandatory ? colors.brand.primary : colors.surface.borderStrong}`,
            color: isMandatory ? '#FFFFFF' : colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.8125rem',
            fontFamily: 'monospace, monospace',
            flexShrink: 0,
          }}
        >
          {sequenceStr}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: colors.text.primary,
                lineHeight: 1.3,
              }}
            >
              {checkpoint.name}
            </Typography>

            <RideBadge
              status={isMandatory ? 'mandatory' : 'optional'}
              label={checkpoint.requirement}
              size="sm"
            />
          </Box>

          <Typography
            sx={{
              fontSize: '0.75rem',
              color: colors.text.secondary,
              lineHeight: 1.2,
              mt: 0.25,
            }}
          >
            Type: <strong>{checkpoint.type}</strong>
          </Typography>
        </Box>
      </Box>

      {/* 2. Middle: Horizontal Progress Bar & Progress Count */}
      <Box sx={{ flex: 1, minWidth: { md: 220 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 600 }}>
            Progress
          </Typography>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: colors.text.primary,
            }}
          >
            {checkpoint.scannedCount} / {checkpoint.totalRiders}
          </Typography>
        </Box>

        {/* Progress Track */}
        <Box
          sx={{
            width: '100%',
            height: 7,
            borderRadius: 4,
            backgroundColor: colors.surface.subtle,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${checkpoint.percentage}%`,
              height: '100%',
              backgroundColor: isCompleted ? '#10B981' : colors.primary.main,
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }}
          />
        </Box>
      </Box>

      {/* 3. Right: Progress Percentage & Status Badge */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'space-between', md: 'flex-end' },
          gap: 2,
          minWidth: { md: 160 },
        }}
      >
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 800,
            color: colors.text.primary,
            minWidth: 42,
            textAlign: 'right',
          }}
        >
          {checkpoint.percentage}%
        </Typography>

        <Box
          sx={{
            px: 1.25,
            py: 0.35,
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            backgroundColor: isCompleted ? '#ECFDF5' : '#F0F9FF',
            color: isCompleted ? '#065F46' : '#0369A1',
            border: `1px solid ${isCompleted ? '#A7F3D0' : '#BAE6FD'}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: isCompleted ? '#059669' : '#0284C7',
            }}
          />
          {checkpoint.status}
        </Box>
      </Box>
    </Box>
  );
};
