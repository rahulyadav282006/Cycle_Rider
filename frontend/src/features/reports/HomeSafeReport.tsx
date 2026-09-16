import React, { useState, useMemo } from 'react';
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
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import { colors } from '../../theme/colors';
import { ReportSummaryCards } from './ReportSummaryCards';
import { ReportToolbar } from './ReportToolbar';
import { MOCK_REPORT_HOME_SAFE, MOCK_REPORT_EVENT } from './mockReportsData';

export interface HomeSafeReportProps {
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const HomeSafeReport: React.FC<HomeSafeReportProps> = ({
  onBackToReports,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const statusOptions = ['All Status', 'Confirmed', 'Pending'];

  const filteredItems = useMemo(() => {
    return MOCK_REPORT_HOME_SAFE.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.riderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jerseyNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All Status' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const summaryCards = [
    { label: 'REGISTERED', value: 342, helper: 'Total participants' },
    { label: 'HOME SAFE', value: 270, color: '#059669', helper: 'Safety verified' },
    { label: 'PENDING CONFIRMATION', value: 72, color: '#D97706', helper: 'Awaiting rider ping' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.375rem', sm: '1.625rem' },
            fontWeight: 800,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            mb: 0.75,
          }}
        >
          Home Safe Confirmation
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
          {MOCK_REPORT_EVENT.name} • {MOCK_REPORT_EVENT.date} • Post-Ride Safety Verification
        </Typography>
      </Box>

      {/* Summary Cards */}
      <ReportSummaryCards items={summaryCards} />

      {/* Toolbar */}
      <ReportToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search rider by name, ID, or jersey..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
        onExportCsv={() => onExport('CSV')}
        onExportExcel={() => onExport('Excel')}
        onBackToReports={onBackToReports}
        showBack={true}
      />

      {/* Table */}
      <Box
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
          overflow: 'hidden',
        }}
      >
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: colors.surface.subtle }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  RIDER ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  RIDER NAME
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  JERSEY NUMBER
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  LAST CHECKPOINT
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  HOME SAFE TIME
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  STATUS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => {
                const isConfirmed = item.status === 'Confirmed';
                return (
                  <TableRow
                    key={item.id}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '&:hover': { backgroundColor: colors.surface.page },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'monospace, monospace', color: colors.primary.main, py: 1.5 }}>
                      {item.riderId}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                      {item.riderName}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                      {item.jerseyNumber}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: colors.text.secondary, py: 1.5 }}>
                      {item.lastCheckpoint}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                      {item.homeSafeTime}
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
                          backgroundColor: isConfirmed ? '#ECFDF5' : '#FFFBEB',
                          color: isConfirmed ? '#065F46' : '#92400E',
                          border: `1px solid ${isConfirmed ? '#A7F3D0' : '#FDE68A'}`,
                        }}
                      >
                        {isConfirmed ? (
                          <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#059669' }} />
                        ) : (
                          <HourglassEmptyOutlinedIcon sx={{ fontSize: 13, color: '#D97706' }} />
                        )}
                        {item.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
