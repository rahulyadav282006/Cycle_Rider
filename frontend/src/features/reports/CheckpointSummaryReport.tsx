import React, { useState, useEffect } from 'react';
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
import { RideBadge } from '../../components/ui/RideBadge';
import { ReportSummaryCards } from './ReportSummaryCards';
import { ReportToolbar } from './ReportToolbar';
import { checkpointService, eventService } from '../../api/services';

export interface CheckpointSummaryReportProps {
  eventId?: string;
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const CheckpointSummaryReport: React.FC<CheckpointSummaryReportProps> = ({
  eventId,
  onBackToReports,
  onExport,
}) => {
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [eventData, setEventData] = useState<{
    name: string;
    date: string;
    location: string;
  }>({
    name: 'Event',
    date: '',
    location: '',
  });

  useEffect(() => {
    let isMounted = true;
    if (eventId) {
      Promise.all([
        eventService.getEvent(eventId).catch(() => null),
        checkpointService.listCheckpoints(eventId).catch(() => []),
      ]).then(([ev, list]) => {
        if (!isMounted) return;
        if (ev) {
          setEventData({
            name: ev.eventName,
            date: ev.rideDate,
            location: ev.location,
          });
        }
        if (Array.isArray(list)) {
          setCheckpoints(
            list.map((cp: any, idx: number) => ({
              id: cp.id,
              sequence: cp.sequenceNumber || idx + 1,
              name: cp.name,
              type: cp.type || 'Checkpoint',
              distance: `${cp.distanceFromStartKm || 0} km`,
              cutoffTime: '18:00',
              scannedRiders: 0,
              expectedRiders: ev?.riderCount || 0,
              dnfCount: 0,
              complianceRate: '100%',
              status: cp.isMandatory ? 'Mandatory' : 'Optional',
            }))
          );
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const totalCheckpoints = checkpoints.length;
  const mandatoryCount = checkpoints.filter((c) => c.status === 'Mandatory').length;
  const optionalCount = totalCheckpoints - mandatoryCount;

  const summaryCards = [
    { label: 'TOTAL CHECKPOINTS', value: totalCheckpoints },
    {
      label: 'MANDATORY',
      value: mandatoryCount,
      color: colors.text.primary,
      helper: 'Required for timeline',
    },
    {
      label: 'OPTIONAL',
      value: optionalCount,
      color: colors.text.secondary,
      helper: 'May be skipped',
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
          Checkpoint Summary
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
            <span>{eventData.location || 'Location not set'}</span>
          </Box>
        </Box>
      </Box>

      {/* Summary KPI Cards */}
      <ReportSummaryCards items={summaryCards} />

      {/* Toolbar */}
      <ReportToolbar
        onExportCsv={() => onExport('CSV')}
        onExportExcel={() => onExport('Excel')}
        onBackToReports={onBackToReports}
      />

      {/* Checkpoints Table */}
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
                SEQ
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                CHECKPOINT NAME
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                TYPE
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                DISTANCE
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                SCANNED
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text.muted, py: 1.5 }}>
                STATUS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkpoints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: colors.text.secondary }}>
                  No checkpoints configured for this event.
                </TableCell>
              </TableRow>
            ) : (
              checkpoints.map((cp) => (
                <TableRow
                  key={cp.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', color: colors.primary.main }}>
                    {String(cp.sequence).padStart(2, '0')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text.primary }}>
                    {cp.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                    {cp.type}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
                    {cp.distance}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text.primary }}>
                    {cp.scannedRiders}
                  </TableCell>
                  <TableCell>
                    <RideBadge
                      status={cp.status === 'Mandatory' ? 'active' : 'upcoming'}
                      label={cp.status}
                      size="sm"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
