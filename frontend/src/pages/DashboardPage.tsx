import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { PageContainer } from '../components/layout/PageContainer';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { QuickActions } from '../components/dashboard/QuickActions';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActiveEventHighlight } from '../components/dashboard/ActiveEventHighlight';
import { EventSummaryCard } from '../components/dashboard/EventSummaryCard';
import { DashboardEvent, DashboardMetrics } from '../components/dashboard/mockDashboardData';
import { eventService, EventItem } from '../api/services';

export interface DashboardPageProps {
  onNavigateCreateEvent?: () => void;
  onNavigateRegisterRider?: () => void;
  onNavigateScanner?: () => void;
  onNavigateReports?: () => void;
  onNavigateEvents?: () => void;
  onSelectEvent?: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateCreateEvent,
  onNavigateRegisterRider,
  onNavigateScanner,
  onNavigateReports,
  onNavigateEvents,
  onSelectEvent,
}) => {
  const [, setLoading] = useState<boolean>(true);
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

  // Real aggregate metrics derived strictly from database
  const totalRiders = events.reduce((sum, e) => sum + (e.riderCount || 0), 0);
  const activeEventsCount = events.filter((e) => e.status === 'active').length;
  const upcomingEventsCount = events.filter((e) => e.status === 'upcoming').length;
  const completedEventsCount = events.filter((e) => e.status === 'completed').length;

  const realMetrics: DashboardMetrics = {
    totalRiders,
    totalRidersGrowth: totalRiders > 0 ? `${totalRiders} total registered` : 'No riders registered yet',
    activeEventsCount,
    upcomingEventsCount,
    completedEventsCount,
  };

  const activeEventItem = events.find((e) => e.status === 'active') || null;
  const activeEvent: DashboardEvent | null = activeEventItem ? {
    id: activeEventItem.id,
    name: activeEventItem.eventName,
    date: activeEventItem.rideDate,
    location: activeEventItem.location,
    status: 'active',
    distanceKm: activeEventItem.rideDistance,
    riderCount: activeEventItem.riderCount || 0,
    checkpointCount: activeEventItem.checkpointCount || 0,
    tagline: activeEventItem.description || 'Course is in progress',
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

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* 1. Hero Panoramic Scenic Landscape Banner */}
        <DashboardHeader />

        {/* 2. Quick Actions Card */}
        <QuickActions
          onCreateEvent={onNavigateCreateEvent}
          onRegisterRider={onNavigateRegisterRider}
          onOpenScanner={onNavigateScanner}
          onNavigateReports={onNavigateReports}
        />

        {/* 3. Four Overview Metric Cards */}
        <MetricCard
          metrics={realMetrics}
          onNavigateRiders={onNavigateRegisterRider}
          onNavigateEvents={onNavigateEvents}
        />

        {/* 4. Current Event Highlight Banner with Cyclist Mountain Silhouette */}
        <ActiveEventHighlight
          event={activeEvent}
          onOpenScanner={onNavigateScanner}
          onViewAllEvents={onNavigateEvents}
        />

        {/* 5. Three Event Category Cards (Upcoming, Active, Completed) */}
        <EventSummaryCard
          events={dashboardEvents}
          onCreateEvent={onNavigateCreateEvent}
          onViewEvents={onNavigateEvents}
          onViewReports={onNavigateReports}
          onSelectEvent={onSelectEvent}
        />
      </Box>
    </PageContainer>
  );
};
