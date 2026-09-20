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
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { colors } from '../../theme/colors';
import { ReportSummaryCards } from './ReportSummaryCards';
import { ReportToolbar } from './ReportToolbar';
import { reportService, eventService } from '../../api/services';

export interface DnfReportProps {
  eventId?: string;
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const DnfReport: React.FC<DnfReportProps> = ({
  eventId,
  onBackToReports,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dnfList, setDnfList] = useState<any[]>([]);
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

  useEffect(() => {
    let isMounted = true;
    if (eventId) {
      setLoading(true);
      Promise.all([
        eventService.getEvent(eventId).catch(() => null),
        reportService.getReport(eventId, 'dnf').catch(() => null),
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
            setDnfList(rep.items);
          } else {
            setDnfList([]);
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

  const filteredDnf = useMemo(() => {
    return dnfList.filter((item) => {
      return (
        !searchQuery.trim() ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.riderId && item.riderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.jerseyNumber && String(item.jerseyNumber).toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [dnfList, searchQuery]);

  const dnfRate =
    eventData.totalRegistered > 0
      ? `${Math.round((dnfList.length / eventData.totalRegistered) * 100)}%`
      : '0%';

  const summaryCards = [
    {
      label: 'TOTAL DNF RIDERS',
      value: dnfList.length,
      color: dnfList.length > 0 ? colors.status.error.dot : '#059669',
      helper: 'Did not finish course',
    },
    {
      label: 'DNF RATE',
      value: dnfRate,
      color: dnfList.length > 0 ? '#991B1B' : colors.primary.main,
      helper: `Of ${eventData.totalRegistered} registered riders`,
    },
    {
      label: 'SWEEP VEHICLE STATUS',
      value: dnfList.length === 0 ? 'All Clear' : 'Sweep Active',
      color: colors.text.secondary,
      helper: 'Rider safety tracking',
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
          DNF Riders
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
          {eventData.name} {eventData.date ? `• ${eventData.date}` : ''} • Recorded Incomplete Rides
        </Typography>
      </Box>

      {/* Summary Cards */}
      <ReportSummaryCards items={summaryCards} />

      {/* Toolbar */}
      <ReportToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search DNF riders by name, ID, or jersey..."
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
                  LAST RECORDED CHECKPOINT
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  REPORTED REASON
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.secondary, py: 1.5 }}>
                  STATUS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: colors.text.secondary }}>
                    Loading DNF incident records...
                  </TableCell>
                </TableRow>
              ) : filteredDnf.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: colors.text.secondary }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#059669', fontSize: 20 }} />
                      <span>No DNF incidents reported for this event. All riders completed or active.</span>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDnf.map((item, idx) => (
                  <TableRow
                    key={item.riderId || idx}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '&:hover': { backgroundColor: colors.surface.page },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'monospace', color: colors.primary.main, py: 1.5 }}>
                      {item.riderId}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary, py: 1.5 }}>
                      #{item.jerseyNumber}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: colors.text.secondary, py: 1.5 }}>
                      {item.lastCheckpoint || 'Start'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: colors.text.secondary, py: 1.5 }}>
                      {item.reason || 'Withdrew'}
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
                          color: colors.status.error.dot,
                          border: '1px solid #FECACA',
                        }}
                      >
                        <WarningAmberOutlinedIcon sx={{ fontSize: 13, color: colors.status.error.dot }} />
                        DNF
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
