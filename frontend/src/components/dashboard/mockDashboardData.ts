// RideTrack Organizer Dashboard — Mock Data Models and Datasets
// Structure mirrors future API payloads without backend dependencies

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
  totalRiders: 1248,
  totalRidersGrowth: '+84 this month',
  activeEventsCount: 1,
  upcomingEventsCount: 1,
  completedEventsCount: 1,
};

export const MOCK_ACTIVE_EVENT: DashboardEvent = {
  id: 'ev-kolhapur-2026',
  name: 'Kolhapur Endurance Ride',
  date: '13 September 2026',
  location: 'Kolhapur',
  status: 'active',
  distanceKm: 200,
  riderCount: 342,
  checkpointCount: 4,
  tagline: 'Course is live — 4 checkpoints currently operating',
};

export const MOCK_UPCOMING_EVENT: DashboardEvent = {
  id: 'ev-lakeside-2026',
  name: 'Lakeside 100K Ride',
  date: '15 October 2026',
  location: 'Lakeside Highway',
  status: 'upcoming',
  distanceKm: 100,
  riderCount: 580,
  checkpointCount: 3,
  tagline: 'Registration open — Bib allocation in progress',
};

export const MOCK_COMPLETED_EVENT: DashboardEvent = {
  id: 'ev-community-2026',
  name: 'Community Century Ride',
  date: '05 September 2026',
  location: 'City Circuit',
  status: 'completed',
  distanceKm: 160,
  riderCount: 326,
  checkpointCount: 4,
  tagline: 'Event finished — 326 verified finishers',
};

export const MOCK_EVENTS: DashboardEvent[] = [
  MOCK_ACTIVE_EVENT,
  MOCK_UPCOMING_EVENT,
  MOCK_COMPLETED_EVENT,
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'rider_registered',
    title: 'Rider Rahul Patil registered',
    context: 'Lakeside 100K Ride',
    timestamp: '10 minutes ago',
  },
  {
    id: 'act-2',
    type: 'checkpoint_configured',
    title: 'Checkpoint CP1 configured',
    context: 'Kolhapur Endurance Ride',
    timestamp: '32 minutes ago',
  },
  {
    id: 'act-3',
    type: 'volunteer_assigned',
    title: 'Volunteer assigned to Breakfast checkpoint',
    context: 'Kolhapur Endurance Ride',
    timestamp: '1 hour ago',
  },
  {
    id: 'act-4',
    type: 'scan_recorded',
    title: 'Rider scan recorded at CP2',
    context: 'Kolhapur Endurance Ride',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-5',
    type: 'event_created',
    title: 'Event created: Lakeside 100K Ride',
    context: 'Published by Organizer Admin',
    timestamp: 'Yesterday',
  },
];
