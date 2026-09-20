// RideTrack Event Checkpoint Management — Data Models

export type CheckpointType =
  | 'Registration'
  | 'Bike Check'
  | 'Refreshment'
  | 'Start'
  | 'Checkpoint'
  | 'Finish'
  | 'Medal'
  | 'Home Safe';

export type CheckpointRequirement = 'Mandatory' | 'Optional';

export interface CheckpointItem {
  id: string;
  sequence: number;
  name: string;
  type: CheckpointType;
  requirement: CheckpointRequirement;
  volunteersAssigned: number;
  latitude?: number;
  longitude?: number;
}

export const CHECKPOINT_TYPES: CheckpointType[] = [
  'Registration',
  'Bike Check',
  'Refreshment',
  'Start',
  'Checkpoint',
  'Finish',
  'Medal',
  'Home Safe',
];

export interface EventSummaryInfo {
  id: string;
  name: string;
  date: string;
  location: string;
  distanceKm: number;
  status: 'Active' | 'Draft' | 'Completed' | 'Upcoming';
  organizer: string;
}

export const MOCK_EVENT_SUMMARY: EventSummaryInfo | null = null;

export const INITIAL_CHECKPOINT_ITEMS: CheckpointItem[] = [];
