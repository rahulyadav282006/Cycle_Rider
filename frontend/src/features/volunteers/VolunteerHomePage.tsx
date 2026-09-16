import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { VolunteerShell } from './VolunteerShell';
import { VolunteerHomeHeader } from './VolunteerHomeHeader';
import { VolunteerOfflineStatus } from './VolunteerOfflineStatus';
import { AssignmentCard } from './AssignmentCard';
import { CheckpointAssignmentCard } from './CheckpointAssignmentCard';
import { CheckpointInformationCard } from './CheckpointInformationCard';
import { CheckpointProgress } from './CheckpointProgress';
import { CheckpointActivityCard } from './CheckpointActivityCard';
import { NoCheckpointAssignedState } from './NoCheckpointAssignedState';
import { ScannerNoticeModal } from './ScannerNoticeModal';
import { volunteerService } from '../../api/services';

export interface VolunteerHomePageProps {
  onNavigateScanner?: () => void;
  onLogout?: () => void;
}

export const VolunteerHomePage: React.FC<VolunteerHomePageProps> = ({
  onNavigateScanner,
  onLogout,
}) => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [loading, setLoading] = useState<boolean>(true);
  const [assignmentData, setAssignmentData] = useState<{
    checkpoint: any;
    assignment: any;
    event: any;
  } | null>(null);

  // Scanner modal state
  const [isScannerModalOpen, setIsScannerModalOpen] = useState<boolean>(false);

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

  const loadAssignment = () => {
    setLoading(true);
    volunteerService
      .getMyAssignment()
      .then((res) => {
        if (res && res.assignment && res.checkpoint) {
          setAssignmentData({
            checkpoint: {
              id: res.checkpoint.id,
              number: String(res.checkpoint.sequenceNumber || 1).padStart(2, '0'),
              name: res.checkpoint.name,
              type: res.checkpoint.type || 'Checkpoint',
              distance: `${(res.checkpoint as any).distanceFromStartKm || 0} km`,
              status: 'Open',
              cutoffTime: '18:00',
              notes: 'Checkpoint operational',
              emergencyLead: 'Safety Lead',
              emergencyPhone: res.assignment.mobile || '108',
              partnerVolunteers: [],
              networkStatus: isOffline ? 'Offline' : 'Online',
            },
            assignment: {
              volunteerName: res.assignment.name,
              role: (res.assignment as any).role || 'Timekeeper & Scanner',
              eventName: res.event?.eventName || 'Cycling Event',
              eventDate: res.event?.rideDate || new Date().toLocaleDateString(),
              reportingTime: '06:00 AM',
              status: 'Confirmed',
            },
            event: res.event,
          });
        } else {
          setAssignmentData(null);
        }
      })
      .catch(() => {
        setAssignmentData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAssignment();
  }, [isOffline]);

  const handleOpenScanner = () => {
    if (onNavigateScanner) {
      onNavigateScanner();
    } else {
      setIsScannerModalOpen(true);
    }
  };

  return (
    <VolunteerShell
      activeNavId="home"
      onLogout={onLogout}
      onNavigate={(id) => {
        if (id === 'scanner') handleOpenScanner();
      }}
      onOpenScannerNotice={handleOpenScanner}
    >
      <Box sx={{ maxWidth: 1240, mx: 'auto', width: '100%', pb: 4 }}>
        {/* 1. Page Header with Title & Breadcrumbs */}
        <VolunteerHomeHeader
          currentState={!assignmentData ? 'no-assignment' : isOffline ? 'offline' : 'assigned'}
        />

        {/* 2. Offline Status Banner */}
        <Box sx={{ mb: 3 }}>
          <VolunteerOfflineStatus
            isOffline={isOffline}
            onToggleOffline={() => setIsOffline((prev) => !prev)}
          />
        </Box>

        {/* 3. Main Viewport: Either No Assignment State OR Full Checkpoint Workspace */}
        {!loading && !assignmentData ? (
          <NoCheckpointAssignedState onRefresh={loadAssignment} />
        ) : assignmentData ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
              gap: { xs: 2.5, sm: 3 },
              alignItems: 'start',
            }}
          >
            {/* Left Column: Primary Scanning & Checkpoint Focus */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
              <CheckpointAssignmentCard
                checkpoint={assignmentData.checkpoint}
                onOpenScanner={handleOpenScanner}
              />

              <CheckpointInformationCard checkpoint={assignmentData.checkpoint} />

              <AssignmentCard assignment={assignmentData.assignment} />
            </Box>

            {/* Right Column: Real-time Checkpoint Activity & Event Progress */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
              <CheckpointActivityCard
                activity={{
                  ridersExpected: assignmentData.event?.riderCount || 0,
                  scannedHere: 0,
                  remaining: assignmentData.event?.riderCount || 0,
                  lastScan: {
                    riderName: 'None yet',
                    time: '--:--',
                    riderId: '',
                  },
                }}
              />

              <CheckpointProgress stages={[]} />
            </Box>
          </Box>
        ) : null}

        {/* 4. Scanner Modal */}
        <ScannerNoticeModal
          open={isScannerModalOpen}
          onClose={() => setIsScannerModalOpen(false)}
          checkpointName={
            assignmentData?.checkpoint
              ? `${assignmentData.checkpoint.number} ${assignmentData.checkpoint.name}`
              : 'Checkpoint'
          }
        />
      </Box>
    </VolunteerShell>
  );
};
