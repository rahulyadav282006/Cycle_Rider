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
import DirectionsBikeOutlinedIcon from '@mui/icons-material/DirectionsBikeOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { colors } from '../../../theme/colors';
import { RideButton } from '../../../components/ui/RideButton';
import { LiveRiderItem, LiveRiderStatus } from './mockLiveTrackingData';

export interface RiderStatusTableProps {
  riders: LiveRiderItem[];
  onViewRider: (rider: LiveRiderItem) => void;
}

export const RiderStatusTable: React.FC<RiderStatusTableProps> = ({
  riders,
  onViewRider,
}) => {
  const getStatusBadge = (status: LiveRiderStatus) => {
    switch (status) {
      case 'At Checkpoint':
        return {
          bg: '#F0F9FF',
          text: '#0369A1',
          border: '#BAE6FD',
          dot: '#0284C7',
        };
      case 'Finished':
        return {
          bg: '#EFF6FF',
          text: '#1E40AF',
          border: '#BFDBFE',
          dot: '#2563EB',
        };
      case 'DNF':
        return {
          bg: '#FEF2F2',
          text: '#991B1B',
          border: '#FECACA',
          dot: '#DC2626',
        };
      case 'Home Safe':
        return {
          bg: '#ECFDF5',
          text: '#065F46',
          border: '#A7F3D0',
          dot: '#059669',
        };
      default:
        return {
          bg: '#F1F5F9',
          text: '#475569',
          border: '#CBD5E1',
          dot: '#64748B',
        };
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 3 },
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <DirectionsBikeOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
            }}
          >
            Rider Status
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary, fontWeight: 600 }}>
          {riders.length} {riders.length === 1 ? 'rider' : 'riders'} listed
        </Typography>
      </Box>

      {/* When no riders match filters */}
      {riders.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: 'center',
            backgroundColor: colors.surface.subtle,
            borderRadius: '6px',
          }}
        >
          <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary, fontWeight: 500 }}>
            No riders match the selected search or filter criteria.
          </Typography>
        </Box>
      ) : (
        /* Table Container (Desktop & Tablet) */
        <TableContainer
          sx={{
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '6px',
            overflowX: 'auto',
          }}
        >
          <Table size="small">
            <TableHead sx={{ backgroundColor: colors.surface.subtle }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  RIDER ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  NAME
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  CURRENT CHECKPOINT
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  LAST SCAN
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  STATUS
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riders.map((rider) => {
                const badge = getStatusBadge(rider.status);
                return (
                  <TableRow
                    key={rider.id}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '&:hover': { backgroundColor: colors.surface.page },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        fontFamily: 'monospace, monospace',
                        color: colors.text.primary,
                        py: 1.5,
                      }}
                    >
                      {rider.riderId}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                      {rider.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: colors.text.primary, py: 1.5 }}>
                      {rider.currentCheckpoint}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.secondary, py: 1.5 }}>
                      {rider.lastScanTime}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.6,
                          px: 1,
                          py: 0.25,
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: badge.dot,
                          }}
                        />
                        {rider.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <RideButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewRider(rider)}
                        startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 15 }} />}
                      >
                        View
                      </RideButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
