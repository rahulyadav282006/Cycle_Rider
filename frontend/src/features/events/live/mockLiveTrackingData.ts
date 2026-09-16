// RideTrack Live Event Tracking — Mock Data Models and Datasets

export type LiveRiderStatus = 'At Checkpoint' | 'Finished' | 'DNF' | 'Home Safe' | 'Not Started';

export const CHECKPOINT_FILTER_OPTIONS = [
  'All Checkpoints',
  'Registration',
  'Bike Check',
  'Breakfast',
  'Start',
  'Checkpoint 1',
  'Lunch',
  'Checkpoint 2',
  'Destination',
  'Medal Collection',
  'Home Safe Confirmation',
];

export const STATUS_FILTER_OPTIONS = [
  'All Status',
  'At Checkpoint',
  'Finished',
  'DNF',
  'Home Safe',
];

export interface LiveCheckpointProgressItem {
  sequence: number;
  name: string;
  type: string;
  requirement: 'Mandatory' | 'Optional';
  scannedCount: number;
  totalRiders: number;
  percentage: number;
  status: 'Completed' | 'Active' | 'Upcoming';
}

export interface RecentScanItem {
  id: string;
  riderName: string;
  riderId: string;
  checkpoint: string;
  time: string;
  status: 'Verified' | 'Pending Review';
}

export interface LiveRiderItem {
  id: string;
  riderId: string;
  name: string;
  currentCheckpoint: string;
  lastScanTime: string;
  status: LiveRiderStatus;
  bibNumber?: string;
  category?: string;
  emergencyContact?: string;
  timeline: {
    sequence: number;
    name: string;
    time?: string;
    status: 'Completed' | 'Pending';
  }[];
}

export interface LiveTrackingMetrics {
  registered: number;
  started: number;
  atCheckpoints: number;
  finished: number;
  dnf: number;
  homeSafe: number;
}

export const MOCK_LIVE_METRICS: LiveTrackingMetrics = {
  registered: 342,
  started: 320,
  atCheckpoints: 128,
  finished: 286,
  dnf: 14,
  homeSafe: 270,
};

export const MOCK_LIVE_CHECKPOINTS: LiveCheckpointProgressItem[] = [
  {
    sequence: 1,
    name: 'Registration',
    type: 'Registration',
    requirement: 'Mandatory',
    scannedCount: 342,
    totalRiders: 342,
    percentage: 100,
    status: 'Completed',
  },
  {
    sequence: 2,
    name: 'Bike Check',
    type: 'Bike Check',
    requirement: 'Mandatory',
    scannedCount: 342,
    totalRiders: 342,
    percentage: 100,
    status: 'Completed',
  },
  {
    sequence: 3,
    name: 'Breakfast',
    type: 'Refreshment',
    requirement: 'Optional',
    scannedCount: 338,
    totalRiders: 342,
    percentage: 99,
    status: 'Completed',
  },
  {
    sequence: 4,
    name: 'Start',
    type: 'Start',
    requirement: 'Mandatory',
    scannedCount: 320,
    totalRiders: 342,
    percentage: 94,
    status: 'Active',
  },
  {
    sequence: 5,
    name: 'Checkpoint 1',
    type: 'Checkpoint',
    requirement: 'Mandatory',
    scannedCount: 298,
    totalRiders: 342,
    percentage: 87,
    status: 'Active',
  },
  {
    sequence: 6,
    name: 'Lunch',
    type: 'Refreshment',
    requirement: 'Optional',
    scannedCount: 270,
    totalRiders: 342,
    percentage: 79,
    status: 'Active',
  },
  {
    sequence: 7,
    name: 'Checkpoint 2',
    type: 'Checkpoint',
    requirement: 'Mandatory',
    scannedCount: 245,
    totalRiders: 342,
    percentage: 72,
    status: 'Active',
  },
  {
    sequence: 8,
    name: 'Destination',
    type: 'Finish',
    requirement: 'Mandatory',
    scannedCount: 286,
    totalRiders: 342,
    percentage: 84,
    status: 'Active',
  },
  {
    sequence: 9,
    name: 'Medal Collection',
    type: 'Medal',
    requirement: 'Optional',
    scannedCount: 280,
    totalRiders: 342,
    percentage: 82,
    status: 'Active',
  },
  {
    sequence: 10,
    name: 'Home Safe',
    type: 'Home Safe',
    requirement: 'Mandatory',
    scannedCount: 270,
    totalRiders: 342,
    percentage: 79,
    status: 'Active',
  },
];

