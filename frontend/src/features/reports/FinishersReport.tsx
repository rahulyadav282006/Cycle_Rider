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
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { colors } from '../../theme/colors';
import { ReportSummaryCards } from './ReportSummaryCards';
import { ReportToolbar } from './ReportToolbar';
import { MOCK_REPORT_FINISHERS, MOCK_REPORT_EVENT } from './mockReportsData';

export interface FinishersReportProps {
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const FinishersReport: React.FC<FinishersReportProps> = ({
  onBackToReports,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('Fastest First');

  const sortOptions = ['Fastest First', 'Finish Time', 'Rider ID', 'Rider Name'];

  const filteredFinishers = useMemo(() => {
    return MOCK_REPORT_FINISHERS.filter((f) => {
      return (
        !searchQuery.trim() ||
        f.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.riderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.jerseyNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const summaryCards = [
    { label: 'OFFICIAL FINISHERS', value: 286, color: '#059669', helper: 'Completed full 200 km' },
    { label: 'FINISH RATE', value: '83.6%', color: colors.primary.main, helper: 'Of 342 registered riders' },
    { label: 'AVG RIDE TIME', value: '03h 36m', color: colors.text.primary, helper: 'Fastest: 03h 28m' },
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
          Finishers Report
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
          {MOCK_REPORT_EVENT.name} • {MOCK_REPORT_EVENT.date} • Official Course Finishers
        </Typography>
      </Box>

      {/* Summary Cards */}
      <ReportSummaryCards items={summaryCards} />

      {/* Toolbar */}
      <ReportToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search finishers by name, ID, or jersey..."
        statusFilter={sortOrder}
        onStatusFilterChange={setSortOrder}
        statusOptions={sortOptions}
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
                  FINISH CHECKPOINT
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  FINISH TIME
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  TOTAL RIDE TIME
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  STATUS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFinishers.map((f, idx) => (
                <TableRow
                  key={f.id}
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': { backgroundColor: colors.surface.page },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'monospace, monospace', color: colors.primary.main, py: 1.5 }}>
                    {f.riderId}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {idx < 3 && (
                        <EmojiEventsOutlinedIcon
                          sx={{
                            fontSize: 16,
                            color: idx === 0 ? '#F59E0B' : idx === 1 ? '#94A3B8' : '#B45309',
                          }}
                        />
                      )}
                      {f.riderName}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                    {f.jerseyNumber}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: colors.text.secondary, py: 1.5 }}>
                    {f.finishCheckpoint}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                    {f.finishTime}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', py: 1.5 }}>
                    {f.totalRideTime}
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
                      {f.status}
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
