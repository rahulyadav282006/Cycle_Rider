import React, { useState, useEffect, useMemo } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { PageContainer } from '../../../components/layout/PageContainer';
import {
  LiveTrackingHeader,
} from './LiveTrackingHeader';
import { LiveTrackingSummary } from './LiveTrackingSummary';
import { CheckpointProgress } from './CheckpointProgress';
import { RecentScanActivity } from './RecentScanActivity';
import { LiveTrackingFilters } from './LiveTrackingFilters';
import { RiderStatusTable } from './RiderStatusTable';
import { RiderDetailsDrawer } from './RiderDetailsDrawer';
import { LiveTrackingEmptyState } from './LiveTrackingEmptyState';
import { LiveTrackingConnectionWarning } from './LiveTrackingConnectionWarning';
import {
  LiveRiderItem,
  LiveTrackingMetrics,
  LiveCheckpointProgressItem,
  RecentScanItem,
} from './mockLiveTrackingData';
import { CheckpointRouteTimeline } from '../../../components/routes/CheckpointRouteTimeline';
import { liveTrackingService, eventService, checkpointService, CheckpointItem } from '../../../api/services';

export interface LiveTrackingPageProps {
  eventId?: string;
  onBackToEvent?: () => void;
}

const EMPTY_METRICS: LiveTrackingMetrics = {
  registered: 0,
  started: 0,
  atCheckpoints: 0,
  finished: 0,
  dnf: 0,
  homeSafe: 0,
};

