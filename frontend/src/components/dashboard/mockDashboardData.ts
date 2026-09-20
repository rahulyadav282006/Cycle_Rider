// RideTrack Organizer Dashboard — Data Models and Initial Empty State

export type EventStatus = 'upcoming' | 'active' | 'completed';

export interface DashboardEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
  distanceKm: number;
  riderCount: number;
  checkpointCount: number;
  tagline?: string;
}

export interface ActivityItem {
  id: string;
  type: 'rider_registered' | 'checkpoint_configured' | 'volunteer_assigned' | 'scan_recorded' | 'event_created';
  title: string;
  context: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalRiders: number;
  totalRidersGrowth: string;
  activeEventsCount: number;
  upcomingEventsCount: number;
  completedEventsCount: number;
}

export const MOCK_METRICS: DashboardMetrics = {
  totalRiders: 0,
  totalRidersGrowth: 'No registered riders yet',
  activeEventsCount: 0,
  upcomingEventsCount: 0,
  completedEventsCount: 0,
};

export const MOCK_ACTIVE_EVENT: DashboardEvent | null = null;
export const MOCK_UPCOMING_EVENT: DashboardEvent | null = null;
export const MOCK_COMPLETED_EVENT: DashboardEvent | null = null;
export const MOCK_EVENTS: DashboardEvent[] = [];
export const MOCK_ACTIVITIES: ActivityItem[] = [];
