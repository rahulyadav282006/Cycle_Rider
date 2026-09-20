import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
} from '@mui/material';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { colors } from '../../theme/colors';
import { RideBadge } from '../../components/ui/RideBadge';
import { RideButton } from '../../components/ui/RideButton';
import { ReportSummaryCards } from './ReportSummaryCards';
import { reportService, eventService, checkpointService } from '../../api/services';

export interface EventSummaryReportProps {
  eventId?: string;
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const EventSummaryReport: React.FC<EventSummaryReportProps> = ({
  eventId,
  onBackToReports,
  onExport,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [summaryData, setSummaryData] = useState<{
    eventName: string;
    date: string;
    location: string;
    distanceKm: number;
    startTime: string;
    organizerName: string;
    status: string;
    totalRegistered: number;
    totalStarted: number;
    totalFinished: number;
    totalDnf: number;
    totalHomeSafe: number;
    completionRate: number;
  }>({
    eventName: 'Event',
    date: '',
    location: '',
    distanceKm: 0,
    startTime: '06:00 AM',
    organizerName: 'Organizer Admin',
    status: 'Upcoming',
    totalRegistered: 0,
    totalStarted: 0,
    totalFinished: 0,
    totalDnf: 0,
    totalHomeSafe: 0,
    completionRate: 0,
  });

  const [checkpoints, setCheckpoints] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (eventId) {
      setLoading(true);
      Promise.all([
        eventService.getEvent(eventId).catch(() => null),
        reportService.getReport(eventId, 'event_summary').catch(() => null),
        reportService.getReport(eventId, 'checkpoints').catch(() => null),
      ])
        .then(([ev, rep, cpRep]) => {
          if (!isMounted) return;
          if (ev) {
            setSummaryData({
              eventName: ev.eventName || 'Event',
              date: ev.rideDate || '',
              location: ev.location || '',
              distanceKm: ev.rideDistance || 0,
              startTime: ev.startTime || '06:00 AM',
              organizerName: ev.organizerName || 'Organizer Admin',
              status: ev.status === 'active' ? 'Active' : ev.status === 'completed' ? 'Completed' : 'Upcoming',
              totalRegistered: rep?.totalRegistered ?? (ev.riderCount || 0),
              totalStarted: rep?.totalStarted ?? 0,
              totalFinished: rep?.totalFinished ?? 0,
              totalDnf: rep?.totalDnf ?? 0,
              totalHomeSafe: rep?.totalFinished ?? 0,
              completionRate: rep?.completionRate ?? 0,
            });
          }

          if (cpRep && Array.isArray(cpRep.items)) {
            setCheckpoints(cpRep.items);
          } else {
            checkpointService.listCheckpoints(eventId).then((list) => {
              if (isMounted && Array.isArray(list)) {
                setCheckpoints(
                  list.map((c) => ({
                    checkpointId: c.id,
                    sequenceNumber: c.sequenceNumber,
                    name: c.name,
                    mandatory: c.mandatory,
                    passedCount: 0,
                    completionPct: 0,
                  }))
                );
              }
            }).catch(() => {});
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

  const performanceCards = [
    { label: 'REGISTERED RIDERS', value: summaryData.totalRegistered, color: colors.text.primary },
    { label: 'STARTED', value: summaryData.totalStarted, color: colors.primary.main },
    { label: 'FINISHED', value: summaryData.totalFinished, color: '#2563EB' },
    { label: 'DNF', value: summaryData.totalDnf, color: colors.status.error.dot },
    { label: 'COMPLETION RATE', value: `${summaryData.completionRate}%`, color: '#059669' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box>
      {/* Printable Sheet Styling */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '8px',
          p: { xs: 2.5, sm: 4 },
          boxShadow: '0 2px 4px 0 rgba(15, 23, 42, 0.04)',
          mb: 4,
        }}
      >
        {/* Document Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            pb: 3,
            borderBottom: `2px solid ${colors.surface.borderStrong}`,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.875rem' },
                fontWeight: 900,
                color: colors.text.primary,
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                mb: 0.75,
              }}
            >
              Event Executive Summary Report
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.text.secondary }}>
              RideTrack Comprehensive Audit & Operational Summary
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <RideButton
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
            >
              Print Report
            </RideButton>
            <RideButton
              variant="primary"
              size="sm"
              onClick={() => onExport('CSV')}
            >
              Export CSV
            </RideButton>
            <RideButton
              variant="secondary"
              size="sm"
              onClick={() => onExport('Excel')}
            >
              Export Excel
            </RideButton>
          </Box>
        </Box>

        {/* Event Key Information Strip */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2.5,
            p: 2.5,
            backgroundColor: colors.surface.subtle,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PlaceOutlinedIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                LOCATION / COURSE
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                {summaryData.location || 'Not set'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarTodayOutlinedIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                RIDE DATE
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                {summaryData.date || 'Not set'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <StraightenOutlinedIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                TOTAL DISTANCE
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                {summaryData.distanceKm} KM
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AccessTimeOutlinedIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                START TIME
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                {summaryData.startTime}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonOutlineOutlinedIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                ORGANIZER
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                {summaryData.organizerName}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircleOutlinedIcon sx={{ color: '#059669', fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase' }}>
                EVENT STATUS
              </Typography>
              <RideBadge
                status={summaryData.status === 'Active' ? 'active' : 'upcoming'}
                label={summaryData.status}
                size="sm"
              />
            </Box>
          </Box>
        </Box>

        {/* Performance Metrics */}
        <Typography
          variant="h2"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 800,
            color: colors.text.primary,
            mb: 2,
            letterSpacing: '-0.01em',
          }}
        >
          Key Rider Flow & Conversion Metrics
        </Typography>
        <Box sx={{ mb: 4 }}>
          <ReportSummaryCards items={performanceCards} />
        </Box>

        {/* Checkpoint Table */}
        <Typography
          variant="h2"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 800,
            color: colors.text.primary,
            mb: 2,
            letterSpacing: '-0.01em',
          }}
        >
          Checkpoint Waypoints & Completion Funnel
        </Typography>

        <Box
          sx={{
            border: `1px solid ${colors.surface.border}`,
            borderRadius: '6px',
            overflow: 'hidden',
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '60px 2fr 1fr 1fr 1fr',
              p: 1.5,
              backgroundColor: colors.surface.subtle,
              borderBottom: `1px solid ${colors.surface.border}`,
              fontWeight: 700,
              fontSize: '0.75rem',
              color: colors.text.secondary,
            }}
          >
            <Box>SEQ</Box>
            <Box>CHECKPOINT NAME</Box>
            <Box>TYPE</Box>
            <Box>PASSES</Box>
            <Box>COMPLETION %</Box>
          </Box>

          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center', color: colors.text.secondary }}>
              Loading checkpoint funnel...
            </Box>
          ) : checkpoints.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: colors.text.secondary }}>
              No checkpoints configured for this event.
            </Box>
          ) : (
            checkpoints.map((cp, idx) => (
              <Box
                key={cp.checkpointId || idx}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '60px 2fr 1fr 1fr 1fr',
                  p: 1.5,
                  borderBottom: idx === checkpoints.length - 1 ? 'none' : `1px solid ${colors.surface.border}`,
                  fontSize: '0.8125rem',
                  color: colors.text.primary,
                  alignItems: 'center',
                }}
              >
                <Box sx={{ fontWeight: 700, color: colors.primary.main }}>
                  CP {String(cp.sequenceNumber || idx + 1).padStart(2, '0')}
                </Box>
                <Box sx={{ fontWeight: 600 }}>{cp.name}</Box>
                <Box>
                  <RideBadge
                    status={cp.mandatory ? 'published' : 'draft'}
                    label={cp.mandatory ? 'Mandatory' : 'Optional'}
                    size="sm"
                  />
                </Box>
                <Box sx={{ fontWeight: 700 }}>{cp.passedCount ?? 0}</Box>
                <Box sx={{ fontWeight: 700, color: '#059669' }}>
                  {cp.completionPct !== undefined ? `${cp.completionPct}%` : '0%'}
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Footer Audit Signoff */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
            Generated by RideTrack Core Reporting Engine • Verified DB Authenticated Export
          </Typography>
          <RideButton variant="secondary" size="sm" onClick={onBackToReports}>
            Return to Reports Index
          </RideButton>
        </Box>
      </Box>
    </Box>
  );
};
