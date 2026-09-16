// RideTrack Reports Module — Mock Data Models and Datasets

export type ReportTypeKey =
  | 'rider_list'
  | 'checkpoint_summary'
  | 'finishers'
  | 'dnf'
  | 'home_safe'
  | 'event_summary';

export interface ReportTypeItem {
  key: ReportTypeKey;
  title: string;
  description: string;
  iconType: string;
  badge?: string;
}

export interface RecentReportItem {
  id: string;
  name: string;
  event: string;
  generatedDate: string;
  format: 'PDF' | 'CSV' | 'Excel';
  fileSize: string;
}

export interface ReportRiderItem {
  id: string;
  riderId: string;
  name: string;
  mobile: string;
  jerseyNumber: string;
  event: string;
  bicycleType: string;
  status: 'Registered' | 'Active' | 'Finished' | 'DNF' | 'Home Safe';
}

export interface ReportCheckpointItem {
  sequence: number;
  name: string;
  type: string;
  required: 'Mandatory' | 'Optional';
  scanned: number;
  completionRate: string;
  status: 'Completed' | 'Active' | 'Upcoming';
}

export interface ReportFinisherItem {
  id: string;
  riderId: string;
  riderName: string;
  jerseyNumber: string;
  finishCheckpoint: string;
  finishTime: string;
  totalRideTime: string;
  status: 'Finished';
}

export interface ReportDnfItem {
  id: string;
  riderId: string;
  riderName: string;
  jerseyNumber: string;
  lastCheckpoint: string;
  lastScan: string;
  status: 'DNF';
}

export interface ReportHomeSafeItem {
  id: string;
  riderId: string;
  riderName: string;
  jerseyNumber: string;
  lastCheckpoint: string;
  homeSafeTime: string;
  status: 'Confirmed' | 'Pending';
}

export interface EventReportMetadata {
  name: string;
  date: string;
  location: string;
  distanceKm: number;
  startTime: string;
  organizer: string;
  status: 'Active' | 'Draft' | 'Completed';
  summaryMetrics: {
    totalRiders: number;
    started: number;
    active: number;
    finished: number;
    dnf: number;
    homeSafe: number;
    pendingHomeSafe: number;
    volunteerCoverage: string;
  };
}

export const MOCK_REPORT_EVENT: EventReportMetadata = {
  name: 'Kolhapur Endurance Ride',
  date: '13 September 2026',
  location: 'Kolhapur',
  distanceKm: 200,
  startTime: '06:00 AM',
  organizer: 'Organizer Admin',
  status: 'Active',
  summaryMetrics: {
    totalRiders: 342,
    started: 320,
    active: 52,
    finished: 286,
    dnf: 14,
    homeSafe: 270,
    pendingHomeSafe: 72,
    volunteerCoverage: '8 / 10',
  },
};

export const REPORT_TYPES_CONFIG: ReportTypeItem[] = [
  {
    key: 'rider_list',
    title: 'Rider List',
    description: 'Complete roster of registered riders, jersey numbers, bicycle types, and active statuses.',
    iconType: 'riders',
    badge: '342 Riders',
  },
  {
    key: 'checkpoint_summary',
    title: 'Checkpoint Summary',
    description: 'Passing statistics, timing breakdowns, and completion percentage for all 10 route checkpoints.',
    iconType: 'checkpoints',
    badge: '10 Checkpoints',
  },
  {
    key: 'finishers',
    title: 'Finishers',
    description: 'Official finishing times, total ride duration, and category rankings for course completers.',
    iconType: 'finishers',
    badge: '286 Finished',
  },
  {
    key: 'dnf',
    title: 'DNF Riders',
    description: 'Riders who did not finish the route, with last scanned checkpoint stations and timestamps.',
    iconType: 'dnf',
    badge: '14 DNF',
  },
  {
    key: 'home_safe',
    title: 'Home Safe Confirmation',
    description: 'End-of-event safety check tracking return confirmations and pending safety verifications.',
    iconType: 'home_safe',
    badge: '270 Confirmed',
  },
  {
    key: 'event_summary',
    title: 'Event Summary',
    description: 'Executive overview covering participant statistics, station coverage, and overall operations.',
    iconType: 'event_summary',
    badge: 'Comprehensive',
  },
];

