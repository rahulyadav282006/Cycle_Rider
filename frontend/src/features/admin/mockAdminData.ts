// Mock Data for RideTrack Super Admin Module (UI-09)

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

// 1. Platform Dashboard Summary Statistics
// (Fictional mock data for UI/UX prototype testing only)
export const MOCK_ADMIN_DASHBOARD_STATS: PlatformStatItem[] = [
  {
    id: 'total-organizers',
    label: 'Total Organizers',
    value: 24,
    subtext: 'Active organizers',
  },
  {
    id: 'total-events',
    label: 'Total Events',
    value: 86,
    subtext: 'Events managed on RideTrack',
  },
  {
    id: 'active-events',
    label: 'Active Events',
    value: 7,
    subtext: 'Currently active events',
  },
  {
    id: 'total-riders',
    label: 'Total Riders',
    value: '8,426',
    subtext: 'Registered riders',
  },
];

// 2. Recent Platform Activity
export const MOCK_PLATFORM_ACTIVITY: PlatformActivityItem[] = [
  {
    id: 'act-001',
    type: 'organizer_registered',
    title: 'Organizer registered',
    description: 'Vikram Shinde registered new club account for Deccan Pedalers.',
    timestamp: '10 mins ago',
    actor: 'Vikram Shinde',
    badgeLabel: 'New Account',
    status: 'pending',
  },
  {
    id: 'act-002',
    type: 'event_created',
    title: 'Event created',
    description: 'Kolhapur Endurance Ride 200K was published and opened for check-in.',
    timestamp: '45 mins ago',
    actor: 'Organizer Admin',
    badgeLabel: 'Event Active',
    status: 'active',
  },
  {
    id: 'act-003',
    type: 'event_completed',
    title: 'Event completed',
    description: 'Western Ghats Brevet 300K finalized results with 215 verified finishers.',
    timestamp: '2 hours ago',
    actor: 'Amit Deshmukh',
    badgeLabel: 'Completed',
    status: 'completed',
  },
  {
    id: 'act-004',
    type: 'account_updated',
    title: 'Organizer account updated',
    description: 'Sneha Kulkarni updated emergency support contact profile and logo.',
    timestamp: '5 hours ago',
    actor: 'Sneha Kulkarni',
    badgeLabel: 'Profile',
    status: 'active',
  },
  {
    id: 'act-005',
    type: 'event_created',
    title: 'Event created',
    description: 'Pune Sahyadri 100 registration cap adjusted to 200 riders.',
    timestamp: '1 day ago',
    actor: 'Priya Joshi',
    badgeLabel: 'Event Update',
    status: 'draft',
  },
];

// 3. Event Overview (High Level)
export const MOCK_EVENT_OVERVIEW = {
  upcomingCount: 28,
  activeCount: 7,
  completedCount: 51,
  events: [
    {
      id: 'ev-active-01',
      name: 'Kolhapur Endurance Ride',
      organizer: 'Organizer Admin',
      date: '13 September 2026',
      location: 'Kolhapur',
      distance: '200 km',
      ridersCount: 342,
      status: 'active' as const,
    },
    {
      id: 'ev-active-02',
      name: 'Satara Ghat Circuit',
      organizer: 'Amit Deshmukh',
      date: '14 September 2026',
      location: 'Satara',
      distance: '150 km',
      ridersCount: 165,
      status: 'active' as const,
    },
    {
      id: 'ev-upcoming-01',
      name: 'Pune Sahyadri 100',
      organizer: 'Priya Joshi',
      date: '20 September 2026',
      location: 'Pune',
      distance: '100 km',
      ridersCount: 185,
      status: 'upcoming' as const,
    },
    {
      id: 'ev-completed-01',
      name: 'Western Ghats Brevet',
      organizer: 'Amit Deshmukh',
      date: '05 September 2026',
      location: 'Mahabaleshwar',
      distance: '300 km',
      ridersCount: 215,
      status: 'completed' as const,
    },
  ],
};

