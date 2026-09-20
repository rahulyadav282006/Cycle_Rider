// RideTrack Event Details & Overview — Data Models

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

export const MOCK_KOLHAPUR_EVENT_DETAILS: EventOverviewData | null = null;
export const EMPTY_EVENT_DETAILS: EventOverviewData | null = null;
