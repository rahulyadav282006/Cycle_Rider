import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import { colors } from '../../theme/colors';
import { Rider } from './mockRidersData';
import { RiderStatusBadge } from './RiderStatusBadge';
import { RideButton } from '../ui/RideButton';

export interface RiderRowProps {
  rider: Rider;
  onViewRider: (rider: Rider) => void;
}

export const RiderRow: React.FC<RiderRowProps> = ({ rider, onViewRider }) => {
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
      {/* 1. Rider ID */}
      <TableCell sx={{ py: 2, px: 2.5 }}>
        <Typography
          component="span"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: colors.brand.accent,
            backgroundColor: colors.brand.accentLight,
            px: 1,
            py: 0.3,
            borderRadius: '4px',
            display: 'inline-block',
          }}
        >
          {rider.id}
        </Typography>
      </TableCell>

      {/* 2. Name */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: colors.text.primary,
            lineHeight: 1.3,
          }}
        >
          {rider.name}
        </Typography>
      </TableCell>

      {/* 3. Mobile */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <PhoneOutlinedIcon sx={{ fontSize: 15, color: colors.text.muted }} />
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: colors.text.secondary,
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {rider.mobile}
          </Typography>
        </Box>
      </TableCell>

      {/* 4. Jersey No. */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 32,
            height: 24,
            px: 0.75,
            borderRadius: '4px',
            backgroundColor: colors.surface.subtle,
            border: `1px solid ${colors.surface.borderStrong}`,
            color: colors.text.primary,
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          #{rider.jerseyNo}
        </Box>
      </TableCell>

      {/* 5. Event */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <Typography
          sx={{
            fontSize: '0.8125rem',
            color: colors.text.secondary,
            fontWeight: 500,
            maxWidth: 180,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={rider.event}
        >
          {rider.event}
        </Typography>
      </TableCell>

      {/* 6. Bicycle Type */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <DirectionsBikeOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: colors.text.secondary,
              fontWeight: 500,
            }}
          >
            {rider.bicycleType}
          </Typography>
        </Box>
      </TableCell>

      {/* 7. Status */}
      <TableCell sx={{ py: 2, px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
          <RiderStatusBadge status={rider.status} size="sm" />
          <Box
            component="span"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              px: 0.75,
              py: 0.2,
              borderRadius: '3px',
              backgroundColor: rider.paymentStatus === 'verified' ? '#ECFDF5' : '#FFFBEB',
              color: rider.paymentStatus === 'verified' ? '#065F46' : '#92400E',
              border: `1px solid ${rider.paymentStatus === 'verified' ? '#A7F3D0' : '#FDE68A'}`,
            }}
          >
            {rider.paymentStatus === 'verified' ? 'Paid' : 'Pending'}
          </Box>
        </Box>
      </TableCell>

      {/* 8. Action */}
      <TableCell align="right" sx={{ py: 2, px: 2.5 }}>
        <RideButton
          variant="secondary"
          size="sm"
          startIcon={<VisibilityOutlinedIcon fontSize="small" />}
          onClick={() => onViewRider(rider)}
          aria-label={`View profile for ${rider.name}`}
          sx={{
            minHeight: 36,
            minWidth: 78,
            fontSize: '0.8125rem',
            px: 1.5,
            whiteSpace: 'nowrap',
            borderColor: colors.surface.borderStrong,
            '&:hover': {
              borderColor: colors.brand.accent,
              color: colors.brand.accent,
            },
          }}
        >
          View
        </RideButton>
      </TableCell>
    </TableRow>
  );
};
