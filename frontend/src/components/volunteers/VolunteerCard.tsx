import React from 'react';
import { Box, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { colors } from '../../theme/colors';
import { Volunteer } from './mockVolunteersData';
import { VolunteerStatusBadge } from './VolunteerStatusBadge';
import { RideButton } from '../ui/RideButton';

export interface VolunteerCardProps {
  volunteers: Volunteer[];
  onViewVolunteer: (volunteer: Volunteer) => void;
  onAssignVolunteer: (volunteer: Volunteer) => void;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteers,
  onViewVolunteer,
  onAssignVolunteer,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {volunteers.map((volunteer) => {
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
          <Box
            key={volunteer.id}
            sx={{
              backgroundColor: colors.surface.card,
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '8px',
              p: 2,
              boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.75,
            }}
          >
            {/* Top row: Avatar + Name + Status */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: colors.brand.accentLight,
                    color: colors.brand.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: colors.text.primary,
                      lineHeight: 1.2,
                    }}
                  >
                    {volunteer.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      color: colors.text.muted,
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  >
                    {volunteer.id}
                  </Typography>
                </Box>
              </Box>

              <VolunteerStatusBadge status={isAssigned ? 'Assigned' : 'Unassigned'} size="sm" />
            </Box>

            {/* Middle row: Info grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
                p: 1.5,
                backgroundColor: colors.surface.page,
                borderRadius: '6px',
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    color: colors.text.muted,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    mb: 0.25,
                  }}
                >
                  Mobile
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneOutlinedIcon sx={{ fontSize: 13, color: colors.text.muted }} />
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      fontFamily: 'monospace',
                      color: colors.text.secondary,
                      fontWeight: 600,
                    }}
                  >
                    {volunteer.mobile}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    color: colors.text.muted,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    mb: 0.25,
                  }}
                >
                  Checkpoint
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnOutlinedIcon
                    sx={{
                      fontSize: 14,
                      color: isAssigned ? colors.brand.accent : colors.text.muted,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: isAssigned ? 600 : 400,
                      color: isAssigned ? colors.brand.accent : colors.text.muted,
                      fontStyle: isAssigned ? 'normal' : 'italic',
                    }}
                  >
                    {volunteer.checkpoint === 'Assigned Checkpoint' ? 'Start' : volunteer.checkpoint}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    color: colors.text.muted,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    mb: 0.25,
                  }}
                >
                  Event
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EventAvailableOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {volunteer.event}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Bottom row: Action */}
            <Box>
              {!isAssigned ? (
                <RideButton
                  variant="primary"
                  size="sm"
                  fullWidth
                  startIcon={<AssignmentIndOutlinedIcon />}
                  onClick={() => onAssignVolunteer(volunteer)}
                  sx={{ minHeight: 40, fontWeight: 700 }}
                >
                  Assign Volunteer
                </RideButton>
              ) : (
                <RideButton
                  variant="secondary"
                  size="sm"
                  fullWidth
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => onViewVolunteer(volunteer)}
                  sx={{ minHeight: 40, fontWeight: 600 }}
                >
                  View Details
                </RideButton>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
