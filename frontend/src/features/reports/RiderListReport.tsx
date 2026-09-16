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
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { colors } from '../../theme/colors';
import { ReportSummaryCards } from './ReportSummaryCards';
import { ReportToolbar } from './ReportToolbar';
import { riderService, eventService } from '../../api/services';

export interface RiderListReportProps {
  eventId?: string;
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const RiderListReport: React.FC<RiderListReportProps> = ({
  eventId,
  onBackToReports,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [riders, setRiders] = useState<any[]>([]);
  const [eventData, setEventData] = useState<{
    name: string;
    date: string;
    location: string;
    distanceKm: number;
  }>({
    name: 'Event',
    date: '',
    location: '',
    distanceKm: 0,
  });

  const statusOptions = ['All Status', 'Registered', 'Active', 'Finished', 'DNF', 'Home Safe'];

  useEffect(() => {
    let isMounted = true;
    if (eventId) {
      Promise.all([
        eventService.getEvent(eventId).catch(() => null),
        riderService.listRiders(eventId).catch(() => []),
      ]).then(([ev, list]) => {
        if (!isMounted) return;
        if (ev) {
          setEventData({
            name: ev.eventName,
            date: ev.rideDate,
            location: ev.location,
            distanceKm: ev.rideDistance,
          });
        }
        if (Array.isArray(list)) {
          setRiders(
            list.map((r: any) => ({
              id: r.riderId || r.id,
              riderId: r.riderId || r.id,
              name: r.name,
              jerseyNumber: String(r.jerseyNumber || '101'),
              category: r.bicycleType || 'General',
              status:
                r.status === 'Completed' || r.status === 'finished'
                  ? 'Finished'
                  : r.status === 'In-Transit' || r.status === 'started'
                  ? 'Active'
                  : r.status === 'DNF' || r.status === 'dnf'
                  ? 'DNF'
                  : 'Registered',
              lastCheckpoint: 'Start',
              scanTime: '06:00 AM',
            }))
          );
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const filteredRiders = useMemo(() => {
    return riders.filter((rider) => {
      const matchesSearch =
        !searchQuery.trim() ||
        rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.riderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.jerseyNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All Status' || rider.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, riders]);

  const summaryCards = [
    { label: 'TOTAL RIDERS', value: riders.length },
    {
      label: 'ACTIVE',
      value: riders.filter((r) => r.status === 'Active').length,
      color: colors.primary.main,
    },
    {
      label: 'FINISHED',
      value: riders.filter((r) => r.status === 'Finished').length,
      color: '#2563EB',
    },
    {
      label: 'DNF',
      value: riders.filter((r) => r.status === 'DNF').length,
      color: colors.status.error.dot,
    },
    {
      label: 'HOME SAFE',
      value: riders.filter((r) => r.status === 'Home Safe').length,
      color: '#059669',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Registered':
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
      case 'Active':
        return { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' };
      case 'Finished':
        return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
      case 'DNF':
        return { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };
      case 'Home Safe':
        return { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
    }
  };

  return (
    <Box>
      {/* Report Header */}
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
          Rider List Report
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', fontSize: '0.8125rem', color: colors.text.secondary }}>
          <Typography sx={{ fontWeight: 700, color: colors.text.primary }}>
            {eventData.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: colors.text.muted }} />
            <span>{eventData.date || 'Date not set'}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 15, color: colors.text.muted }} />
            <span>{eventData.location || 'Location not set'} ({eventData.distanceKm} km)</span>
          </Box>
        </Box>
      </Box>

      {/* Summary KPI Cards */}
      <ReportSummaryCards items={summaryCards} />

      {/* Filter and Export Toolbar */}
      <ReportToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search riders by name, ID, or jersey..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
        onExportCsv={() => onExport('CSV')}
        onExportExcel={() => onExport('Excel')}
        onBackToReports={onBackToReports}
      />

      {/* Riders Table */}
      <TableContainer
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.surface.page }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                JERSEY
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                RIDER
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                RIDER ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                CATEGORY
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                STATUS
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                LAST CHECKPOINT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRiders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: colors.text.secondary }}>
                  No riders found for this event.
                </TableCell>
              </TableRow>
            ) : (
              filteredRiders.map((rider) => {
                const badgeStyle = getStatusBadge(rider.status);
                return (
                  <TableRow
                    key={rider.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', color: colors.primary.main }}>
                      {rider.jerseyNumber}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text.primary }}>
                      {rider.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.muted, fontFamily: 'monospace' }}>
                      {rider.riderId}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                      {rider.category}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.25,
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.text,
                          border: `1px solid ${badgeStyle.border}`,
                        }}
                      >
                        {rider.status}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                      {rider.lastCheckpoint}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
