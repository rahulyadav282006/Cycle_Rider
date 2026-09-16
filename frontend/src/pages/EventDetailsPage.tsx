import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { PageContainer } from '../components/layout/PageContainer';
import { EventOverviewHeader } from '../components/events/details/EventOverviewHeader';
import { EventSummaryCard } from '../components/events/details/EventSummaryCard';
import { EventMetricCards } from '../components/events/details/EventMetricCards';
import {
  EventManagementTabs,
  EventTabType,
} from '../components/events/details/EventManagementTabs';
import { EventInformationCard } from '../components/events/details/EventInformationCard';
import { CheckpointProgressCard } from '../components/events/details/CheckpointProgressCard';
import { RiderProgressCard } from '../components/events/details/RiderProgressCard';
import { VolunteerAssignmentCard } from '../components/events/details/VolunteerAssignmentCard';
import { RecentActivityCard } from '../components/events/details/RecentActivityCard';
import { EventDetailsEmptyState } from '../components/events/details/EventDetailsEmptyState';
import { ArchiveEventDialog } from '../components/events/details/ArchiveEventDialog';
import { colors } from '../theme/colors';
import { eventService, checkpointService, riderService, volunteerService } from '../api/services';

export interface EventDetailsPageProps {
  eventId?: string;
  onNavigateEditEvent: () => void;
  onNavigateCheckpoints: () => void;
  onNavigateRiders: () => void;
  onNavigateRegisterRider: () => void;
  onNavigateVolunteers: () => void;
  onNavigateLiveTracking?: () => void;
  onNavigateReports?: () => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  eventId,
  onNavigateEditEvent,
  onNavigateCheckpoints,
  onNavigateRiders,
  onNavigateRegisterRider,
  onNavigateVolunteers,
  onNavigateLiveTracking,
  onNavigateReports,
}) => {
  const [activeTab, setActiveTab] = useState<EventTabType>('overview');
  const [archiveDialogOpen, setArchiveDialogOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(eventId));

  const [eventData, setEventData] = useState<{
    id: string;
    name: string;
    status: 'upcoming' | 'active' | 'completed';
    date: string;
    location: string;
    distanceKm: number;
    startTime: string;
    organizer: string;
    description: string;
    metrics: {
      registeredRiders: number;
      startedRiders: number;
      finishedRiders: number;
      dnfRiders: number;
      homeSafeRiders: number;
    };
    checkpointsSummary: {
      total: number;
      mandatory: number;
      optional: number;
    };
    volunteersSummary: {
      assigned: number;
      totalNeeded: number;
    };
    recentActivities: any[];
  }>({
    id: '',
    name: '',
    status: 'upcoming',
    date: '',
    location: '',
    distanceKm: 0,
    startTime: '',
    organizer: '',
    description: '',
    metrics: {
      registeredRiders: 0,
      startedRiders: 0,
      finishedRiders: 0,
      dnfRiders: 0,
      homeSafeRiders: 0,
    },
    checkpointsSummary: {
      total: 0,
      mandatory: 0,
      optional: 0,
    },
    volunteersSummary: {
      assigned: 0,
      totalNeeded: 0,
    },
    recentActivities: [],
  });

  useEffect(() => {
    let isMounted = true;
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      eventService.getEvent(eventId).catch(() => null),
      checkpointService.listCheckpoints(eventId).catch(() => []),
      riderService.listRiders(eventId).catch(() => []),
      volunteerService.listVolunteers(eventId).catch(() => []),
    ])
      .then(([ev, checkpoints, riders, volunteers]) => {
        if (!isMounted) return;

        if (!ev) {
          setLoading(false);
          return;
        }

        const registeredCount = riders.length;
        const startedCount = riders.filter((r: any) => r.status === 'started' || r.status === 'finished').length;
        const finishedCount = riders.filter((r: any) => r.status === 'finished').length;
        const dnfCount = riders.filter((r: any) => r.status === 'dnf').length;
        const homeSafeCount = riders.filter((r: any) => r.status === 'home_safe' || r.status === 'finished').length;

        const totalCp = checkpoints.length;
        const mandatoryCp = checkpoints.filter((c: any) => c.isMandatory).length;
        const optionalCp = totalCp - mandatoryCp;

        const assignedVolunteers = volunteers.filter((v: any) => Boolean(v.checkpointId || v.assignedCheckpointId)).length;

        setEventData({
          id: ev.id,
          name: ev.eventName || 'Untitled Event',
          status: ev.status === 'active' ? 'active' : ev.status === 'completed' ? 'completed' : 'upcoming',
          date: ev.rideDate || '',
          location: ev.location || '',
          distanceKm: ev.rideDistance || 0,
          startTime: ev.startTime || '',
          organizer: ev.organizerName || 'Organizer Admin',
          description: ev.description || '',
          metrics: {
            registeredRiders: registeredCount,
            startedRiders: startedCount,
            finishedRiders: finishedCount,
            dnfRiders: dnfCount,
            homeSafeRiders: homeSafeCount,
          },
          checkpointsSummary: {
            total: totalCp,
            mandatory: mandatoryCp,
            optional: optionalCp,
          },
          volunteersSummary: {
            assigned: assignedVolunteers,
            totalNeeded: totalCp * 2,
          },
          recentActivities: [],
        });
      })
      .catch((err) => {
        console.error('Error fetching event overview data:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleTabChange = (tab: EventTabType) => {
    setActiveTab(tab);
    if (tab === 'checkpoints') {
      onNavigateCheckpoints();
    } else if (tab === 'riders') {
      onNavigateRiders();
    } else if (tab === 'volunteers') {
      onNavigateVolunteers();
    } else if (tab === 'live_tracking' && onNavigateLiveTracking) {
      onNavigateLiveTracking();
    } else if (tab === 'reports' && onNavigateReports) {
      onNavigateReports();
    }
  };

  const handleConfirmArchive = async () => {
    setArchiveDialogOpen(false);
    if (eventId) {
      try {
        await eventService.updateEvent(eventId, { status: 'completed' });
        setEventData((prev) => ({ ...prev, status: 'completed' }));
        setToastMessage(`Event "${eventData.name}" has been marked as archived.`);
      } catch {
        setToastMessage('Failed to update event archive status.');
      }
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ p: 4, textAlign: 'center', color: colors.text.secondary }}>
          Loading event details...
        </Box>
      </PageContainer>
    );
  }

  // If no event found or no event selected, show empty state
  const isEmptyState = !eventData.id || (eventData.checkpointsSummary.total === 0 && eventData.metrics.registeredRiders === 0);

  return (
    <PageContainer>
      {/* 1. Header with breadcrumb, action buttons, & More Actions menu */}
      <EventOverviewHeader
        eventName={eventData.name || 'Event Details'}
        onEditEvent={onNavigateEditEvent}
        onOpenArchiveDialog={() => setArchiveDialogOpen(true)}
      />

      {/* 2. Large Event Summary Card */}
      <EventSummaryCard
        eventName={eventData.name}
        status={eventData.status}
        date={eventData.date}
        location={eventData.location}
        distanceKm={eventData.distanceKm}
        startTime={eventData.startTime}
        organizer={eventData.organizer}
        description={eventData.description}
      />

      {/* 3. Event Summary Metrics */}
      <EventMetricCards
        registeredRiders={eventData.metrics.registeredRiders}
        startedRiders={eventData.metrics.startedRiders}
        finishedRiders={eventData.metrics.finishedRiders}
        homeSafeRiders={eventData.metrics.homeSafeRiders}
      />

      {/* 4. Event Management Navigation Tabs */}
      <EventManagementTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* 5. Overview Content / Empty State */}
      {isEmptyState ? (
        <EventDetailsEmptyState
          onConfigureCheckpoints={onNavigateCheckpoints}
          onRegisterRider={onNavigateRegisterRider}
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Row 1: Event Information & Checkpoint Progress */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
            <EventInformationCard
              eventName={eventData.name}
              location={eventData.location}
              distanceKm={eventData.distanceKm}
              date={eventData.date}
              startTime={eventData.startTime}
              organizer={eventData.organizer}
              status={eventData.status}
            />

            <CheckpointProgressCard
              total={eventData.checkpointsSummary.total}
              mandatory={eventData.checkpointsSummary.mandatory}
              optional={eventData.checkpointsSummary.optional}
              onManageCheckpoints={onNavigateCheckpoints}
            />
          </Box>

          {/* Row 2: Rider Progress & Volunteer Assignment */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 3 }}>
            <RiderProgressCard
              registered={eventData.metrics.registeredRiders}
              started={eventData.metrics.startedRiders}
              finished={eventData.metrics.finishedRiders}
              dnf={eventData.metrics.dnfRiders}
              homeSafe={eventData.metrics.homeSafeRiders}
            />

            <VolunteerAssignmentCard
              assigned={eventData.volunteersSummary.assigned}
              totalNeeded={eventData.volunteersSummary.totalNeeded}
              onManageVolunteers={onNavigateVolunteers}
            />
          </Box>

          {/* Row 3: Recent Activity */}
          <RecentActivityCard activities={eventData.recentActivities} />
        </Box>
      )}

      {/* Archive Event Dialog */}
      <ArchiveEventDialog
        open={archiveDialogOpen}
        eventName={eventData.name}
        onClose={() => setArchiveDialogOpen(false)}
        onConfirmArchive={handleConfirmArchive}
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
            backgroundColor: colors.surface.card,
            color: colors.text.primary,
            border: `1px solid ${colors.surface.borderStrong}`,
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
