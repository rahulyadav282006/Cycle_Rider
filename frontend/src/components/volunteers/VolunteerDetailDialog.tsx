import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../ui/RideButton';
import { Volunteer } from './mockVolunteersData';
import { VolunteerStatusBadge } from './VolunteerStatusBadge';

export interface VolunteerDetailDialogProps {
  open: boolean;
  onClose: () => void;
  volunteer: Volunteer | null;
  onEditAssignment: (volunteer: Volunteer) => void;
}

export const VolunteerDetailDialog: React.FC<VolunteerDetailDialogProps> = ({
  open,
  onClose,
  volunteer,
  onEditAssignment,
}) => {
  if (!volunteer) return null;

  const initials = volunteer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isAssigned =
    volunteer.status?.toLowerCase() === 'assigned' ||
    (Boolean(volunteer.checkpoint) && volunteer.checkpoint !== 'Unassigned') ||
    Boolean(volunteer.checkpointId && volunteer.checkpointId !== 'unassigned');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '8px',
            border: `1px solid ${colors.surface.border}`,
            boxShadow:
              '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          backgroundColor: colors.surface.page,
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: colors.brand.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.brand.accent,
            }}
          >
            <PersonIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.0625rem',
                color: colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              Volunteer Details
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
              Event support staff profile and checkpoint allocation
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="Close dialog">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ p: 3 }}>
        {/* Identity Header Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: colors.surface.subtle,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: colors.brand.accentLight,
                color: colors.brand.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 700,
                border: `2px solid ${colors.brand.accentLight}`,
              }}
            >
              {initials}
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                <Typography
                  sx={{
                    fontSize: '1.125rem',
                    fontWeight: 800,
                    color: colors.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  {volunteer.name}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: colors.brand.accent,
                    backgroundColor: colors.brand.accentLight,
                    px: 0.75,
                    py: 0.2,
                    borderRadius: '4px',
                  }}
                >
                  {volunteer.id}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                Cycling Event Support Staff
              </Typography>
            </Box>
          </Box>

          <VolunteerStatusBadge status={isAssigned ? 'Assigned' : 'Unassigned'} />
        </Box>

        {/* 2-Column Information Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {/* Mobile Number */}
          <Box
            sx={{
              p: 1.75,
              backgroundColor: '#FFFFFF',
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '6px',
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
              Mobile Number
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneOutlinedIcon sx={{ fontSize: 16, color: colors.brand.accent }} />
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  color: colors.text.primary,
                }}
              >
                {volunteer.mobile}
              </Typography>
            </Box>
          </Box>

          {/* Assigned Event */}
          <Box
            sx={{
              p: 1.75,
              backgroundColor: '#FFFFFF',
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '6px',
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
              Assigned Event
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventAvailableOutlinedIcon sx={{ fontSize: 16, color: colors.brand.accent }} />
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                {volunteer.event}
              </Typography>
            </Box>
          </Box>

          {/* Assigned Checkpoint */}
          <Box
            sx={{
              p: 1.75,
              backgroundColor: '#FFFFFF',
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '6px',
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
              Assigned Checkpoint
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnOutlinedIcon
                sx={{
                  fontSize: 16,
                  color: isAssigned ? '#10B981' : colors.text.muted,
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: isAssigned ? colors.text.primary : colors.text.muted,
                  fontStyle: isAssigned ? 'normal' : 'italic',
                }}
              >
                {volunteer.checkpoint === 'Assigned Checkpoint' ? 'Start' : volunteer.checkpoint}
              </Typography>
            </Box>
          </Box>

          {/* Assignment Status */}
          <Box
            sx={{
              p: 1.75,
              backgroundColor: '#FFFFFF',
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '6px',
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
              Assignment Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isAssigned ? '#065F46' : colors.text.muted,
                }}
              >
                {isAssigned
                  ? `Active (${volunteer.assignedAt || 'Confirmed'})`
                  : 'Pending Assignment'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          py: 2,
          px: 3,
          backgroundColor: colors.surface.page,
          borderTop: `1px solid ${colors.surface.border}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <RideButton variant="secondary" size="md" onClick={onClose}>
          Close
        </RideButton>

        <RideButton
          variant="primary"
          size="md"
          startIcon={<EditOutlinedIcon />}
          onClick={() => {
            onClose();
            onEditAssignment(volunteer);
          }}
          sx={{ minHeight: 44, fontWeight: 700 }}
        >
          Edit Assignment
        </RideButton>
      </DialogActions>
    </Dialog>
  );
};
