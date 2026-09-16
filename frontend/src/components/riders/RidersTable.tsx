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
import { Rider } from './mockRidersData';
import { RiderRow } from './RiderRow';

export interface RidersTableProps {
  riders: Rider[];
  onViewRider: (rider: Rider) => void;
}

export const RidersTable: React.FC<RidersTableProps> = ({ riders, onViewRider }) => {
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
      <Table aria-label="Registered Riders Table">
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
                width: '12%',
              }}
            >
              Rider ID
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
              Name
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
                width: '14%',
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
                width: '10%',
              }}
            >
              Jersey No.
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
                width: '12%',
              }}
            >
              Bicycle Type
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
              align="right"
              sx={{
                py: 2,
                px: 2.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
                width: '10%',
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {riders.map((rider) => (
            <RiderRow key={rider.id} rider={rider} onViewRider={onViewRider} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
