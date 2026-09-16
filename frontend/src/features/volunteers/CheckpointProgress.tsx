import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import { colors } from '../../theme/colors';
import { ProgressStage } from './VolunteerMockData';

export interface CheckpointProgressProps {
  stages: ProgressStage[];
}

export const CheckpointProgress: React.FC<CheckpointProgressProps> = ({ stages }) => {
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 1.5,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineOutlinedIcon sx={{ fontSize: 18, color: colors.brand.accent }} />
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
            Event Checkpoint Progress
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: '0.75rem',
            color: colors.brand.accent,
            fontWeight: 700,
          }}
        >
          Stage 6 of 10 Active
        </Typography>
      </Box>

      {/* Progress Track List */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === 'Completed';
          const isCurrent = stage.status === 'Current';
          const isLast = idx === stages.length - 1;

          return (
            <Box
              key={stage.number}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                position: 'relative',
                pb: isLast ? 0 : 2,
              }}
            >
              {/* Vertical connecting line */}
              {!isLast && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 26,
                    left: 13,
                    width: 2,
                    bottom: 0,
                    backgroundColor: isCompleted ? '#A7F3D0' : '#E2E8F0',
                  }}
                />
              )}

              {/* Node Icon */}
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0,
                  zIndex: 1,
                  backgroundColor: '#FFFFFF',
                }}
              >
                {isCompleted ? (
                  <CheckCircleIcon sx={{ fontSize: 22, color: '#10B981' }} />
                ) : isCurrent ? (
                  <RadioButtonCheckedIcon
                    sx={{
                      fontSize: 22,
                      color: colors.brand.accent,
                      filter: 'drop-shadow(0 0 4px rgba(2, 132, 199, 0.4))',
                    }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                )}
              </Box>

              {/* Content Item */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: isCurrent ? '10px 14px' : '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: isCurrent ? '#EFF6FF' : 'transparent',
                  border: isCurrent ? '1.5px solid #BFDBFE' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Typography
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: isCurrent ? colors.brand.accent : colors.text.muted,
                    }}
                  >
                    {stage.number}
                  </Typography>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: isCurrent ? '0.9375rem' : '0.875rem',
                        fontWeight: isCurrent ? 800 : isCompleted ? 600 : 500,
                        color: isCurrent
                          ? '#1E40AF'
                          : isCompleted
                          ? colors.text.primary
                          : colors.text.secondary,
                        lineHeight: 1.2,
                      }}
                    >
                      {stage.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '0.6875rem',
                        color: colors.text.muted,
                        lineHeight: 1.2,
                      }}
                    >
                      {stage.type}
                    </Typography>
                  </Box>
                </Box>

                {/* Status Badge */}
                <Box>
                  {isCurrent ? (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1,
                        py: 0.25,
                        borderRadius: '9999px',
                        backgroundColor: '#DBEAFE',
                        color: '#1E40AF',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        border: '1px solid #93C5FD',
                      }}
                    >
                      Your Assignment
                    </Box>
                  ) : isCompleted ? (
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#059669',
                      }}
                    >
                      Completed
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: '#94A3B8',
                        fontWeight: 500,
                      }}
                    >
                      Upcoming
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
