import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { PageContainer } from '../../components/layout/PageContainer';
import { colors } from '../../theme/colors';
import { RideBadge } from '../../components/ui/RideBadge';
import {
  ReportsHeader,
  ReportsPrototypeState,
} from './ReportsHeader';
import { ReportTypeCard } from './ReportTypeCard';
import { ReportEmptyState } from './ReportEmptyState';
import { ReportExportDialog, ExportDialogState } from './ReportExportDialog';
import { RiderListReport } from './RiderListReport';
import { CheckpointSummaryReport } from './CheckpointSummaryReport';
import { FinishersReport } from './FinishersReport';
import { DnfReport } from './DnfReport';
import { HomeSafeReport } from './HomeSafeReport';
import { EventSummaryReport } from './EventSummaryReport';
import {
  REPORT_TYPES_CONFIG,
  ReportTypeKey,
} from './mockReportsData';
import { eventService } from '../../api/services';

export interface ReportsPageProps {
  eventId?: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ eventId }) => {
  const [activeState, setActiveState] = useState<ReportsPrototypeState>('dashboard');
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(eventId || '');
  const [loading, setLoading] = useState<boolean>(true);

  // Export Dialog State
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [exportDialogInitialState, setExportDialogInitialState] = useState<ExportDialogState>('default');
  const [targetExportReport, setTargetExportReport] = useState<string>('Rider List Report');

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load real events from API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    eventService
      .listEvents()
      .then((events) => {
        if (!isMounted) return;
        const mapped = events.map((e) => ({
          id: e.id,
          name: e.eventName,
          status: e.status === 'active' ? 'Active' : e.status === 'completed' ? 'Completed' : 'Upcoming',
          date: e.rideDate,
          location: e.location,
          distanceKm: e.rideDistance,
          riderCount: e.riderCount || 0,
        }));
        setEventsList(mapped);

        if (eventId && mapped.some((e) => e.id === eventId)) {
          setSelectedEventId(eventId);
        } else if (mapped.length > 0) {
          setSelectedEventId(mapped[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load events in ReportsPage:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // Read URL sub-route if provided
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/reports/rider-list') setActiveState('rider_list');
    else if (path === '/reports/checkpoints') setActiveState('checkpoint_summary');
    else if (path === '/reports/finishers') setActiveState('finishers');
    else if (path === '/reports/dnf') setActiveState('dnf');
    else if (path === '/reports/home-safe') setActiveState('home_safe');
    else if (path === '/reports/event-summary') setActiveState('event_summary');
  }, []);

  const currentEvent = useMemo(() => {
    return (
      eventsList.find((e) => e.id === selectedEventId) ||
      eventsList[0] || {
        id: '',
        name: 'No Events',
        status: 'Upcoming',
        date: '',
        location: '',
        distanceKm: 0,
        riderCount: 0,
      }
    );
  }, [eventsList, selectedEventId]);

  const handleStateChange = (state: ReportsPrototypeState) => {
    setActiveState(state);
    if (state === 'export_dialog') {
      setTargetExportReport('Rider List Report');
      setExportDialogInitialState('default');
      setExportDialogOpen(true);
    } else {
      setExportDialogOpen(false);
    }

    const urlMap: Record<ReportsPrototypeState, string> = {
      dashboard: '/reports',
      rider_list: '/reports/rider-list',
      checkpoint_summary: '/reports/checkpoints',
      finishers: '/reports/finishers',
      dnf: '/reports/dnf',
      home_safe: '/reports/home-safe',
      event_summary: '/reports/event-summary',
      empty_state: '/reports',
      export_dialog: '/reports',
    };
    if (urlMap[state]) {
      window.history.pushState(null, '', urlMap[state]);
    }
  };

  const handleViewReportType = (key: ReportTypeKey) => {
    handleStateChange(key as ReportsPrototypeState);
  };

  const handleTriggerExport = (reportName: string) => {
    setTargetExportReport(reportName);
    setExportDialogInitialState('default');
    setExportDialogOpen(true);
  };

  const getBreadcrumbSubtitle = () => {
    switch (activeState) {
      case 'rider_list':
        return 'Rider List';
      case 'checkpoint_summary':
        return 'Checkpoint Summary';
      case 'finishers':
        return 'Finishers';
      case 'dnf':
        return 'DNF Riders';
      case 'home_safe':
        return 'Home Safe Confirmation';
      case 'event_summary':
        return 'Event Summary';
      default:
        return undefined;
    }
  };

  const handleEventChange = (eventName: string) => {
    const ev = eventsList.find((e) => e.name === eventName);
    if (ev) setSelectedEventId(ev.id);
  };

  if (!loading && eventsList.length === 0) {
    return (
      <PageContainer>
        <ReportsHeader
          selectedEvent=""
          events={[]}
          onEventChange={() => {}}
          onOpenExportDialog={() => {}}
          onBackToDashboard={() => handleStateChange('dashboard')}
        />
        <ReportEmptyState onGenerateReport={() => {}} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* 1. Global Reports Header with Breadcrumbs & Actions */}
      <ReportsHeader
        selectedEvent={currentEvent.name}
        events={eventsList}
        onEventChange={handleEventChange}
        onOpenExportDialog={() => handleTriggerExport('Event Executive Report')}
        currentBreadcrumbSub={getBreadcrumbSubtitle()}
        onBackToDashboard={() => handleStateChange('dashboard')}
      />

      {/* 2. Main Content based on active state */}
      {activeState === 'rider_list' ? (
        <RiderListReport
          eventId={currentEvent.id}
          onBackToReports={() => handleStateChange('dashboard')}
          onExport={(fmt) => handleTriggerExport(`Rider List (${fmt})`)}
        />
      ) : activeState === 'checkpoint_summary' ? (
        <CheckpointSummaryReport
          eventId={currentEvent.id}
          onBackToReports={() => handleStateChange('dashboard')}
          onExport={(fmt) => handleTriggerExport(`Checkpoint Summary (${fmt})`)}
        />
      ) : activeState === 'finishers' ? (
        <FinishersReport
          eventId={currentEvent.id}
          onBackToReports={() => handleStateChange('dashboard')}
          onExport={(fmt) => handleTriggerExport(`Finishers Report (${fmt})`)}
        />
      ) : activeState === 'dnf' ? (
        <DnfReport
          eventId={currentEvent.id}
          onBackToReports={() => handleStateChange('dashboard')}
          onExport={(fmt) => handleTriggerExport(`DNF Riders Report (${fmt})`)}
        />
      ) : activeState === 'home_safe' ? (
        <HomeSafeReport
          eventId={currentEvent.id}
          onBackToReports={() => handleStateChange('dashboard')}
          onExport={(fmt) => handleTriggerExport(`Home Safe Confirmation (${fmt})`)}
        />
      ) : activeState === 'event_summary' ? (
        <EventSummaryReport
          eventId={currentEvent.id}
          onBackToReports={() => handleStateChange('dashboard')}
          onExport={(fmt) => handleTriggerExport(`Event Summary Report (${fmt})`)}
        />
      ) : (
        /* SCREEN 1: Reports Dashboard / Index */
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* 1. Event Selection Card */}
          <Box
            sx={{
              backgroundColor: colors.surface.card,
              border: `1px solid ${colors.surface.border}`,
              borderRadius: '8px',
              p: { xs: 2.25, sm: 2.5 },
              mb: 4,
              boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Active Reporting Event
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.125rem', sm: '1.25rem' },
                    fontWeight: 800,
                    color: colors.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  {currentEvent.name}
                </Typography>
                <RideBadge
                  status={currentEvent.status === 'Active' ? 'active' : 'upcoming'}
                  label={currentEvent.status}
                  size="sm"
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
                fontSize: '0.8125rem',
                color: colors.text.secondary,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                <span>{currentEvent.date || 'Date not set'}</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <PlaceOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                <span>{currentEvent.location || 'Location not set'}</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <StraightenOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                <span>{currentEvent.distanceKm} km</span>
              </Box>
            </Box>
          </Box>

          {/* 2. Grid of 6 Pre-built Report Types */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1rem',
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: '-0.01em',
                mb: 2,
              }}
            >
              Available Report Types
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gap: 2.5,
              }}
            >
              {REPORT_TYPES_CONFIG.map((config) => (
                <ReportTypeCard
                  key={config.key}
                  report={config}
                  onView={() => handleViewReportType(config.key)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Export Report Modal Dialog */}
      <ReportExportDialog
        open={exportDialogOpen}
        onClose={() => {
          setExportDialogOpen(false);
          if (activeState === 'export_dialog') setActiveState('dashboard');
        }}
        eventId={currentEvent.id}
        reportName={targetExportReport}
        eventName={currentEvent.name}
        initialState={exportDialogInitialState}
      />

      {/* Toast Feedback */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="success"
          sx={{ width: '100%', borderRadius: '6px', fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};