export const LiveTrackingPage: React.FC<LiveTrackingPageProps> = ({
  eventId,
  onBackToEvent,
}) => {
  // Dynamic Telemetry Data from API
  const [metrics, setMetrics] = useState<LiveTrackingMetrics>(EMPTY_METRICS);
  const [checkpointsList, setCheckpointsList] = useState<LiveCheckpointProgressItem[]>([]);
  const [recentScansList, setRecentScansList] = useState<RecentScanItem[]>([]);
  const [ridersList, setRidersList] = useState<LiveRiderItem[]>([]);
  const [eventInfo, setEventInfo] = useState<{ name: string; date: string; location: string; distanceKm: number } | null>(null);
  const [startLocation, setStartLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [finishLocation, setFinishLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [rawCheckpoints, setRawCheckpoints] = useState<CheckpointItem[]>([]);
  const [, setLoading] = useState<boolean>(Boolean(eventId));
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [liveRefreshTick, setLiveRefreshTick] = useState<number>(0);

  // Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Selected Rider Drawer
  const [selectedRider, setSelectedRider] = useState<LiveRiderItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const refreshTimer = window.setInterval(() => {
      setLiveRefreshTick((tick) => tick + 1);
    }, 5000);

    return () => window.clearInterval(refreshTimer);
  }, [eventId]);

  // Fetch real telemetry and event details from backend
  useEffect(() => {
    let isMounted = true;
    if (!eventId) {
      setMetrics(EMPTY_METRICS);
      setCheckpointsList([]);
      setRecentScansList([]);
      setRidersList([]);
      setEventInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      eventService.getEvent(eventId).catch(() => null),
      checkpointService.listCheckpoints(eventId).catch(() => []),
    ])
      .then(([ev, cps]) => {
        if (isMounted && ev) {
          setEventInfo({
            name: ev.eventName || '',
            date: ev.rideDate || '',
            location: ev.location || '',
            distanceKm: ev.rideDistance || 0,
          });
          if (ev.startLocation) setStartLocation(ev.startLocation);
          if (ev.finishLocation) setFinishLocation(ev.finishLocation);
        }
        if (isMounted && Array.isArray(cps)) {
          setRawCheckpoints(cps);
        }
      })
      .catch(() => {});

    liveTrackingService
      .getLiveTracking(eventId)
      .then((data) => {
        if (!isMounted || !data) return;
        setMetrics({
          registered: data.registeredRiders || 0,
          started: data.startedRiders || 0,
          atCheckpoints: Math.max(
            0,
            (data.startedRiders || 0) - (data.finishedRiders || 0) - (data.dnfRiders || 0)
          ),
          finished: data.finishedRiders || 0,
          dnf: data.dnfRiders || 0,
          homeSafe: data.homeSafeRiders || 0,
        });

        if (data.checkpointProgress && data.checkpointProgress.length > 0) {
          setCheckpointsList(
            data.checkpointProgress.map((cp: any, idx: number) => ({
              sequence: cp.sequenceNumber || idx + 1,
              name: cp.name,
              type: 'Checkpoint',
              requirement: cp.mandatory || cp.isMandatory ? 'Mandatory' : 'Optional',
              scannedCount: cp.scannedCount || 0,
              totalRiders: data.registeredRiders || 0,
              percentage:
                data.registeredRiders > 0
                  ? Math.round(((cp.scannedCount || 0) / data.registeredRiders) * 100)
                  : 0,
              status: (cp.scannedCount || 0) > 0 ? 'Active' : 'Upcoming',
            }))
          );
        } else {
          setCheckpointsList([]);
        }

        if (data.recentScans && data.recentScans.length > 0) {
          setRecentScansList(
            data.recentScans.map((s: any) => ({
              id: s.id,
              riderName: s.riderName,
              riderId: s.riderId,
              checkpoint: s.checkpointName,
              time: s.scanTime
                ? new Date(s.scanTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '',
              status: 'Verified',
            }))
          );
        } else {
          setRecentScansList([]);
        }

        if (data.ridersStatusList && data.ridersStatusList.length > 0) {
          setRidersList(
            data.ridersStatusList.map((r: any) => ({
              id: r.id || r.riderId,
              riderId: r.riderId,
              name: r.name,
              currentCheckpoint: r.lastCheckpoint || 'Mahavir Garden (Start)',
              lastScanTime: r.lastScanTime
                ? new Date(r.lastScanTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '06:02 AM',
              status: (r.status === 'Completed' || r.status === 'finished'
                ? 'Finished'
                : r.status === 'In-Transit' || r.status === 'started'
                ? 'At Checkpoint'
                : r.status === 'DNF' || r.status === 'dnf'
                ? 'DNF'
                : r.status === 'Home Safe' || r.status === 'home_safe'
                ? 'Home Safe'
                : 'Not Started') as any,
              bibNumber: r.jerseyNumber || '',
              timeline: [],
            }))
          );
        } else {
          setRidersList([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load live tracking telemetry:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId, liveRefreshTick]);

  // Checkpoint filter options
  const checkpointOptions = useMemo(() => {
    return [
      { id: 'all', name: 'All Checkpoints' },
      ...checkpointsList.map((cp) => ({
        id: `cp-${cp.sequence}`,
        name: `CP ${String(cp.sequence).padStart(2, '0')} — ${cp.name}`,
      })),
    ];
  }, [checkpointsList]);

  // Filtered riders
  const filteredRiders = useMemo(() => {
    return ridersList.filter((rider) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = rider.name.toLowerCase().includes(q);
        const matchesId = rider.riderId.toLowerCase().includes(q);
        const matchesBib = Boolean(rider.bibNumber && rider.bibNumber.toLowerCase().includes(q));
        if (!matchesName && !matchesId && !matchesBib) return false;
      }

      if (selectedStatus !== 'all' && rider.status !== selectedStatus) {
        return false;
      }

      if (selectedCheckpoint !== 'all') {
        const matchedCp = checkpointOptions.find((o) => o.id === selectedCheckpoint);
        if (matchedCp && !rider.currentCheckpoint.includes(matchedCp.name.split('—')[1]?.trim() || '')) {
          return false;
        }
      }

      return true;
    });
  }, [ridersList, searchQuery, selectedStatus, selectedCheckpoint, checkpointOptions]);

  const handleSelectRider = (rider: LiveRiderItem) => {
    setSelectedRider(rider);
  };

  const handleCloseDrawer = () => {
    setSelectedRider(null);
  };

  const isEmpty = metrics.registered === 0 && checkpointsList.length === 0;

  return (
    <PageContainer maxWidth="lg">
      {/* 1. Page Header with Breadcrumbs, Live Status Pill & Refresh Time */}
      <LiveTrackingHeader
        onBackToEvent={onBackToEvent}
        eventName={eventInfo?.name}
        eventDate={eventInfo?.date}
        location={eventInfo?.location}
        distanceKm={eventInfo?.distanceKm}
        lastUpdatedText="Just now"
      />

      {/* 2. Connection Warning (if offline) */}
      {isOffline && (
        <Box sx={{ mb: 3 }}>
          <LiveTrackingConnectionWarning />
        </Box>
      )}

      {/* 3. Empty State or Populated Live Operations Console */}
      {isEmpty ? (
        <LiveTrackingEmptyState />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Section 1: KPI Metrics Bar */}
          <LiveTrackingSummary metrics={metrics} />

          {/* Section 2: Split 2-Column Row (Checkpoints Progress & Recent Scans) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            <CheckpointProgress checkpoints={checkpointsList} />
            <RecentScanActivity scans={recentScansList} />
          </Box>

          {/* Section 2.5: Rider Route Timeline */}
          <CheckpointRouteTimeline
            readOnly={true}
            startLocation={startLocation}
            finishLocation={finishLocation}
            checkpoints={rawCheckpoints}
            title={`${eventInfo?.name || 'Rider Route'} — Checkpoint Route Timeline`}
            subtitle="Official ordered checkpoints from START to FINISH"
          />

          {/* Section 3: Rider Status Table with Filter Toolbar */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <LiveTrackingFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              checkpointFilter={selectedCheckpoint}
              onCheckpointFilterChange={setSelectedCheckpoint}
              statusFilter={selectedStatus}
              onStatusFilterChange={setSelectedStatus}
            />

            <RiderStatusTable
              riders={filteredRiders}
              onViewRider={handleSelectRider}
            />
          </Box>
        </Box>
      )}

      {/* Rider Details Slide-over Drawer */}
      <RiderDetailsDrawer
        open={Boolean(selectedRider)}
        onClose={handleCloseDrawer}
        rider={selectedRider}
        eventName={eventInfo?.name}
      />

      {/* Toast feedback */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="info"
          sx={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};