export const MOCK_RECENT_SCANS: RecentScanItem[] = [
  {
    id: 'scan-1',
    riderName: 'Rahul Patil',
    riderId: 'RT-0001',
    checkpoint: 'Checkpoint 2',
    time: '10:42 AM',
    status: 'Verified',
  },
  {
    id: 'scan-2',
    riderName: 'Amit Sharma',
    riderId: 'RT-0002',
    checkpoint: 'Checkpoint 2',
    time: '10:41 AM',
    status: 'Verified',
  },
  {
    id: 'scan-3',
    riderName: 'Sneha Joshi',
    riderId: 'RT-0003',
    checkpoint: 'Lunch',
    time: '10:40 AM',
    status: 'Verified',
  },
  {
    id: 'scan-4',
    riderName: 'Vikram Deshmukh',
    riderId: 'RT-0004',
    checkpoint: 'Destination',
    time: '10:38 AM',
    status: 'Verified',
  },
  {
    id: 'scan-5',
    riderName: 'Priya Kulkarni',
    riderId: 'RT-0005',
    checkpoint: 'Medal Collection',
    time: '10:35 AM',
    status: 'Verified',
  },
  {
    id: 'scan-6',
    riderName: 'Rohan Shinde',
    riderId: 'RT-0006',
    checkpoint: 'Checkpoint 1',
    time: '10:32 AM',
    status: 'Verified',
  },
];

