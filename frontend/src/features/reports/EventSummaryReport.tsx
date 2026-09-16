import React from 'react';
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
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { colors } from '../../theme/colors';
import { RideBadge } from '../../components/ui/RideBadge';
import { RideButton } from '../../components/ui/RideButton';
import { ReportSummaryCards } from './ReportSummaryCards';
import { ReportToolbar } from './ReportToolbar';
import {
  MOCK_REPORT_EVENT,
  MOCK_REPORT_CHECKPOINTS,
} from './mockReportsData';

export interface EventSummaryReportProps {
  onBackToReports: () => void;
  onExport: (format: 'CSV' | 'Excel') => void;
}

export const EventSummaryReport: React.FC<EventSummaryReportProps> = ({
  onBackToReports,
  onExport,
}) => {
  const performanceCards = [
    { label: 'REGISTERED RIDERS', value: 342, color: colors.text.primary },
    { label: 'STARTED', value: 320, color: colors.primary.main },
    { label: 'FINISHED', value: 286, color: '#2563EB' },
    { label: 'DNF', value: 14, color: colors.status.error.dot },
    { label: 'HOME SAFE', value: 270, color: '#059669' },
  ];

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
            pb: 3,
            borderBottom: `2px solid ${colors.brand.primary}`,
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.primary.main,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: 0.5,
              }}
            >
              RideTrack Official Event Executive Summary
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.875rem' },
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.02em',
              }}
            >
              {MOCK_REPORT_EVENT.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <RideBadge status="active" label={MOCK_REPORT_EVENT.status} size="md" />
            <RideButton
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
            >
              Print
            </RideButton>
          </Box>
        </Box>

        {/* Event Information Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 2,
            p: 2.5,
            backgroundColor: colors.surface.page,
            borderRadius: '6px',
            border: `1px solid ${colors.surface.border}`,
            mb: 3.5,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
                Date
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {MOCK_REPORT_EVENT.date}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <PlaceOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
                Location
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {MOCK_REPORT_EVENT.location}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <StraightenOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
                Ride Distance
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {MOCK_REPORT_EVENT.distanceKm} km
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
                Start Time
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {MOCK_REPORT_EVENT.startTime}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <PersonOutlineOutlinedIcon sx={{ fontSize: 14, color: colors.text.muted }} />
              <Typography sx={{ fontSize: '0.75rem', color: colors.text.muted, fontWeight: 500 }}>
                Organizer
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
              {MOCK_REPORT_EVENT.organizer}
            </Typography>
          </Box>
        </Box>

        {/* Toolbar */}
        <ReportToolbar
          onExportCsv={() => onExport('CSV')}
          onExportExcel={() => onExport('Excel')}
          onBackToReports={onBackToReports}
          showBack={true}
        />

        {/* Performance Cards */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1rem',
              fontWeight: 800,
              color: colors.text.primary,
              mb: 1.5,
            }}
          >
            Rider Participation &amp; Completion Metrics
          </Typography>
          <ReportSummaryCards items={performanceCards} />
        </Box>

        {/* Volunteer Coverage Section */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PeopleAltOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: '#166534' }}>
                Volunteer Staffing Coverage: 8 / 10 Checkpoints Assigned
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#15803D' }}>
                80% route station staffing coverage ensuring continuous timer and safety scanning operations.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: '#FFFFFF',
              border: '1px solid #86EFAC',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#166534',
              flexShrink: 0,
            }}
          >
            Operational
          </Box>
        </Box>

        {/* Checkpoint Performance Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1rem',
              fontWeight: 800,
              color: colors.text.primary,
              mb: 1.5,
            }}
          >
            Route Checkpoint Breakdown
          </Typography>

          <Box
            sx={{
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {MOCK_REPORT_CHECKPOINTS.map((cp, idx) => (
              <Box
                key={cp.sequence}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.25,
                  borderBottom: idx < MOCK_REPORT_CHECKPOINTS.length - 1 ? `1px solid ${colors.surface.border}` : 0,
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : colors.surface.page,
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 220 }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 800, fontFamily: 'monospace' }}>
                    {cp.sequence.toString().padStart(2, '0')}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                    {cp.name}
                  </Typography>
                  <RideBadge status={cp.required === 'Mandatory' ? 'mandatory' : 'optional'} label={cp.required} size="sm" />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxWidth: 320 }}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.surface.subtle,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: cp.completionRate,
                        height: '100%',
                        backgroundColor: cp.status === 'Completed' ? '#10B981' : colors.primary.main,
                        borderRadius: 3,
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, minWidth: 70, textAlign: 'right' }}>
                    {cp.scanned} riders ({cp.completionRate})
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Recent Activity Section */}
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1rem',
              fontWeight: 800,
              color: colors.text.primary,
              mb: 1.5,
            }}
          >
            Event Operations Audit Log
          </Typography>

          <Box
            sx={{
              p: 2,
              backgroundColor: colors.surface.page,
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '6px',
            }}
          >
            {[
              { time: '11:45 AM', text: 'Executive audit snapshot generated by Organizer Admin.' },
              { time: '10:48 AM', text: '270th rider home safe confirmation recorded (Priya Kulkarni RT-0005).' },
              { time: '10:35 AM', text: 'First finisher passed Destination (Sneha Joshi RT-0003 in 03h 35m).' },
              { time: '09:40 AM', text: 'Route sweeper verified DNF for Sagar Mane at Checkpoint 1.' },
              { time: '07:00 AM', text: 'Main peloton start signaled at CP 04 (320 riders released).' },
            ].map((log, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 0.75,
                  borderBottom: index < 4 ? `1px dashed ${colors.surface.border}` : 0,
                  fontSize: '0.8125rem',
                }}
              >
                <CheckCircleOutlinedIcon sx={{ fontSize: 15, color: '#059669' }} />
                <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', color: colors.text.secondary }}>
                  {log.time}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto' }} />
                <Typography sx={{ color: colors.text.primary }}>
                  {log.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