export const MOCK_RECENT_REPORTS: RecentReportItem[] = [
  {
    id: 'rep-01',
    name: 'Official Finishers List',
    event: 'Kolhapur Endurance Ride',
    generatedDate: '13 Sep 2026, 11:45 AM',
    format: 'Excel',
    fileSize: '342 KB',
  },
  {
    id: 'rep-02',
    name: 'Checkpoint Passing Summary',
    event: 'Kolhapur Endurance Ride',
    generatedDate: '13 Sep 2026, 11:15 AM',
    format: 'CSV',
    fileSize: '128 KB',
  },
  {
    id: 'rep-03',
    name: 'Rider Registration & Attendance Roster',
    event: 'Kolhapur Endurance Ride',
    generatedDate: '13 Sep 2026, 10:50 AM',
    format: 'PDF',
    fileSize: '1.2 MB',
  },
  {
    id: 'rep-04',
    name: 'Home Safe Safety Audit',
    event: 'Kolhapur Endurance Ride',
    generatedDate: '13 Sep 2026, 10:30 AM',
    format: 'PDF',
    fileSize: '890 KB',
  },
  {
    id: 'rep-05',
    name: 'DNF & Incident Register',
    event: 'Kolhapur Endurance Ride',
    generatedDate: '13 Sep 2026, 10:00 AM',
    format: 'CSV',
    fileSize: '64 KB',
  },
];

export const MOCK_REPORT_RIDERS: ReportRiderItem[] = [
  {
    id: 'rr-01',
    riderId: 'RT-0001',
    name: 'Rahul Patil',
    mobile: '98765 43210',
    jerseyNumber: '#101',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Registered',
  },
  {
    id: 'rr-02',
    riderId: 'RT-0002',
    name: 'Amit Sharma',
    mobile: '98765 43211',
    jerseyNumber: '#102',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Gravel Bike',
    status: 'Active',
  },
  {
    id: 'rr-03',
    riderId: 'RT-0003',
    name: 'Sneha Joshi',
    mobile: '98765 43212',
    jerseyNumber: '#103',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Finished',
  },
  {
    id: 'rr-04',
    riderId: 'RT-0004',
    name: 'Vikram Deshmukh',
    mobile: '98765 43213',
    jerseyNumber: '#104',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Finished',
  },
  {
    id: 'rr-05',
    riderId: 'RT-0005',
    name: 'Priya Kulkarni',
    mobile: '98765 43214',
    jerseyNumber: '#105',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Hybrid',
    status: 'Home Safe',
  },
  {
    id: 'rr-06',
    riderId: 'RT-0006',
    name: 'Rohan Shinde',
    mobile: '98765 43215',
    jerseyNumber: '#106',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Active',
  },
  {
    id: 'rr-07',
    riderId: 'RT-0007',
    name: 'Aniket Ghorpade',
    mobile: '98765 43216',
    jerseyNumber: '#107',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'MTB',
    status: 'Active',
  },
  {
    id: 'rr-08',
    riderId: 'RT-0008',
    name: 'Sagar Mane',
    mobile: '98765 43217',
    jerseyNumber: '#108',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'DNF',
  },
  {
    id: 'rr-09',
    riderId: 'RT-0009',
    name: 'Pooja More',
    mobile: '98765 43218',
    jerseyNumber: '#109',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Active',
  },
  {
    id: 'rr-10',
    riderId: 'RT-0010',
    name: 'Tanvi Sawant',
    mobile: '98765 43219',
    jerseyNumber: '#110',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Finished',
  },
  {
    id: 'rr-11',
    riderId: 'RT-0011',
    name: 'Rajesh Kadam',
    mobile: '98765 43220',
    jerseyNumber: '#111',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'DNF',
  },
  {
    id: 'rr-12',
    riderId: 'RT-0012',
    name: 'Meera Nair',
    mobile: '98765 43221',
    jerseyNumber: '#112',
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Endurance Bike',
    status: 'Home Safe',
  },
];

