import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined';
import { colors } from '../../../theme/colors';
import { VolunteerShell } from '../VolunteerShell';
import { ScannerContextBar } from './ScannerContextBar';
import { ScannerViewport } from './ScannerViewport';
import { ScannerInfoIndicators } from './ScannerInfoIndicators';
import { RiderDetectedCard } from './RiderDetectedCard';
import { ScanSuccessState } from './ScanSuccessState';
import { ScanValidationStates } from './ScanValidationStates';
import {
  ScannerState,
  DetectedRider,
  ScannerCheckpointContext,
} from './ScannerMockData';

import { scanService, volunteerService } from '../../../api/services';
import { saveOfflineScan, getPendingScans, flushPendingScans } from '../../../utils/offlineQueue';

export interface VolunteerScannerPageProps {
  onNavigateHome: () => void;
}

export const VolunteerScannerPage: React.FC<VolunteerScannerPageProps> = ({
  onNavigateHome,
}) => {
  const [scannerState, setScannerState] = useState<ScannerState>('ready');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const [assignmentInfo, setAssignmentInfo] = useState<{
    eventId: string;
    checkpointId: string;
    context: ScannerCheckpointContext;
  }>({
    eventId: '',
    checkpointId: '',
    context: {
      checkpointCode: 'CP --',
      checkpointName: 'Scanner Station',
      checkpointType: 'Checkpoint',
      event: 'Cycling Event',
      status: 'Ready',
      pendingSyncCount: 0,
    },
  });

  const [detectedRider, setDetectedRider] = useState<DetectedRider>({
    name: 'Detected Rider',
    riderId: 'RT-0001',
    jerseyNumber: '#101',
    checkpoint: 'Checkpoint',
    event: 'Cycling Event',
    scanTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  // Load volunteer assignment & initial pending scans count
  useEffect(() => {
    getPendingScans()
      .then((scans) => setPendingSyncCount(scans.length))
      .catch(() => {});

    volunteerService
      .getMyAssignment()
      .then((res) => {
        if (res && res.assignment) {
          const cpCode = res.checkpoint?.sequenceNumber
            ? `CP ${String(res.checkpoint.sequenceNumber).padStart(2, '0')}`
            : 'CP 01';
          const cpName = res.checkpoint?.name || 'Assigned Station';
          const cpType = res.checkpoint?.type || 'Checkpoint';
          const evName = res.event?.eventName || 'Cycling Event';

          setAssignmentInfo({
            eventId: res.event?.id || '',
            checkpointId: res.checkpoint?.id || '',
            context: {
              checkpointCode: cpCode,
              checkpointName: cpName,
              checkpointType: cpType,
              event: evName,
              status: 'Assigned / Ready',
              pendingSyncCount: 0,
            },
          });

          setDetectedRider((prev) => ({
            ...prev,
            checkpoint: `${cpCode} — ${cpName}`,
            event: evName,
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Sync listener on reconnect
  // Automatic sync on reconnect or startup
  const syncOfflineScans = async () => {
    try {
      await flushPendingScans(async (scan) => {
        await scanService.recordScan(scan);
      });
      const remaining = await getPendingScans();
      setPendingSyncCount(remaining.length);
    } catch (err) {
      console.warn('Sync pending scans failed:', err);
    }
  };

  // Sync listener on reconnect & initial mount
  useEffect(() => {
    const handleOnline = async () => {
      setIsOffline(false);
      await syncOfflineScans();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // If online on mount, attempt sync
    if (navigator.onLine) {
      syncOfflineScans();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-reset from success back to ready to scan next rider
  useEffect(() => {
    if (scannerState === 'success') {
      const timer = setTimeout(() => {
        setScannerState('ready');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scannerState]);

  // Handle genuine QR scan detected by camera
  const handleRealScan = async (rawCode: string) => {
    let cleanId = rawCode.trim();
    if (cleanId.includes('/')) {
      const segments = cleanId.split('/');
      cleanId = segments[segments.length - 1] || cleanId;
    }
    if (cleanId.includes('?')) {
      cleanId = cleanId.split('?')[0];
    }
    cleanId = cleanId.trim().toUpperCase();

    if (!cleanId || cleanId.length < 2) {
      setScannerState('invalid');
      return;
    }

    const clientScanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const scanTimeIso = new Date().toISOString();

    // Check offline mode
    if (isOffline || !navigator.onLine) {
      const offlinePayload = {
        clientScanId,
        riderId: cleanId,
        eventId: assignmentInfo.eventId || 'ev-default',
        checkpointId: assignmentInfo.checkpointId || 'cp-default',
        scanTime: scanTimeIso,
        riderName: `Rider ${cleanId}`,
        jerseyNumber: '101',
      };
      await saveOfflineScan(offlinePayload);
      const remaining = await getPendingScans();
      setPendingSyncCount(remaining.length);
      setDetectedRider({
        name: `Rider ${cleanId}`,
        riderId: cleanId,
        jerseyNumber: '#---',
        checkpoint: assignmentInfo.context.checkpointName,
        event: assignmentInfo.context.event,
        scanTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setScannerState('success');
      return;
    }

    // Online scan execution
    try {
      const res = await scanService.recordScan({
        clientScanId,
        riderId: cleanId,
        eventId: assignmentInfo.eventId,
        checkpointId: assignmentInfo.checkpointId,
        scanTime: scanTimeIso,
      });

      setDetectedRider({
        name: res.riderName || `Rider ${cleanId}`,
        riderId: res.riderId || cleanId,
        jerseyNumber: res.jerseyNumber
          ? res.jerseyNumber.startsWith('#')
            ? res.jerseyNumber
            : `#${res.jerseyNumber}`
          : '#101',
        checkpoint: res.checkpointName || assignmentInfo.context.checkpointName,
        event: res.eventName || assignmentInfo.context.event,
        scanTime: new Date(res.scanTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setScannerState('success');
    } catch (err: any) {
      const errCode = err?.code || err?.error?.code || '';
      const errMsg = String(err?.message || err?.error?.message || '');
      const status = err?.status || err?.response?.status;

      if (errCode === 'DUPLICATE_SCAN' || status === 409 || errMsg.toLowerCase().includes('already')) {
        setDetectedRider((prev) => ({
          ...prev,
          riderId: cleanId,
          name: err?.data?.riderName || prev.name,
          checkpoint: assignmentInfo.context.checkpointName,
          scanTime: err?.data?.scanTime
            ? new Date(err.data.scanTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : prev.scanTime,
        }));
        setScannerState('duplicate');
      } else if (errCode === 'WRONG_EVENT' || errMsg.toLowerCase().includes('different event')) {
        setScannerState('invalid');
      } else if (errCode === 'FORBIDDEN' || status === 403) {
        setScannerState('wrong-checkpoint');
      } else if (errCode === 'RIDER_NOT_FOUND' || status === 404) {
        setScannerState('invalid');
      } else {
        // Network disruption: queue in IndexedDB
        const offlinePayload = {
          clientScanId,
          riderId: cleanId,
          eventId: assignmentInfo.eventId || 'ev-default',
          checkpointId: assignmentInfo.checkpointId || 'cp-default',
          scanTime: scanTimeIso,
          riderName: `Rider ${cleanId}`,
          jerseyNumber: '101',
        };
        await saveOfflineScan(offlinePayload);
        const remaining = await getPendingScans();
        setPendingSyncCount(remaining.length);
        setDetectedRider({
          name: `Rider ${cleanId}`,
          riderId: cleanId,
          jerseyNumber: '#---',
          checkpoint: assignmentInfo.context.checkpointName,
          event: assignmentInfo.context.event,
          scanTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setScannerState('success');
      }
    }
  };

  const handleScanAgain = () => {
    setScannerState('ready');
  };


  return (
    <VolunteerShell
      activeNavId="scanner"
      onNavigate={(id) => {
        if (id === 'home') onNavigateHome();
      }}
    >
      <Box sx={{ maxWidth: 840, mx: 'auto', width: '100%', pb: 4 }}>
        {/* Breadcrumb & Page Title Header */}
        <Box sx={{ mb: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: colors.text.muted,
              fontSize: '0.75rem',
              mb: 0.5,
            }}
          >
            <Typography component="span" sx={{ fontSize: '0.75rem', color: colors.text.muted }}>
              RideTrack
            </Typography>
            <NavigateNextIcon sx={{ fontSize: 13, color: colors.text.muted }} />
            <Typography
              component="span"
              sx={{ fontSize: '0.75rem', color: colors.text.muted, cursor: 'pointer' }}
              onClick={onNavigateHome}
            >
              Volunteer Home
            </Typography>
            <NavigateNextIcon sx={{ fontSize: 13, color: colors.text.muted }} />
            <Typography component="span" sx={{ fontSize: '0.75rem', color: colors.text.primary, fontWeight: 700 }}>
              Scanner
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            QR Scanner
          </Typography>

          <Typography
            sx={{
              fontSize: '0.875rem',
              color: colors.text.secondary,
              lineHeight: 1.4,
            }}
          >
            Scan rider QR codes to record checkpoint arrivals.
          </Typography>
        </Box>

        {/* Checkpoint Context Bar */}
        <ScannerContextBar
          context={{ ...assignmentInfo.context, pendingSyncCount }}
          isOffline={isOffline}
          onNavigateHome={onNavigateHome}
        />

        {/* Offline Alert Banner (when offline mode is active) */}
        {isOffline && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: '8px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CloudOffOutlinedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: '#92400E' }}>
                    Offline Mode
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      px: 0.8,
                      py: 0.15,
                      borderRadius: '4px',
                      backgroundColor: '#FDE68A',
                      color: '#78350F',
                    }}
                  >
                    Active
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.8125rem', color: '#B45309', mt: 0.25 }}>
                  Scans are stored safely in local browser storage and will automatically synchronize once an internet connection is re-established.
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>
              Offline — Scans Saved Locally
            </Typography>
          </Box>
        )}

        {/* Dynamic Center Work Area based on State */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%',
          }}
        >
          {/* State 1: Ready to Scan (Live Camera Viewfinder) */}
          {scannerState === 'ready' && (
            <>
              <ScannerViewport onScan={handleRealScan} isScanning={scannerState === 'ready'} />
              <ScannerInfoIndicators />
            </>
          )}

          {/* State 2: Rider Detected */}
          {scannerState === 'detected' && (
            <RiderDetectedCard
              rider={detectedRider}
              onConfirm={() => handleRealScan(detectedRider.riderId)}
              onCancel={handleScanAgain}
            />
          )}

          {/* State 3: Scan Recorded (Success) */}
          {scannerState === 'success' && (
            <ScanSuccessState
              rider={detectedRider}
              onScanNext={handleScanAgain}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* State 4: Duplicate Scan Warning */}
          {scannerState === 'duplicate' && (
            <ScanValidationStates
              type="duplicate"
              rider={detectedRider}
              onScanAgain={handleScanAgain}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* State 5: Invalid QR Error */}
          {scannerState === 'invalid' && (
            <ScanValidationStates
              type="invalid"
              onScanAgain={handleScanAgain}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* State 6: Wrong Checkpoint Error */}
          {scannerState === 'wrong-checkpoint' && (
            <ScanValidationStates
              type="wrong-checkpoint"
              currentCheckpoint={assignmentInfo.context.checkpointName}
              onScanAgain={handleScanAgain}
              onNavigateHome={onNavigateHome}
            />
          )}
        </Box>
      </Box>
    </VolunteerShell>
  );
};
