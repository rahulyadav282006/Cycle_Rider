// RideTrack Event Details & Overview — Mock Data Models and Datasets

export interface EventOverviewData {
  id: string;
  name: string;
  status: 'active' | 'upcoming' | 'completed' | 'draft';
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
    homeSafeRiders: number;
    dnfRiders: number;
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
  recentActivities: RecentActivityItem[];
}

export interface RecentActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'rider_registered' | 'checkpoint_configured' | 'volunteer_assigned' | 'rider_scanned';
}

export const MOCK_KOLHAPUR_EVENT_DETAILS: EventOverviewData = {
  id: 'ev-kolhapur-2026',
  name: 'Kolhapur Endurance Ride',
  status: 'active',
  date: '13 September 2026',
  location: 'Kolhapur',
  distanceKm: 200,
  startTime: '06:00 AM',
  organizer: 'Organizer Admin',
  description: 'A 200 km endurance cycling ride through the Kolhapur region.',
  metrics: {
    registeredRiders: 342,
    startedRiders: 320,
    finishedRiders: 286,
    homeSafeRiders: 270,
    dnfRiders: 14,
  },
  checkpointsSummary: {
    total: 10,
    mandatory: 7,
    optional: 3,
  },
  volunteersSummary: {
    assigned: 8,
    totalNeeded: 10,
  },
  recentActivities: [
    {
      id: 'act-1',
      title: 'Rider Rahul Patil registered',
      timestamp: '12 mins ago',
      type: 'rider_registered',
    },
    {
      id: 'act-2',
      title: 'Checkpoint CP1 configured',
      timestamp: '45 mins ago',
      type: 'checkpoint_configured',
    },
    {
      id: 'act-3',
      title: 'Volunteer assigned to Lunch',
      timestamp: '1 hour ago',
      type: 'volunteer_assigned',
    },
    {
      id: 'act-4',
      title: 'Rider scan recorded at CP2',
      timestamp: '2 hours ago',
      type: 'rider_scanned',
    },
  ],
};

export const EMPTY_EVENT_DETAILS: EventOverviewData = {
  id: 'ev-new-empty-2026',
  name: 'New Cycling Event',
  status: 'draft',
  date: '20 October 2026',
  location: 'Pune',
  distanceKm: 100,
  startTime: '06:30 AM',
  organizer: 'Organizer Admin',
  description: 'A newly created event with no checkpoints or riders configured yet.',
  metrics: {
    registeredRiders: 0,
    startedRiders: 0,
    finishedRiders: 0,
    homeSafeRiders: 0,
    dnfRiders: 0,
  },
  checkpointsSummary: {
    total: 0,
    mandatory: 0,
    optional: 0,
  },
  volunteersSummary: {
    assigned: 0,
    totalNeeded: 6,
  },
  recentActivities: [],
};