export const MOCK_LIVE_RIDERS: LiveRiderItem[] = [
  {
    id: 'rider-1',
    riderId: 'RT-0001',
    name: 'Rahul Patil',
    currentCheckpoint: 'Checkpoint 2',
    lastScanTime: '10:42 AM',
    status: 'At Checkpoint',
    bibNumber: '201',
    category: 'Men Open 200km',
    emergencyContact: '+91 98220 12345',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:45 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '06:05 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:20 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '09:15 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', time: '10:00 AM', status: 'Completed' },
      { sequence: 7, name: 'Checkpoint 2', time: '10:42 AM', status: 'Completed' },
      { sequence: 8, name: 'Destination', status: 'Pending' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
  {
    id: 'rider-2',
    riderId: 'RT-0002',
    name: 'Amit Sharma',
    currentCheckpoint: 'Checkpoint 2',
    lastScanTime: '10:41 AM',
    status: 'At Checkpoint',
    bibNumber: '202',
    category: 'Men Open 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:48 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '06:08 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:22 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '09:18 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', time: '10:02 AM', status: 'Completed' },
      { sequence: 7, name: 'Checkpoint 2', time: '10:41 AM', status: 'Completed' },
      { sequence: 8, name: 'Destination', status: 'Pending' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
  {
    id: 'rider-3',
    riderId: 'RT-0003',
    name: 'Sneha Joshi',
    currentCheckpoint: 'Destination',
    lastScanTime: '10:35 AM',
    status: 'Finished',
    bibNumber: '203',
    category: 'Women Open 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:40 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '06:00 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:15 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '08:50 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', time: '09:35 AM', status: 'Completed' },
      { sequence: 7, name: 'Checkpoint 2', time: '10:10 AM', status: 'Completed' },
      { sequence: 8, name: 'Destination', time: '10:35 AM', status: 'Completed' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
  {
    id: 'rider-4',
    riderId: 'RT-0004',
    name: 'Vikram Deshmukh',
    currentCheckpoint: 'Destination',
    lastScanTime: '10:38 AM',
    status: 'Finished',
    bibNumber: '204',
    category: 'Men Open 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:42 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '06:02 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:18 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '08:55 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', time: '09:40 AM', status: 'Completed' },
      { sequence: 7, name: 'Checkpoint 2', time: '10:15 AM', status: 'Completed' },
      { sequence: 8, name: 'Destination', time: '10:38 AM', status: 'Completed' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
  {
    id: 'rider-5',
    riderId: 'RT-0005',
    name: 'Priya Kulkarni',
    currentCheckpoint: 'Home Safe Confirmation',
    lastScanTime: '10:45 AM',
    status: 'Home Safe',
    bibNumber: '205',
    category: 'Women Masters 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:35 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '05:55 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:10 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '08:45 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', time: '09:30 AM', status: 'Completed' },
      { sequence: 7, name: 'Checkpoint 2', time: '10:05 AM', status: 'Completed' },
      { sequence: 8, name: 'Destination', time: '10:30 AM', status: 'Completed' },
      { sequence: 9, name: 'Medal Collection', time: '10:35 AM', status: 'Completed' },
      { sequence: 10, name: 'Home Safe Confirmation', time: '10:45 AM', status: 'Completed' },
    ],
  },
  {
    id: 'rider-6',
    riderId: 'RT-0006',
    name: 'Rohan Shinde',
    currentCheckpoint: 'Checkpoint 1',
    lastScanTime: '10:32 AM',
    status: 'At Checkpoint',
    bibNumber: '206',
    category: 'Men Open 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:55 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '06:15 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:30 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:05 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '10:32 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', status: 'Pending' },
      { sequence: 7, name: 'Checkpoint 2', status: 'Pending' },
      { sequence: 8, name: 'Destination', status: 'Pending' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
  {
    id: 'rider-7',
    riderId: 'RT-0007',
    name: 'Aniket Ghorpade',
    currentCheckpoint: 'Checkpoint 2',
    lastScanTime: '10:30 AM',
    status: 'At Checkpoint',
    bibNumber: '207',
    category: 'Men Open 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:46 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '06:06 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:21 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '09:12 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', time: '09:55 AM', status: 'Completed' },
      { sequence: 7, name: 'Checkpoint 2', time: '10:30 AM', status: 'Completed' },
      { sequence: 8, name: 'Destination', status: 'Pending' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
  {
    id: 'rider-8',
    riderId: 'RT-0008',
    name: 'Sagar Mane',
    currentCheckpoint: 'Checkpoint 1',
    lastScanTime: '09:40 AM',
    status: 'DNF',
    bibNumber: '208',
    category: 'Men Open 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:50 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '06:10 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:25 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '09:40 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', status: 'Pending' },
      { sequence: 7, name: 'Checkpoint 2', status: 'Pending' },
      { sequence: 8, name: 'Destination', status: 'Pending' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
  {
    id: 'rider-9',
    riderId: 'RT-0009',
    name: 'Pooja More',
    currentCheckpoint: 'Lunch',
    lastScanTime: '10:15 AM',
    status: 'At Checkpoint',
    bibNumber: '209',
    category: 'Women Open 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:44 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '06:04 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:19 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '09:20 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', time: '10:15 AM', status: 'Completed' },
      { sequence: 7, name: 'Checkpoint 2', status: 'Pending' },
      { sequence: 8, name: 'Destination', status: 'Pending' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
  {
    id: 'rider-10',
    riderId: 'RT-0010',
    name: 'Tanvi Sawant',
    currentCheckpoint: 'Destination',
    lastScanTime: '10:28 AM',
    status: 'Finished',
    bibNumber: '210',
    category: 'Women Open 200km',
    timeline: [
      { sequence: 1, name: 'Registration', time: '05:38 AM', status: 'Completed' },
      { sequence: 2, name: 'Bike Check', time: '05:58 AM', status: 'Completed' },
      { sequence: 3, name: 'Breakfast', time: '06:12 AM', status: 'Completed' },
      { sequence: 4, name: 'Start', time: '07:00 AM', status: 'Completed' },
      { sequence: 5, name: 'Checkpoint 1', time: '08:48 AM', status: 'Completed' },
      { sequence: 6, name: 'Lunch', time: '09:32 AM', status: 'Completed' },
      { sequence: 7, name: 'Checkpoint 2', time: '10:08 AM', status: 'Completed' },
      { sequence: 8, name: 'Destination', time: '10:28 AM', status: 'Completed' },
      { sequence: 9, name: 'Medal Collection', status: 'Pending' },
      { sequence: 10, name: 'Home Safe Confirmation', status: 'Pending' },
    ],
  },
];
