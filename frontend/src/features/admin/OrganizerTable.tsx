import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { colors } from '../../theme/colors';
import { MockOrganizer } from './mockAdminData';
import { RideBadge } from '../../components/ui/RideBadge';
import { RideButton } from '../../components/ui/RideButton';

export interface OrganizerTableProps {
  organizers: MockOrganizer[];
  onViewOrganizer: (organizerId: string) => void;
}

export const OrganizerTable: React.FC<OrganizerTableProps> = ({
  organizers,
  onViewOrganizer,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getStatusBadge = (status: MockOrganizer['status']) => {
    if (status === 'Active') {
      return <RideBadge status="active" label="Active" size="sm" />;
    }
    if (status === 'Pending') {
      return <RideBadge status="pending" label="Pending" size="sm" />;
    }
    return <RideBadge status="draft" label="Inactive" size="sm" />;
  };

  return (
    <TableContainer
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '10px',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: colors.surface.subtle }}>
            <TableCell
              sx={{
                py: 1.5,
                px: 2.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${colors.surface.border}`,
              }}
            >
              Organizer
            </TableCell>
            <TableCell
              sx={{
                py: 1.5,
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${colors.surface.border}`,
              }}
            >
              Email
            </TableCell>
            <TableCell
              align="center"
              sx={{
                py: 1.5,
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${colors.surface.border}`,
              }}
            >
              Events
            </TableCell>
            <TableCell
              sx={{
                py: 1.5,
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${colors.surface.border}`,
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                py: 1.5,
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${colors.surface.border}`,
              }}
            >
              Joined
            </TableCell>
            <TableCell
              align="right"
              sx={{
                py: 1.5,
                px: 2.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${colors.surface.border}`,
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {organizers.map((org) => (
            <TableRow
              key={org.id}
              hover
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(241, 245, 249, 0.6)',
                },
              }}
            >
              {/* Organizer Name & Club */}
              <TableCell sx={{ py: 2, px: 2.5, borderBottom: `1px solid ${colors.surface.border}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      backgroundColor: colors.primary.light,
                      color: colors.primary.dark,
                      border: `1px solid #BAE6FD`,
                    }}
                  >
                    {getInitials(org.name)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: colors.text.primary,
                        lineHeight: 1.2,
                      }}
                    >
                      {org.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: colors.text.secondary,
                        mt: 0.25,
                      }}
                    >
                      {org.organization || org.id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* Email */}
              <TableCell
                sx={{
                  py: 2,
                  px: 2,
                  fontSize: '0.875rem',
                  color: colors.text.secondary,
                  borderBottom: `1px solid ${colors.surface.border}`,
                }}
              >
                {org.email}
              </TableCell>

              {/* Events Count */}
              <TableCell
                align="center"
                sx={{
                  py: 2,
                  px: 2,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: colors.text.primary,
                  borderBottom: `1px solid ${colors.surface.border}`,
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 1.25,
                    py: 0.25,
                    borderRadius: '6px',
                    backgroundColor: colors.surface.subtle,
                    border: `1px solid ${colors.surface.border}`,
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                  }}
                >
                  {org.eventsCount}
                </Box>
              </TableCell>

              {/* Status */}
              <TableCell sx={{ py: 2, px: 2, borderBottom: `1px solid ${colors.surface.border}` }}>
                {getStatusBadge(org.status)}
              </TableCell>

              {/* Joined */}
              <TableCell
                sx={{
                  py: 2,
                  px: 2,
                  fontSize: '0.8125rem',
                  color: colors.text.secondary,
                  borderBottom: `1px solid ${colors.surface.border}`,
                }}
              >
                {org.joinedDate}
              </TableCell>

              {/* Action */}
              <TableCell
                align="right"
                sx={{
                  py: 2,
                  px: 2.5,
                  borderBottom: `1px solid ${colors.surface.border}`,
                }}
              >
                <RideButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewOrganizer(org.id)}
                >
                  <VisibilityOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  View
                </RideButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
