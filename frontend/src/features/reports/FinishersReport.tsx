import React, { useState, useEffect, useMemo } from 'react';
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
import { reportService, eventService } from '../../api/services';

export interface FinishersReportProps {
  eventId?: string;
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const FinishersReport: React.FC<FinishersReportProps> = ({
  eventId,
  onBackToReports,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('Default');
  const [finishers, setFinishers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [eventData, setEventData] = useState<{
    name: string;
    date: string;
    location: string;
    totalRegistered: number;
  }>({
    name: 'Event',
    date: '',
    location: '',
    totalRegistered: 0,
  });

  const sortOptions = ['Default', 'Rider Name', 'Rider ID'];

  useEffect(() => {
    let isMounted = true;
    if (eventId) {
      setLoading(true);
      Promise.all([
        eventService.getEvent(eventId).catch(() => null),
        reportService.getReport(eventId, 'finishers').catch(() => null),
      ])
        .then(([ev, rep]) => {
          if (!isMounted) return;
          if (ev) {
            setEventData({
              name: ev.eventName || 'Event',
              date: ev.rideDate || '',
              location: ev.location || '',
              totalRegistered: ev.riderCount || 0,
            });
          }
          if (rep && Array.isArray(rep.items)) {
            setFinishers(rep.items);
          } else {
            setFinishers([]);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const filteredFinishers = useMemo(() => {
    let res = finishers.filter((f) => {
      return (
        !searchQuery.trim() ||
        (f.name && f.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.riderId && f.riderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.jerseyNumber && String(f.jerseyNumber).toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

    if (sortOrder === 'Rider Name') {
      res = [...res].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOrder === 'Rider ID') {
      res = [...res].sort((a, b) => (a.riderId || '').localeCompare(b.riderId || ''));
    }

    return res;
  }, [finishers, searchQuery, sortOrder]);

  const finishRate =
    eventData.totalRegistered > 0
      ? `${Math.round((finishers.length / eventData.totalRegistered) * 100)}%`
      : finishers.length > 0
      ? '100%'
      : '0%';

  const summaryCards = [
    {
      label: 'OFFICIAL FINISHERS',
      value: finishers.length,
      color: '#059669',
      helper: 'Completed course & verified',
    },
    {
      label: 'FINISH RATE',
      value: finishRate,
      color: colors.primary.main,
      helper: `Of ${eventData.totalRegistered} registered riders`,
    },
    {
      label: 'STATUS',
      value: finishers.length > 0 ? 'Verified' : 'Pending Scans',
      color: colors.text.primary,
      helper: 'Course tracking active',
    },
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
          {eventData.name} {eventData.date ? `• ${eventData.date}` : ''} • Official Course Finishers
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
                  FINISH TIME
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  STATUS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: colors.text.secondary }}>
                    Loading finishers report...
                  </TableCell>
                </TableRow>
              ) : filteredFinishers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: colors.text.secondary }}>
                    No finishers recorded yet for this event.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFinishers.map((f, idx) => (
                  <TableRow
                    key={f.riderId || idx}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '&:hover': { backgroundColor: colors.surface.page },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'monospace', color: colors.primary.main, py: 1.5 }}>
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
                        {f.name}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                      #{f.jerseyNumber}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                      {f.finishTime || '--:--'}
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
                        {f.status || 'Verified Finisher'}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