// 4. Mock Organizers Dataset
export const MOCK_ORGANIZERS: MockOrganizer[] = [
  {
    id: 'ORG-001',
    name: 'Organizer Admin',
    email: 'organizer@ridetrack.com',
    mobile: '+91 98220 12345',
    eventsCount: 12,
    activeEventsCount: 2,
    completedEventsCount: 9,
    totalRiders: 1840,
    status: 'Active',
    joinedDate: '12 Sep 2026',
    organization: 'RideTrack Maharashtra Operations',
    recentEvents: [
      {
        id: 'ev-01',
        name: 'Kolhapur Endurance Ride',
        date: '13 Sep 2026',
        location: 'Kolhapur',
        distance: '200 km',
        status: 'active',
      },
      {
        id: 'ev-02',
        name: 'Goa Coastal Challenge',
        date: '15 Aug 2026',
        location: 'Goa',
        distance: '200 km',
        status: 'completed',
      },
      {
        id: 'ev-03',
        name: 'Konkan Sunrise 150',
        date: '22 Jul 2026',
        location: 'Ratnagiri',
        distance: '150 km',
        status: 'completed',
      },
    ],
  },
  {
    id: 'ORG-002',
    name: 'Amit Deshmukh',
    email: 'amit.cycling@sahyadri.org',
    mobile: '+91 98221 54321',
    eventsCount: 8,
    activeEventsCount: 1,
    completedEventsCount: 6,
    totalRiders: 1120,
    status: 'Active',
    joinedDate: '10 Aug 2026',
    organization: 'Sahyadri Brevet Club',
    recentEvents: [
      {
        id: 'ev-04',
        name: 'Western Ghats Brevet',
        date: '05 Sep 2026',
        location: 'Mahabaleshwar',
        distance: '300 km',
        status: 'completed',
      },
      {
        id: 'ev-05',
        name: 'Satara Ghat Circuit',
        date: '14 Sep 2026',
        location: 'Satara',
        distance: '150 km',
        status: 'active',
      },
    ],
  },
  {
    id: 'ORG-003',
    name: 'Sneha Kulkarni',
    email: 'sneha@kolhapurriders.in',
    mobile: '+91 94220 98765',
    eventsCount: 5,
    activeEventsCount: 1,
    completedEventsCount: 4,
    totalRiders: 740,
    status: 'Active',
    joinedDate: '15 Jul 2026',
    organization: 'Kolhapur Randonneurs Association',
    recentEvents: [
      {
        id: 'ev-06',
        name: 'Panchgani Monsoon Climb',
        date: '28 Aug 2026',
        location: 'Panchgani',
        distance: '120 km',
        status: 'completed',
      },
    ],
  },
  {
    id: 'ORG-004',
    name: 'Vikram Shinde',
    email: 'vikram@deccanpedalers.com',
    mobile: '+91 98233 45678',
    eventsCount: 3,
    activeEventsCount: 0,
    completedEventsCount: 2,
    totalRiders: 320,
    status: 'Pending',
    joinedDate: '02 Sep 2026',
    organization: 'Deccan Pedalers',
    recentEvents: [
      {
        id: 'ev-07',
        name: 'Deccan Heritage Ride',
        date: '27 Sep 2026',
        location: 'Satara',
        distance: '150 km',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'ORG-005',
    name: 'Rajesh Gaikwad',
    email: 'r.gaikwad@maharashtrabrevets.org',
    mobile: '+91 94223 11223',
    eventsCount: 0,
    activeEventsCount: 0,
    completedEventsCount: 0,
    totalRiders: 0,
    status: 'Inactive',
    joinedDate: '18 Jun 2026',
    organization: 'Maharashtra Brevets Union',
    recentEvents: [],
  },
  {
    id: 'ORG-006',
    name: 'Priya Joshi',
    email: 'priya@puneendurance.com',
    mobile: '+91 98224 88776',
    eventsCount: 6,
    activeEventsCount: 1,
    completedEventsCount: 4,
    totalRiders: 890,
    status: 'Active',
    joinedDate: '22 May 2026',
    organization: 'Pune Endurance Cycling',
    recentEvents: [
      {
        id: 'ev-08',
        name: 'Pune Sahyadri 100',
        date: '20 Sep 2026',
        location: 'Pune',
        distance: '100 km',
        status: 'upcoming',
      },
    ],
  },
];

// Organizers Summary metrics
export const MOCK_ORGANIZERS_STATS: PlatformStatItem[] = [
  { id: 'org-tot', label: 'Total Organizers', value: 24, subtext: 'Active organizers' },
  { id: 'org-act', label: 'Active Organizers', value: 19, subtext: 'Currently active' },
  { id: 'org-pen', label: 'Pending Organizers', value: 3, subtext: 'Pending review' },
  { id: 'org-ina', label: 'Inactive Organizers', value: 2, subtext: 'Inactive accounts' },
];

// 5. All Events Dataset
// Follows RideTrack event lifecycle: Draft, Published, Live, Completed, Cancelled
export const MOCK_ADMIN_ALL_EVENTS: MockAdminEvent[] = [
  {
    id: 'ev-kolhapur-2026',
    name: 'Kolhapur Endurance Ride',
    organizer: 'Organizer Admin',
    organizerId: 'ORG-001',
    date: '13 September 2026',
    location: 'Kolhapur',
    distance: '200 km',
    riders: 342,
    status: 'Live',
  },
  {
    id: 'ev-pune-sahyadri-100',
    name: 'Pune Sahyadri 100',
    organizer: 'Priya Joshi',
    organizerId: 'ORG-006',
    date: '20 September 2026',
    location: 'Pune',
    distance: '100 km',
    riders: 185,
    status: 'Published',
  },
  {
    id: 'ev-deccan-heritage-150',
    name: 'Deccan Heritage Ride',
    organizer: 'Vikram Shinde',
    organizerId: 'ORG-004',
    date: '27 September 2026',
    location: 'Satara',
    distance: '150 km',
    riders: 140,
    status: 'Draft',
  },
  {
    id: 'ev-satara-circuit-150',
    name: 'Satara Ghat Circuit',
    organizer: 'Amit Deshmukh',
    organizerId: 'ORG-002',
    date: '14 September 2026',
    location: 'Satara',
    distance: '150 km',
    riders: 165,
    status: 'Live',
  },
  {
    id: 'ev-western-ghats-300',
    name: 'Western Ghats Brevet',
    organizer: 'Amit Deshmukh',
    organizerId: 'ORG-002',
    date: '05 September 2026',
    location: 'Mahabaleshwar',
    distance: '300 km',
    riders: 215,
    status: 'Completed',
  },
  {
    id: 'ev-panchgani-climb-120',
    name: 'Panchgani Monsoon Climb',
    organizer: 'Sneha Kulkarni',
    organizerId: 'ORG-003',
    date: '28 August 2026',
    location: 'Panchgani',
    distance: '120 km',
    riders: 160,
    status: 'Completed',
  },
  {
    id: 'ev-goa-coastal-200',
    name: 'Goa Coastal Challenge',
    organizer: 'Organizer Admin',
    organizerId: 'ORG-001',
    date: '15 August 2026',
    location: 'Goa',
    distance: '200 km',
    riders: 290,
    status: 'Cancelled',
  },
];

// All Events Summary metrics
export const MOCK_ADMIN_EVENTS_STATS: PlatformStatItem[] = [
  { id: 'ev-tot', label: 'Total Events', value: 86, subtext: 'Events managed on RideTrack' },
  { id: 'ev-pub', label: 'Published', value: 28, subtext: 'Open for registration' },
  { id: 'ev-live', label: 'Live Events', value: 7, subtext: 'Currently active events' },
  { id: 'ev-cmp', label: 'Completed', value: 51, subtext: 'Completed events' },
];

// 6. Default System Settings
export const DEFAULT_SYSTEM_SETTINGS: SystemSettingsData = {
  platformName: 'RideTrack',
  platformStatus: 'Operational',
  allowEventCreation: true,
  allowOrganizerRegistration: true,
  offlineScanning: true,
  automaticSync: true,
  platformNotifications: true,
};

// 7. Platform Reports Summary Metrics
export const MOCK_PLATFORM_REPORTS_STATS: PlatformStatItem[] = [
  { id: 'rep-org', label: 'Total Organizers', value: 24, subtext: 'Active organizers' },
  { id: 'rep-ev', label: 'Total Events', value: 86, subtext: 'Events managed on RideTrack' },
  { id: 'rep-rid', label: 'Total Riders', value: '8,426', subtext: 'Registered riders' },
  { id: 'rep-cmp', label: 'Completed Events', value: 51, subtext: 'Completed events' },
];

// Platform Report Cards
export interface PlatformReportCardDef {
  id: string;
  title: string;
  description: string;
  iconName: 'organizer' | 'event' | 'rider' | 'summary';
  targetState: string;
  frequency: string;
}

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

// Platform Recent Generated Reports
export const MOCK_ADMIN_RECENT_REPORTS: MockPlatformReportItem[] = [
  {
    id: 'rep-gen-001',
    name: 'Q3_Platform_Executive_Summary.pdf',
    generatedDate: '14 Sep 2026, 09:30 AM',
    generatedBy: 'Super Admin',
    format: 'PDF',
    size: '2.4 MB',
    reportType: 'Platform Summary',
  },
  {
    id: 'rep-gen-002',
    name: 'Maharashtra_Organizers_Roster.xlsx',
    generatedDate: '13 Sep 2026, 05:15 PM',
    generatedBy: 'Super Admin',
    format: 'Excel',
    size: '840 KB',
    reportType: 'Organizer Report',
  },
  {
    id: 'rep-gen-003',
    name: 'August_2026_All_Events_Telemetry.csv',
    generatedDate: '01 Sep 2026, 11:00 AM',
    generatedBy: 'Operations Bot',
    format: 'CSV',
    size: '4.1 MB',
    reportType: 'Event Report',
  },
  {
    id: 'rep-gen-004',
    name: 'Rider_HomeSafe_Compliance_2026.xlsx',
    generatedDate: '28 Aug 2026, 04:20 PM',
    generatedBy: 'Safety Officer',
    format: 'Excel',
    size: '1.2 MB',
    reportType: 'Rider Activity Report',
  },
];
