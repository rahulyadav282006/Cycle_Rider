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
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { colors } from '../../theme/colors';
import { ReportSummaryCards } from './ReportSummaryCards';
import { ReportToolbar } from './ReportToolbar';
import { MOCK_REPORT_DNF, MOCK_REPORT_EVENT } from './mockReportsData';

export interface DnfReportProps {
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const DnfReport: React.FC<DnfReportProps> = ({
  onBackToReports,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDnf = useMemo(() => {
    return MOCK_REPORT_DNF.filter((item) => {
      return (
        !searchQuery.trim() ||
        item.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.riderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jerseyNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const summaryCards = [
    { label: 'TOTAL DNF RIDERS', value: 14, color: colors.status.error.dot, helper: 'Did not finish course' },
    { label: 'DNF RATE', value: '4.1%', color: '#991B1B', helper: 'Of 342 registered riders' },
    { label: 'LAST SWEPT STATION', value: 'Lunch (CP 06)', color: colors.text.secondary, helper: 'Route sweep active' },
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
          DNF Riders
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
          {MOCK_REPORT_EVENT.name} • {MOCK_REPORT_EVENT.date} • Riders who did not complete the route
        </Typography>
      </Box>

      {/* Summary Cards */}
      <ReportSummaryCards items={summaryCards} />

      {/* Toolbar */}
      <ReportToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search DNF rider by name, ID, or jersey..."
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
                  LAST SCAN
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  STATUS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDnf.map((rider) => (
                <TableRow
                  key={rider.id}
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': { backgroundColor: colors.surface.page },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'monospace, monospace', color: colors.status.error.dot, py: 1.5 }}>
                    {rider.riderId}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                    {rider.riderName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                    {rider.jerseyNumber}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.text.secondary, py: 1.5 }}>
                    {rider.lastCheckpoint}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.secondary, py: 1.5 }}>
                    {rider.lastScan}
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
                        backgroundColor: '#FEF2F2',
                        color: '#991B1B',
                        border: '1px solid #FECACA',
                      }}
                    >
                      <WarningAmberOutlinedIcon sx={{ fontSize: 13, color: '#DC2626' }} />
                      {rider.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