export const MOCK_REPORT_CHECKPOINTS: ReportCheckpointItem[] = [
  {
    sequence: 1,
    name: 'Registration',
    type: 'Registration',
    required: 'Mandatory',
    scanned: 342,
    completionRate: '100%',
    status: 'Completed',
  },
  {
    sequence: 2,
    name: 'Bike Check',
    type: 'Bike Check',
    required: 'Mandatory',
    scanned: 342,
    completionRate: '100%',
    status: 'Completed',
  },
  {
    sequence: 3,
    name: 'Breakfast',
    type: 'Refreshment',
    required: 'Optional',
    scanned: 338,
    completionRate: '99%',
    status: 'Completed',
  },
  {
    sequence: 4,
    name: 'Start',
    type: 'Start',
    required: 'Mandatory',
    scanned: 320,
    completionRate: '94%',
    status: 'Active',
  },
  {
    sequence: 5,
    name: 'Checkpoint 1',
    type: 'Checkpoint',
    required: 'Mandatory',
    scanned: 298,
    completionRate: '87%',
    status: 'Active',
  },
  {
    sequence: 6,
    name: 'Lunch',
    type: 'Refreshment',
    required: 'Optional',
    scanned: 270,
    completionRate: '79%',
    status: 'Active',
  },
  {
    sequence: 7,
    name: 'Checkpoint 2',
    type: 'Checkpoint',
    required: 'Mandatory',
    scanned: 245,
    completionRate: '72%',
    status: 'Active',
  },
  {
    sequence: 8,
    name: 'Destination',
    type: 'Finish',
    required: 'Mandatory',
    scanned: 286,
    completionRate: '84%',
    status: 'Active',
  },
  {
    sequence: 9,
    name: 'Medal Collection',
    type: 'Medal',
    required: 'Optional',
    scanned: 280,
    completionRate: '82%',
    status: 'Active',
  },
  {
    sequence: 10,
    name: 'Home Safe Confirmation',
    type: 'Home Safe',
    required: 'Mandatory',
    scanned: 270,
    completionRate: '79%',
    status: 'Active',
  },
];

export const MOCK_REPORT_FINISHERS: ReportFinisherItem[] = [
  {
    id: 'fin-01',
    riderId: 'RT-0003',
    riderName: 'Sneha Joshi',
    jerseyNumber: '#103',
    finishCheckpoint: 'Destination',
    finishTime: '10:35 AM',
    totalRideTime: '03h 35m',
    status: 'Finished',
  },
  {
    id: 'fin-02',
    riderId: 'RT-0004',
    riderName: 'Vikram Deshmukh',
    jerseyNumber: '#104',
    finishCheckpoint: 'Destination',
    finishTime: '10:38 AM',
    totalRideTime: '03h 38m',
    status: 'Finished',
  },
  {
    id: 'fin-03',
    riderId: 'RT-0005',
    riderName: 'Priya Kulkarni',
    jerseyNumber: '#105',
    finishCheckpoint: 'Destination',
    finishTime: '10:30 AM',
    totalRideTime: '03h 30m',
    status: 'Finished',
  },
  {
    id: 'fin-04',
    riderId: 'RT-0010',
    riderName: 'Tanvi Sawant',
    jerseyNumber: '#110',
    finishCheckpoint: 'Destination',
    finishTime: '10:28 AM',
    totalRideTime: '03h 28m',
    status: 'Finished',
  },
  {
    id: 'fin-05',
    riderId: 'RT-0012',
    riderName: 'Meera Nair',
    jerseyNumber: '#112',
    finishCheckpoint: 'Destination',
    finishTime: '10:32 AM',
    totalRideTime: '03h 32m',
    status: 'Finished',
  },
  {
    id: 'fin-06',
    riderId: 'RT-0014',
    riderName: 'Aditya Bhosale',
    jerseyNumber: '#114',
    finishCheckpoint: 'Destination',
    finishTime: '10:40 AM',
    totalRideTime: '03h 40m',
    status: 'Finished',
  },
  {
    id: 'fin-07',
    riderId: 'RT-0015',
    riderName: 'Sunita Rao',
    jerseyNumber: '#115',
    finishCheckpoint: 'Destination',
    finishTime: '10:45 AM',
    totalRideTime: '03h 45m',
    status: 'Finished',
  },
];

