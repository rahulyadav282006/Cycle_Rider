// RideTrack Live Event Tracking — Data Models

export type LiveRiderStatus = 'At Checkpoint' | 'Finished' | 'DNF' | 'Home Safe' | 'Not Started';

export const CHECKPOINT_FILTER_OPTIONS = [
  'All Checkpoints',
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
  registered: 0,
  started: 0,
  atCheckpoints: 0,
  finished: 0,
  dnf: 0,
  homeSafe: 0,
};

export const MOCK_LIVE_CHECKPOINTS: LiveCheckpointProgressItem[] = [];

export const MOCK_RECENT_SCANS: RecentScanItem[] = [];

export const MOCK_LIVE_RIDERS: LiveRiderItem[] = [];
