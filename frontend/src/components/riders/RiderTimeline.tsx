import React from 'react';
import { Box, Typography } from '@mui/material';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import { colors } from '../../theme/colors';
import { CheckpointTimelineItem } from './mockRiderProfileData';
import { RiderTimelineItem } from './RiderTimelineItem';

export interface RiderTimelineProps {
  timeline: CheckpointTimelineItem[];
}

export const RiderTimeline: React.FC<RiderTimelineProps> = ({ timeline }) => {
  const completedCount = timeline.filter((t) => t.status === 'Completed').length;
  const totalCount = timeline.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2.5, sm: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Card Header */}
      <Box sx={{ mb: 2.5, pb: 1.5, borderBottom: `1px solid ${colors.surface.border}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineOutlinedIcon sx={{ fontSize: 20, color: colors.brand.accent }} />
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: colors.text.primary,
                letterSpacing: '-0.01em',
              }}
            >
              Ride Timeline
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#059669',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              px: 1,
              py: 0.25,
              borderRadius: '4px',
            }}
          >
            {completedCount} of {totalCount} Completed ({progressPercent}%)
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
          Checkpoint history for this rider.
        </Typography>

        {/* Mini Progress Track */}
        <Box
          sx={{
            width: '100%',
            height: 4,
            backgroundColor: colors.surface.subtle,
            borderRadius: '9999px',
            mt: 1.5,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#059669',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>

      {/* Vertical Timeline Items List */}
      <Box sx={{ pt: 1 }}>
        {timeline.map((item, idx) => (
          <RiderTimelineItem
            key={item.sequence}
            item={item}
            isLast={idx === timeline.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};
