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
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { colors } from '../../../theme/colors';
import { RecentScanItem } from './mockLiveTrackingData';

export interface RecentScanActivityProps {
  scans: RecentScanItem[];
}

export const RecentScanActivity: React.FC<RecentScanActivityProps> = ({ scans }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.surface.card,
        border: `1px solid ${colors.surface.border}`,
        borderRadius: '8px',
        p: { xs: 2, sm: 3 },
        mb: 4,
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
        <QrCodeScannerOutlinedIcon sx={{ fontSize: 20, color: colors.primary.main }} />
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            fontWeight: 800,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
          }}
        >
          Recent Scan Activity
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: '0.875rem',
          color: colors.text.secondary,
          mb: 2.5,
        }}
      >
        Real-time checkpoint scan stream recorded by station volunteers.
      </Typography>

      {/* Table Container */}
      <TableContainer
        sx={{
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '6px',
        }}
      >
        <Table size="small">
          <TableHead sx={{ backgroundColor: colors.surface.subtle }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                RIDER
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                RIDER ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                CHECKPOINT
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                TIME
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                STATUS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scans.map((scan) => (
              <TableRow
                key={scan.id}
                sx={{
                  '&:last-child td': { borderBottom: 0 },
                  '&:hover': { backgroundColor: colors.surface.page },
                  transition: 'background-color 0.15s ease',
                }}
              >
                <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                  {scan.riderName}
                </TableCell>
                <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.secondary, fontFamily: 'monospace, monospace', py: 1.5 }}>
                  {scan.riderId}
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem', color: colors.text.primary, py: 1.5 }}>
                  {scan.checkpoint}
                </TableCell>
                <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.secondary, py: 1.5 }}>
                  {scan.time}
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1,
                      py: 0.25,
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: '#ECFDF5',
                      color: '#065F46',
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#059669' }} />
                    {scan.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
