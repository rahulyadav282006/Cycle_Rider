import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { colors } from '../../theme/colors';
import { CheckpointTimelineItem } from './mockRiderProfileData';

export interface RiderTimelineItemProps {
  item: CheckpointTimelineItem;
  isLast: boolean;
}

export const RiderTimelineItem: React.FC<RiderTimelineItemProps> = ({ item, isLast }) => {
  const isCompleted = item.status === 'Completed';
  const isCurrent = item.status === 'Current';

  const nodeColor = isCompleted
    ? '#059669' // Emerald
    : isCurrent
    ? colors.brand.accent // Sky Blue
    : colors.text.muted; // Gray

  const nodeBg = isCompleted
    ? '#ECFDF5'
    : isCurrent
    ? colors.brand.accentLight
    : colors.surface.subtle;

  const nodeBorder = isCompleted
    ? '#A7F3D0'
    : isCurrent
    ? '#BAE6FD'
    : colors.surface.borderStrong;

  return (
    <Box sx={{ display: 'flex', position: 'relative', pb: isLast ? 0 : 2.5 }}>
      {/* 1. Left Vertical Track & Icon Node */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mr: 2,
          position: 'relative',
          width: 32,
          flexShrink: 0,
        }}
      >
        {/* Step Indicator Node */}
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: nodeBg,
            border: `2px solid ${nodeBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: nodeColor,
            zIndex: 2,
            boxShadow: isCurrent ? '0 0 0 3px rgba(2, 132, 199, 0.2)' : 'none',
          }}
        >
          {isCompleted ? (
            <CheckIcon sx={{ fontSize: 16, fontWeight: 700 }} />
          ) : isCurrent ? (
            <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
          )}
        </Box>

        {/* Vertical Connecting Rail to Next Node */}
        {!isLast && (
          <Box
            sx={{
              position: 'absolute',
              top: 28,
              bottom: 0,
              width: 2,
              backgroundColor: isCompleted ? '#A7F3D0' : colors.surface.borderStrong,
              zIndex: 1,
            }}
          />
        )}
      </Box>

      {/* 2. Checkpoint Details Content */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: isCurrent ? '#F0F9FF' : colors.surface.subtle,
          border: `1px solid ${isCurrent ? '#BAE6FD' : colors.surface.border}`,
          borderRadius: '6px',
          p: 1.5,
          transition: 'all 0.15s ease',
          '&:hover': {
            borderColor: isCurrent ? colors.brand.accent : colors.surface.borderStrong,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
            mb: 0.5,
            flexWrap: 'wrap',
          }}
        >
          {/* Sequence Number + Checkpoint Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              component="span"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isCompleted ? '#059669' : isCurrent ? colors.brand.accent : colors.text.muted,
                backgroundColor: '#FFFFFF',
                border: `1px solid ${colors.surface.borderStrong}`,
                px: 0.6,
                py: 0.1,
                borderRadius: '4px',
              }}
            >
              {item.sequence}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              {item.name}
            </Typography>
          </Box>

          {/* Status Badge */}
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.2,
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              lineHeight: 1,
              backgroundColor: isCompleted
                ? '#ECFDF5'
                : isCurrent
                ? '#E0F2FE'
                : colors.surface.card,
              border: `1px solid ${
                isCompleted ? '#A7F3D0' : isCurrent ? '#BAE6FD' : colors.surface.borderStrong
              }`,
              color: isCompleted
                ? '#065F46'
                : isCurrent
                ? '#0369A1'
                : colors.text.muted,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: nodeColor,
              }}
            />
            {item.status}
          </Box>
        </Box>

        {/* Type and Recorded Timestamp */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            fontSize: '0.75rem',
            color: colors.text.secondary,
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
            {item.type}
          </Typography>

          {item.time && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: colors.text.muted }} />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: isCompleted ? colors.text.primary : colors.text.muted,
                }}
              >
                {item.time}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
