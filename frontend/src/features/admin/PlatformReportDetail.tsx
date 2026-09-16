import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Divider,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { colors } from '../../theme/colors';
import { RideButton } from '../../components/ui/RideButton';
import { RideBadge } from '../../components/ui/RideBadge';
import {
  MOCK_ORGANIZERS,
} from './mockAdminData';

export interface PlatformReportDetailProps {
  onBack: () => void;
}

export const PlatformReportDetail: React.FC<PlatformReportDetailProps> = ({ onBack }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExport = (format: 'CSV' | 'Excel') => {
    setToastMessage(`Exporting Platform Summary Report as ${format}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Action Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={onBack}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            backgroundColor: 'transparent',
            border: 'none',
            color: colors.text.secondary,
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            p: 0,
            '&:hover': { color: colors.primary.main },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Back to Platform Reports
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <RideButton variant="secondary" size="sm" onClick={handlePrint}>
            <PrintOutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            Print Report
          </RideButton>

          <RideButton variant="secondary" size="sm" onClick={() => handleExport('CSV')}>
            <FileDownloadOutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            Export CSV
          </RideButton>

          <RideButton variant="primary" size="sm" onClick={() => handleExport('Excel')}>
            <FileDownloadOutlinedIcon sx={{ fontSize: 16, mr: 0.75 }} />
            Export Excel
          </RideButton>
        </Box>
      </Box>

      {/* Main Printable Document Card */}
      <Card
        sx={{
          backgroundColor: colors.surface.card,
          border: `1px solid ${colors.surface.border}`,
          borderRadius: '10px',
          boxShadow: '0 2px 6px 0 rgba(15, 23, 42, 0.06)',
          p: { xs: 3, sm: 4, md: 5 },
        }}
      >
        {/* Document Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <AssessmentOutlinedIcon sx={{ fontSize: 24, color: colors.primary.main }} />
              <Typography variant="h2" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 800, color: colors.text.primary }}>
                Platform Report Detail
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8125rem', color: colors.text.secondary }}>
              Comprehensive performance overview across organizers, events, and riders
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                backgroundColor: colors.surface.subtle,
                border: `1px solid ${colors.surface.border}`,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.text.primary,
                mb: 0.5,
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 13, color: colors.primary.main }} />
              Super Admin Audit
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text.muted, fontSize: '0.75rem' }}>
              <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />
              <span>Reporting Period: 2026 Cycling Season (Jan - Sep 2026)</span>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 1. Platform Summary Section */}
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: colors.text.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 2,
          }}
        >
          Platform Summary
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: colors.surface.subtle, border: `1px solid ${colors.surface.border}` }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Total Organizers
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: colors.text.primary, mt: 0.5 }}>
              24
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: colors.text.muted }}>19 Active</Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: colors.surface.subtle, border: `1px solid ${colors.surface.border}` }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Total Events
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: colors.text.primary, mt: 0.5 }}>
              86
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: colors.text.muted }}>Managed on RideTrack</Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#065F46', textTransform: 'uppercase' }}>
              Active Events
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#065F46', mt: 0.5 }}>
              7
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: '#065F46' }}>Currently active</Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#1E40AF', textTransform: 'uppercase' }}>
              Completed Events
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E40AF', mt: 0.5 }}>
              51
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: '#1E40AF' }}>Completed events</Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: colors.surface.subtle, border: `1px solid ${colors.surface.border}` }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.text.secondary, textTransform: 'uppercase' }}>
              Total Riders
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: colors.text.primary, mt: 0.5 }}>
              8,426
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: colors.text.muted }}>Registered riders</Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#166534', textTransform: 'uppercase' }}>
              Total Finished
            </Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534', mt: 0.5 }}>
              7,120
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: '#166534' }}>Verified finishers</Typography>
          </Box>
        </Box>

        {/* 2. Event Summary Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: colors.text.primary,
              mb: 1.5,
            }}
          >
            Event Summary
          </Typography>

          <Box sx={{ p: 2.5, borderRadius: '8px', backgroundColor: colors.surface.subtle, border: `1px solid ${colors.surface.border}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.text.primary }}>
                Event Distribution Across Lifecycle (51 Completed • 7 Live • 28 Published)
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: colors.primary.main }}>
                86 Total Events
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={85}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: '#E2E8F0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#0284C7',
                  borderRadius: 5,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, fontSize: '0.75rem', color: colors.text.muted }}>
              <span>Completed: 51</span>
              <span>Live: 7</span>
              <span>Published: 28</span>
            </Box>
          </Box>
        </Box>

        {/* 3. Organizer Summary Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: colors.text.primary,
              mb: 1.5,
            }}
          >
            Organizer Summary
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {MOCK_ORGANIZERS.slice(0, 3).map((org) => (
              <Box
                key={org.id}
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${colors.surface.border}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text.primary }}>
                    {org.name}
                  </Typography>
                  <RideBadge status={org.status === 'Active' ? 'active' : 'pending'} size="sm" />
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary, mb: 1 }}>
                  {org.organization}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.text.muted }}>
                  <span>{org.eventsCount} Events Organised</span>
                  <span>{org.totalRiders.toLocaleString()} Riders</span>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* 4. Rider Summary Section */}
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: colors.text.primary,
              mb: 1.5,
            }}
          >
            Rider Summary
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: colors.surface.subtle, border: `1px solid ${colors.surface.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.secondary }}>
                Registered Riders
              </Typography>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: colors.text.primary, mt: 0.5 }}>
                8,426
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: colors.text.muted }}>Across all platform events</Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#065F46' }}>
                Completed Finishers
              </Typography>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#065F46', mt: 0.5 }}>
                7,120
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#065F46' }}>84.5% completion rate</Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: colors.surface.subtle, border: `1px solid ${colors.surface.border}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text.secondary }}>
                Active Telemetry Scans
              </Typography>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: colors.text.primary, mt: 0.5 }}>
                48,910
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: colors.text.muted }}>Checkpoint records logged</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
      >
        <Alert severity="success" onClose={() => setToastMessage(null)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
