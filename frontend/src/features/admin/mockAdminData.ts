// RideTrack Super Admin Module Data Models and Empty Default State

export interface PlatformStatItem {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtext?: string;
}

export interface PlatformActivityItem {
  id: string;
  type: 'organizer_registered' | 'event_created' | 'event_completed' | 'account_updated' | 'system_alert';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  badgeLabel: string;
  status: 'active' | 'completed' | 'pending' | 'draft';
}

export interface AdminEventOverviewItem {
  id: string;
  name: string;
  organizer: string;
  date: string;
  location: string;
  distance: string;
  ridersCount: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface MockOrganizer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  eventsCount: number;
  activeEventsCount: number;
  completedEventsCount: number;
  totalRiders: number;
  status: 'Active' | 'Pending' | 'Inactive';
  joinedDate: string;
  organization?: string;
  recentEvents: {
    id: string;
    name: string;
    date: string;
    location: string;
    distance: string;
    status: 'upcoming' | 'active' | 'completed';
  }[];
}

export interface MockAdminEvent {
  id: string;
  name: string;
  organizer: string;
  organizerId: string;
  date: string;
  location: string;
  distance: string;
  riders: number;
  status: 'Draft' | 'Published' | 'Live' | 'Completed' | 'Cancelled';
}

export interface MockPlatformReportItem {
  id: string;
  name: string;
  generatedDate: string;
  generatedBy: string;
  format: 'CSV' | 'Excel' | 'PDF';
  size: string;
  reportType: string;
}

export interface SystemSettingsData {
  platformName: string;
  platformStatus: 'Operational' | 'Degraded' | 'Maintenance';
  allowEventCreation: boolean;
  allowOrganizerRegistration: boolean;
  offlineScanning: boolean;
  automaticSync: boolean;
  platformNotifications: boolean;
}

export interface PlatformReportCardDef {
  id: string;
  title: string;
  description: string;
  iconName: 'organizer' | 'event' | 'rider' | 'summary';
  targetState: string;
  frequency: string;
}

// 1. Platform Dashboard Summary Statistics
export const MOCK_ADMIN_DASHBOARD_STATS: PlatformStatItem[] = [
  {
    id: 'total-organizers',
    label: 'Total Organizers',
    value: 0,
    subtext: 'Registered organizers',
  },
  {
    id: 'total-events',
    label: 'Total Events',
    value: 0,
    subtext: 'Events managed on RideTrack',
  },
  {
    id: 'active-events',
    label: 'Active Events',
    value: 0,
    subtext: 'Currently active events',
  },
  {
    id: 'total-riders',
    label: 'Total Riders',
    value: 0,
    subtext: 'Registered riders',
  },
];

// 2. Recent Platform Activity
export const MOCK_PLATFORM_ACTIVITY: PlatformActivityItem[] = [];

// 3. Event Operations Overview
export const MOCK_EVENT_OVERVIEW = {
  activeCount: 0,
  upcomingCount: 0,
  completedCount: 0,
  events: [] as AdminEventOverviewItem[],
};

// 4. Platform Organizers
export const MOCK_ORGANIZERS: MockOrganizer[] = [];

export const MOCK_ORGANIZERS_STATS: PlatformStatItem[] = [
  { id: 'stat-total-orgs', label: 'Total Organizers', value: 0, subtext: 'Registered clubs' },
  { id: 'stat-active-orgs', label: 'Active Organizers', value: 0, subtext: 'Organized rides in last 90d' },
  { id: 'stat-pending-orgs', label: 'Pending Verification', value: 0, subtext: 'Awaiting admin review' },
  { id: 'stat-total-events', label: 'Platform Events', value: 0, subtext: 'Organized through platform' },
];

export const MOCK_ADMIN_ALL_EVENTS: MockAdminEvent[] = [];

export const MOCK_ADMIN_EVENTS_STATS: PlatformStatItem[] = [
  { id: 'stat-events-all', label: 'Total Events', value: 0, subtext: 'Created on platform' },
  { id: 'stat-events-live', label: 'Live Events', value: 0, subtext: 'Currently in progress' },
  { id: 'stat-events-upcoming', label: 'Upcoming Events', value: 0, subtext: 'Scheduled next 60 days' },
  { id: 'stat-events-riders', label: 'Total Registrations', value: 0, subtext: 'Riders participating' },
];

export const MOCK_PLATFORM_REPORTS_STATS: PlatformStatItem[] = [
  { id: 'rep-stat-1', label: 'Total Reports Generated', value: 0, subtext: 'Historical exports' },
  { id: 'rep-stat-2', label: 'Data Export Volume', value: '0 MB', subtext: 'CSV, Excel, and PDF' },
  { id: 'rep-stat-3', label: 'Events Audited', value: 0, subtext: 'Completed post-ride audits' },
  { id: 'rep-stat-4', label: 'Compliance Score', value: '100%', subtext: 'Safety check confirmation' },
];

export const MOCK_PLATFORM_REPORT_CARDS: PlatformReportCardDef[] = [
  {
    id: 'organizer-report',
    title: 'Organizer Report',
    description: 'Complete breakdown of organizer accounts, host clubs, KYC status, and event distribution.',
    iconName: 'organizer',
    targetState: 'organizers',
    frequency: 'Monthly Audit',
  },
  {
    id: 'event-report',
    title: 'Event Report',
    description: 'Comprehensive historical event performance, course completion rates, and safety records.',
    iconName: 'event',
    targetState: 'events',
    frequency: 'Quarterly',
  },
  {
    id: 'rider-activity-report',
    title: 'Rider Activity Report',
    description: 'Participation frequency, total kilometers ridden, average speeds, and Home Safe confirmation audit.',
    iconName: 'rider',
    targetState: 'reports-detail',
    frequency: 'Weekly Telemetry',
  },
  {
    id: 'platform-summary',
    title: 'Platform Summary',
    description: 'Executive overview of entire platform health, operational uptime, checkpoint scans, and staffing.',
    iconName: 'summary',
    targetState: 'reports-detail',
    frequency: 'Real-time Executive',
  },
];

export const MOCK_ADMIN_RECENT_REPORTS: MockPlatformReportItem[] = [];

export const MOCK_SYSTEM_SETTINGS: SystemSettingsData = {
  platformName: 'RideTrack Endurance Management Platform',
  platformStatus: 'Operational',
  allowEventCreation: true,
  allowOrganizerRegistration: true,
  offlineScanning: true,
  automaticSync: true,
  platformNotifications: true,
};
