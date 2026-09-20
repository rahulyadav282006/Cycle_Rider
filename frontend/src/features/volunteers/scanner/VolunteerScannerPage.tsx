import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined';
import { VolunteerShell } from '../VolunteerShell';
import { PageHeroBanner } from '../../../components/common/PageHeroBanner';
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
} from './ScannerTypes';

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
    name: '',
    riderId: '',
    jerseyNumber: '',
    checkpoint: '',
    event: '',
    scanTime: '',
  });

  // Load volunteer assignment & initial pending scans count
  useEffect(() => {
    getPendingScans()
      .then((scans) => setPendingSyncCount(scans.length))
      .catch(() => { });

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
      .catch(() => { });
  }, []);

  const getDevicePosition = (): Promise<{ lat?: number; lng?: number }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser.');
        resolve({});
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.warn('Location capture failed:', {
            code: err.code,
            message: err.message,
          });
          // If the user denied permission, we still resolve empty so the scan can proceed
          resolve({});
        },
        { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
      );
    });
  };

  // Sync listener on reconnect
  // Automatic sync on reconnect or startup
  const syncOfflineScans = async () => {
    try {
      await flushPendingScans(async (scan) => {
        await scanService.recordScan({
          clientScanId: scan.clientScanId,
          riderId: scan.riderId,
          eventId: scan.eventId,
          checkpointId: scan.checkpointId,
          scanTime: scan.scanTime,
          deviceLatitude: scan.deviceLatitude,
          deviceLongitude: scan.deviceLongitude,
        });
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
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [scannerState]);

  // Step 1: Handle genuine QR scan detected by camera (Validation)
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

    const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // If offline, populate detected rider and prompt volunteer confirmation
    if (isOffline || !navigator.onLine) {
      setDetectedRider({
        name: `Rider ${cleanId}`,
        riderId: cleanId,
        jerseyNumber: '#---',
        checkpoint: assignmentInfo.context.checkpointName,
        event: assignmentInfo.context.event,
        scanTime: nowFormatted,
      });
      setScannerState('detected');
      return;
    }

    // Online verification: validate rider, event, volunteer assignment, and duplicate check
    try {
      const res = await scanService.validateScan({
        riderId: cleanId,
        eventId: assignmentInfo.eventId,
        checkpointId: assignmentInfo.checkpointId,
      });

      setDetectedRider({
        name: res.riderName,
        riderId: res.riderId,
        jerseyNumber: res.jerseyNumber
          ? res.jerseyNumber.startsWith('#')
            ? res.jerseyNumber
            : `#${res.jerseyNumber}`
          : '#101',
        checkpoint: res.checkpointName || assignmentInfo.context.checkpointName,
        event: res.eventName || assignmentInfo.context.event,
        scanTime: new Date(res.scanTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setScannerState('detected');
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
        // Network drop during validation: gracefully queue for offline confirmation
        setDetectedRider({
          name: `Rider ${cleanId}`,
          riderId: cleanId,
          jerseyNumber: '#---',
          checkpoint: assignmentInfo.context.checkpointName,
          event: assignmentInfo.context.event,
          scanTime: nowFormatted,
        });
        setScannerState('detected');
      }
    }
  };

  // Step 2: Volunteer confirms arrival (Save to MongoDB or IndexedDB)
  const handleConfirmArrival = async () => {
    const clientScanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const scanTimeIso = new Date().toISOString();
    const coords = await getDevicePosition();

    if (isOffline || !navigator.onLine) {
      const offlinePayload = {
        clientScanId,
        riderId: detectedRider.riderId,
        eventId: assignmentInfo.eventId || 'ev-default',
        checkpointId: assignmentInfo.checkpointId || 'cp-default',
        scannedAt: scanTimeIso,
        scanTime: scanTimeIso,
        status: 'pending',
        riderName: detectedRider.name,
        jerseyNumber: detectedRider.jerseyNumber,
        deviceLatitude: coords.lat,
        deviceLongitude: coords.lng,
      };
      await saveOfflineScan(offlinePayload);
      const remaining = await getPendingScans();
      setPendingSyncCount(remaining.length);
      setScannerState('success');
      return;
    }

    try {
      const res = await scanService.recordScan({
        clientScanId,
        riderId: detectedRider.riderId,
        eventId: assignmentInfo.eventId,
        checkpointId: assignmentInfo.checkpointId,
        scanTime: scanTimeIso,
        deviceLatitude: coords.lat,
        deviceLongitude: coords.lng,
      });

      setDetectedRider((prev) => ({
        ...prev,
        name: res.riderName || prev.name,
        riderId: res.riderId || prev.riderId,
        scanTime: new Date(res.scanTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setScannerState('success');
    } catch (err: any) {
      const errCode = err?.code || err?.error?.code || '';
      const errMsg = String(err?.message || err?.error?.message || '');
      const status = err?.status || err?.response?.status;

      if (errCode === 'DUPLICATE_SCAN' || status === 409 || errMsg.toLowerCase().includes('already')) {
        setScannerState('duplicate');
      } else if (errCode === 'WRONG_EVENT' || errMsg.toLowerCase().includes('different event')) {
        setScannerState('invalid');
      } else if (errCode === 'FORBIDDEN' || status === 403) {
        setScannerState('wrong-checkpoint');
      } else {
        // Network drop during submit: queue in IndexedDB
        const offlinePayload = {
          clientScanId,
          riderId: detectedRider.riderId,
          eventId: assignmentInfo.eventId || 'ev-default',
          checkpointId: assignmentInfo.checkpointId || 'cp-default',
          scannedAt: scanTimeIso,
          scanTime: scanTimeIso,
          status: 'pending',
          riderName: detectedRider.name,
          jerseyNumber: detectedRider.jerseyNumber,
          deviceLatitude: coords.lat,
          deviceLongitude: coords.lng,
        };
        await saveOfflineScan(offlinePayload);
        const remaining = await getPendingScans();
        setPendingSyncCount(remaining.length);
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
        {/* Panoramic Scenic Hero Banner */}
        <PageHeroBanner
          title="Scan Rider QR"
          subtitle="Scan rider QR code to confirm arrival."
        />

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
              onConfirm={handleConfirmArrival}
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
