import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { colors } from '../../theme/colors';
import { RideBadge } from '../ui/RideBadge';
import { RideButton } from '../ui/RideButton';
import { RideEvent } from './mockEventsData';

export interface EventTableProps {
  events: RideEvent[];
  onViewEvent: (event: RideEvent) => void;
}

export const EventTable: React.FC<EventTableProps> = ({ events, onViewEvent }) => {
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
      <Table aria-label="Cycling Events Table">
        <TableHead sx={{ backgroundColor: colors.surface.page }}>
          <TableRow sx={{ borderBottom: `1px solid ${colors.surface.border}` }}>
            <TableCell
              sx={{
                py: 2,
                px: 3,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
              }}
            >
              Event Name
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
              }}
            >
              Date
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
              }}
            >
              Location
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
              }}
            >
              Ride Distance
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
              }}
            >
              Status
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
              }}
            >
              Riders
            </TableCell>
            <TableCell
              align="right"
              sx={{
                py: 2,
                px: 3,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colors.text.muted,
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
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
              {/* Event Name & Tagline */}
              <TableCell sx={{ py: 2, px: 3 }}>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: colors.text.primary,
                    lineHeight: 1.3,
                  }}
                >
                  {event.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: colors.text.muted,
                    mt: 0.25,
                  }}
                >
                  {event.tagline}
                </Typography>
              </TableCell>

              {/* Date */}
              <TableCell sx={{ py: 2, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: colors.text.muted }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.text.secondary }}>
                    {event.date}
                  </Typography>
                </Box>
              </TableCell>

              {/* Location */}
              <TableCell sx={{ py: 2, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PlaceOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.text.secondary }}>
                    {event.location}
                  </Typography>
                </Box>
              </TableCell>

              {/* Ride Distance */}
              <TableCell sx={{ py: 2, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <StraightenOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary }}>
                    {event.distanceKm} km
                  </Typography>
                </Box>
              </TableCell>

              {/* Status Badge */}
              <TableCell sx={{ py: 2, px: 2 }}>
                <RideBadge status={event.status} size="sm" />
              </TableCell>

              {/* Riders */}
              <TableCell sx={{ py: 2, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PeopleIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.secondary }}>
                    {event.riderCount} riders
                  </Typography>
                </Box>
              </TableCell>

              {/* Action Button */}
              <TableCell align="right" sx={{ py: 2, px: 3 }}>
                <RideButton
                  variant="secondary"
                  size="sm"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => onViewEvent(event)}
                  sx={{
                    minHeight: 38,
                    fontSize: '0.8125rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  View Event
                </RideButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
