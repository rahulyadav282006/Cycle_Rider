// RideTrack Reports Module — Data Models and Report Definitions

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

export const MOCK_REPORT_EVENT: EventReportMetadata | null = null;

export const REPORT_TYPES_CONFIG: ReportTypeItem[] = [
  {
    key: 'rider_list',
    title: 'Rider List',
    description: 'Complete roster of registered riders, jersey numbers, bicycle types, and active statuses.',
    iconType: 'riders',
  },
  {
    key: 'checkpoint_summary',
    title: 'Checkpoint Summary',
    description: 'Passing statistics, timing breakdowns, and completion percentage for route checkpoints.',
    iconType: 'checkpoints',
  },
  {
    key: 'finishers',
    title: 'Finishers',
    description: 'Official finishing times, total ride duration, and category rankings for course completers.',
    iconType: 'finishers',
  },
  {
    key: 'dnf',
    title: 'DNF Riders',
    description: 'Riders who did not finish the route, with last scanned checkpoint stations and timestamps.',
    iconType: 'dnf',
  },
  {
    key: 'home_safe',
    title: 'Home Safe Confirmation',
    description: 'End-of-event safety check tracking return confirmations and pending safety verifications.',
    iconType: 'home_safe',
  },
  {
    key: 'event_summary',
    title: 'Event Summary',
    description: 'Executive overview covering participant statistics, station coverage, and overall operations.',
    iconType: 'event_summary',
  },
];

export const MOCK_RECENT_REPORTS: RecentReportItem[] = [];
export const MOCK_REPORT_RIDERS: ReportRiderItem[] = [];
export const MOCK_REPORT_CHECKPOINTS: ReportCheckpointItem[] = [];
export const MOCK_REPORT_FINISHERS: ReportFinisherItem[] = [];
export const MOCK_REPORT_DNF: ReportDnfItem[] = [];
export const MOCK_REPORT_HOME_SAFE: ReportHomeSafeItem[] = [];