export const MOCK_REPORT_DNF: ReportDnfItem[] = [
  {
    id: 'dnf-01',
    riderId: 'RT-0008',
    riderName: 'Sagar Mane',
    jerseyNumber: '#108',
    lastCheckpoint: 'Checkpoint 1',
    lastScan: '09:40 AM',
    status: 'DNF',
  },
  {
    id: 'dnf-02',
    riderId: 'RT-0011',
    riderName: 'Rajesh Kadam',
    jerseyNumber: '#111',
    lastCheckpoint: 'Breakfast',
    lastScan: '06:45 AM',
    status: 'DNF',
  },
  {
    id: 'dnf-03',
    riderId: 'RT-0016',
    riderName: 'Kiran Shinde',
    jerseyNumber: '#116',
    lastCheckpoint: 'Checkpoint 1',
    lastScan: '09:20 AM',
    status: 'DNF',
  },
  {
    id: 'dnf-04',
    riderId: 'RT-0019',
    riderName: 'Manoj Jadhav',
    jerseyNumber: '#119',
    lastCheckpoint: 'Lunch',
    lastScan: '10:05 AM',
    status: 'DNF',
  },
  {
    id: 'dnf-05',
    riderId: 'RT-0022',
    riderName: 'Deepa Verma',
    jerseyNumber: '#122',
    lastCheckpoint: 'Checkpoint 1',
    lastScan: '09:10 AM',
    status: 'DNF',
  },
];

export const MOCK_REPORT_HOME_SAFE: ReportHomeSafeItem[] = [
  {
    id: 'hs-01',
    riderId: 'RT-0005',
    riderName: 'Priya Kulkarni',
    jerseyNumber: '#105',
    lastCheckpoint: 'Home Safe Confirmation',
    homeSafeTime: '10:45 AM',
    status: 'Confirmed',
  },
  {
    id: 'hs-02',
    riderId: 'RT-0012',
    riderName: 'Meera Nair',
    jerseyNumber: '#112',
    lastCheckpoint: 'Home Safe Confirmation',
    homeSafeTime: '10:48 AM',
    status: 'Confirmed',
  },
  {
    id: 'hs-03',
    riderId: 'RT-0003',
    riderName: 'Sneha Joshi',
    jerseyNumber: '#103',
    lastCheckpoint: 'Destination',
    homeSafeTime: '—',
    status: 'Pending',
  },
  {
    id: 'hs-04',
    riderId: 'RT-0004',
    riderName: 'Vikram Deshmukh',
    jerseyNumber: '#104',
    lastCheckpoint: 'Destination',
    homeSafeTime: '—',
    status: 'Pending',
  },
  {
    id: 'hs-05',
    riderId: 'RT-0001',
    riderName: 'Rahul Patil',
    jerseyNumber: '#101',
    lastCheckpoint: 'Checkpoint 2',
    homeSafeTime: '—',
    status: 'Pending',
  },
  {
    id: 'hs-06',
    riderId: 'RT-0002',
    riderName: 'Amit Sharma',
    jerseyNumber: '#102',
    lastCheckpoint: 'Checkpoint 2',
    homeSafeTime: '—',
    status: 'Pending',
  },
];
