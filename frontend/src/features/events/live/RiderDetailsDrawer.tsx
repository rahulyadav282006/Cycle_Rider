import React from 'react';
import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';
import { LiveRiderItem } from './mockLiveTrackingData';

export interface RiderDetailsDrawerProps {
  open: boolean;
  rider: LiveRiderItem | null;
  eventName?: string;
  onClose: () => void;
}

export const RiderDetailsDrawer: React.FC<RiderDetailsDrawerProps> = ({
  open,
  rider,
  eventName,
  onClose,
}) => {
  if (!rider) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(15, 23, 42, 0.4)' },
        },
        paper: {
          sx: {
            width: { xs: '100%', sm: 460 },
            maxWidth: '100vw',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-8px 0 25px -5px rgba(15, 23, 42, 0.1)',
          },
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: `1px solid ${colors.surface.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: colors.brand.accentLight,
              color: colors.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.01em',
              }}
            >
              Rider Details
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
              Live checkpoint scan timeline
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close drawer"
          sx={{
            color: colors.text.muted,
            '&:hover': { color: colors.text.primary, backgroundColor: colors.surface.subtle },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Drawer Body */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
        }}
      >
        {/* Rider Summary Card */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: colors.surface.page,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '8px',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              sx={{
                fontSize: '1.125rem',
                fontWeight: 800,
                color: colors.text.primary,
              }}
            >
              {rider.name}
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: '#F0F9FF',
                color: '#0369A1',
                border: '1px solid #BAE6FD',
              }}
            >
              {rider.status}
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              fontFamily: 'monospace, monospace',
              color: colors.primary.main,
              mb: 2,
            }}
          >
            {rider.riderId}
          </Typography>

          <Divider sx={{ my: 1.5, borderColor: colors.surface.border }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, fontSize: '0.8125rem' }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
                Event
              </Typography>
              <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
                {eventName || 'Active Event'}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
                Current Checkpoint
              </Typography>
              <Typography sx={{ fontWeight: 700, color: colors.text.primary }}>
                {rider.currentCheckpoint}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
                Last Scan
              </Typography>
              <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
                {rider.lastScanTime}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
                Category
              </Typography>
              <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
                {rider.category || 'Open 200km'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Section Header: Rider Timeline */}
        <Typography
          variant="h4"
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 800,
            color: colors.text.primary,
            letterSpacing: '-0.01em',
            mb: 2,
          }}
        >
          Rider Timeline
        </Typography>

        {/* Timeline Sequence List */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {rider.timeline.map((item, idx) => {
            const isCompleted = item.status === 'Completed';
            const isLast = idx === rider.timeline.length - 1;
            const seqStr = item.sequence.toString().padStart(2, '0');

            return (
              <Box
                key={item.sequence}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  position: 'relative',
                  minHeight: 52,
                }}
              >
                {/* Left Connector Line & Dot */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 32,
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  {/* Top Line */}
                  {idx > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: '50%',
                        width: '2px',
                        backgroundColor: isCompleted ? '#10B981' : colors.surface.borderStrong,
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Bottom Line */}
                  {!isLast && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        bottom: 0,
                        width: '2px',
                        backgroundColor: isCompleted ? '#10B981' : colors.surface.borderStrong,
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Dot Icon */}
                  <Box
                    sx={{
                      my: 'auto',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#ECFDF5' : '#FFFFFF',
                      border: `2px solid ${isCompleted ? '#10B981' : colors.surface.borderStrong}`,
                      color: isCompleted ? '#059669' : colors.text.muted,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: '#059669' }} />
                    ) : (
                      <RadioButtonUncheckedOutlinedIcon sx={{ fontSize: 12, color: colors.text.muted }} />
                    )}
                  </Box>
                </Box>

                {/* Right Item Content */}
                <Box
                  sx={{
                    flex: 1,
                    ml: 1.5,
                    my: 0.5,
                    p: 1.25,
                    backgroundColor: isCompleted ? '#FFFFFF' : colors.surface.subtle,
                    border: `1px solid ${isCompleted ? colors.surface.border : colors.surface.border}`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: colors.text.primary }}>
                      {seqStr} {item.name}
                    </Typography>
                    {item.time && (
                      <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                        {item.time}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      px: 1,
                      py: 0.2,
                      borderRadius: '4px',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor: isCompleted ? '#ECFDF5' : '#F1F5F9',
                      color: isCompleted ? '#065F46' : '#64748B',
                      border: `1px solid ${isCompleted ? '#A7F3D0' : '#CBD5E1'}`,
                    }}
                  >
                    {item.status}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Drawer Footer */}
      <Box
        sx={{
          p: 2.5,
          borderTop: `1px solid ${colors.surface.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <RideButton variant="secondary" onClick={onClose}>
          Close
        </RideButton>
      </Box>
    </Drawer>
  );
};
