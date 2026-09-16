import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { colors } from '../../theme/colors';
import { Volunteer } from './mockVolunteersData';
import { VolunteerStatusBadge } from './VolunteerStatusBadge';
import { RideButton } from '../ui/RideButton';

export interface VolunteerRowProps {
  volunteer: Volunteer;
  onViewVolunteer: (volunteer: Volunteer) => void;
  onAssignVolunteer: (volunteer: Volunteer) => void;
}

export const VolunteerRow: React.FC<VolunteerRowProps> = ({
  volunteer,
  onViewVolunteer,
  onAssignVolunteer,
}) => {
  // Extract initials for the avatar
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
    <TableRow
      hover
      sx={{
        borderBottom: `1px solid ${colors.surface.border}`,
        '&:last-child': { borderBottom: 'none' },
        transition: 'background-color 0.15s ease-in-out',
        '&:hover': {
          backgroundColor: colors.surface.page,
        },
      }}
    >
      {/* 1. Volunteer Name & Avatar */}
      <TableCell sx={{ py: 2, px: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: colors.brand.accentLight,
              color: colors.brand.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: colors.text.primary,
                lineHeight: 1.3,
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
      </TableCell>

      {/* 2. Mobile */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <PhoneOutlinedIcon sx={{ fontSize: 15, color: colors.text.muted }} />
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: colors.text.secondary,
              fontFamily: 'monospace',
              fontWeight: 500,
            }}
          >
            {volunteer.mobile}
          </Typography>
        </Box>
      </TableCell>

      {/* 3. Event */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <Typography
          sx={{
            fontSize: '0.8125rem',
            color: colors.text.primary,
            fontWeight: 500,
          }}
        >
          {volunteer.event}
        </Typography>
      </TableCell>

      {/* 4. Checkpoint */}
      <TableCell sx={{ py: 2, px: 2 }}>
        {isAssigned && volunteer.checkpoint && volunteer.checkpoint !== 'Unassigned' ? (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 16, color: colors.brand.accent }} />
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: colors.brand.accent,
              }}
            >
              {volunteer.checkpoint === 'Assigned Checkpoint' ? 'Start' : volunteer.checkpoint}
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: colors.text.muted,
              fontStyle: 'italic',
            }}
          >
            Unassigned
          </Typography>
        )}
      </TableCell>

      {/* 5. Status */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <VolunteerStatusBadge status={isAssigned ? 'Assigned' : 'Unassigned'} />
      </TableCell>

      {/* 6. Action */}
      <TableCell sx={{ py: 2, px: 2.5, textAlign: 'right' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {!isAssigned ? (
            <RideButton
              variant="primary"
              size="sm"
              startIcon={<AssignmentIndOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => onAssignVolunteer(volunteer)}
              sx={{
                py: '4px',
                px: 1.5,
                minHeight: 32,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Assign
            </RideButton>
          ) : (
            <RideButton
              variant="secondary"
              size="sm"
              startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => onViewVolunteer(volunteer)}
              sx={{
                py: '4px',
                px: 1.5,
                minHeight: 32,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              View
            </RideButton>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};
