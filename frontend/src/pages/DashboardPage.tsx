import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { PageContainer } from '../components/layout/PageContainer';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { QuickActions } from '../components/dashboard/QuickActions';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActiveEventHighlight } from '../components/dashboard/ActiveEventHighlight';
import { EventSummaryCard } from '../components/dashboard/EventSummaryCard';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { DynamicQrWidget } from '../components/dashboard/DynamicQrWidget';
import { DashboardEvent, DashboardMetrics, ActivityItem } from '../components/dashboard/mockDashboardData';
import { eventService, EventItem } from '../api/services';

export interface DashboardPageProps {
  onNavigateCreateEvent?: () => void;
  onNavigateRegisterRider?: () => void;
  onNavigateScanner?: () => void;
  onNavigateReports?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateCreateEvent,
  onNavigateRegisterRider,
  onNavigateScanner,
  onNavigateReports,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    eventService.listEvents()
      .then((data) => {
        if (isMounted) {
          setEvents(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEvents([]);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const hasNoEvents = !loading && events.length === 0;

  // Real aggregate metrics derived from MongoDB event records
  const totalRiders = events.reduce((sum, e) => sum + (e.riderCount || 0), 0);
  const activeEventsCount = events.filter((e) => e.status === 'active').length;
  const upcomingEventsCount = events.filter((e) => e.status === 'upcoming').length;
  const completedEventsCount = events.filter((e) => e.status === 'completed').length;

  const realMetrics: DashboardMetrics = {
    totalRiders,
    totalRidersGrowth: totalRiders > 0 ? `${totalRiders} total registered` : 'No registered riders yet',
    activeEventsCount,
    upcomingEventsCount,
    completedEventsCount,
  };

  const activeEventItem = events.find((e) => e.status === 'active') || events[0];
  const activeEvent: DashboardEvent | null = activeEventItem ? {
    id: activeEventItem.id,
    name: activeEventItem.eventName,
    date: activeEventItem.rideDate,
    location: activeEventItem.location,
    status: activeEventItem.status === 'active' ? 'active' : activeEventItem.status === 'completed' ? 'completed' : 'upcoming',
    distanceKm: activeEventItem.rideDistance,
    riderCount: activeEventItem.riderCount || 0,
    checkpointCount: activeEventItem.checkpointCount || 0,
    tagline: activeEventItem.description || 'Course is configured',
  } : null;

  const dashboardEvents: DashboardEvent[] = events.map((e) => ({
    id: e.id,
    name: e.eventName,
    date: e.rideDate,
    location: e.location,
    status: e.status === 'active' ? 'active' : e.status === 'completed' ? 'completed' : 'upcoming',
    distanceKm: e.rideDistance,
    riderCount: e.riderCount || 0,
    checkpointCount: e.checkpointCount || 0,
    tagline: e.description || '',
  }));

  const realActivities: ActivityItem[] = events.slice(0, 5).map((e, idx) => ({
    id: `act-${e.id}-${idx}`,
    type: 'event_created',
    title: `Event created: ${e.eventName}`,
    context: `${e.location} (${e.rideDistance} km)`,
    timestamp: e.createdAt ? new Date(e.createdAt).toLocaleDateString() : 'Recently',
  }));

  return (
    <PageContainer>
      {/* 1. Dashboard Header */}
      <DashboardHeader />

      {/* 2. Dynamic QR Code System Widget */}
      <DynamicQrWidget />

      {/* 3. Empty State or Populated State */}
      {hasNoEvents ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <DashboardEmptyState
            onCreateEvent={onNavigateCreateEvent || (() => {})}
          />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Priority 1: Quick Actions */}
          <QuickActions
            onCreateEvent={onNavigateCreateEvent}
            onRegisterRider={onNavigateRegisterRider}
            onOpenScanner={onNavigateScanner}
            onNavigateReports={onNavigateReports}
          />


          {/* Priority 2: Prominent Total Riders & Overview Metrics */}
          <MetricCard metrics={realMetrics} />

          {/* Priority 3: Current Active Event Spotlight */}
          {activeEvent && (
            <ActiveEventHighlight
              event={activeEvent}
              onOpenScanner={onNavigateScanner || (() => {})}
            />
          )}

          {/* Priority 4: Event Categories Summary (Upcoming, Active, Completed) */}
          <EventSummaryCard events={dashboardEvents} />

          {/* Priority 5: Recent Activity Feed */}
          {realActivities.length > 0 && <RecentActivityList activities={realActivities} />}
        </Box>
      )}
    </PageContainer>
  );
};
