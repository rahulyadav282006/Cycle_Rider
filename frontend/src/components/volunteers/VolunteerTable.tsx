import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
import { colors } from '../../theme/colors';
import { Volunteer } from './mockVolunteersData';
import { VolunteerRow } from './VolunteerRow';

export interface VolunteerTableProps {
  volunteers: Volunteer[];
  onViewVolunteer: (volunteer: Volunteer) => void;
  onAssignVolunteer: (volunteer: Volunteer) => void;
}

export const VolunteerTable: React.FC<VolunteerTableProps> = ({
  volunteers,
  onViewVolunteer,
  onAssignVolunteer,
}) => {
  return (
    <TableContainer
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        overflow: 'hidden',
      }}
    >
      <Table aria-label="Volunteers Table">
        <TableHead sx={{ backgroundColor: colors.surface.page }}>
          <TableRow sx={{ borderBottom: `1px solid ${colors.surface.border}` }}>
            <TableCell
              sx={{
                py: 2,
                px: 2.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
                width: '24%',
              }}
            >
              Volunteer
            </TableCell>
            <TableCell
              sx={{
                py: 2,
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
                width: '16%',
              }}
            >
              Mobile
            </TableCell>
            <TableCell
              sx={{
                py: 2,
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
                width: '22%',
              }}
            >
              Event
            </TableCell>
            <TableCell
              sx={{
                py: 2,
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
                width: '18%',
              }}
            >
              Checkpoint
            </TableCell>
            <TableCell
              sx={{
                py: 2,
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
                width: '10%',
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                py: 2,
                px: 2.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
                textAlign: 'right',
                width: '10%',
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {volunteers.map((vol) => (
            <VolunteerRow
              key={vol.id}
              volunteer={vol}
              onViewVolunteer={onViewVolunteer}
              onAssignVolunteer={onAssignVolunteer}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
