// RideTrack Organizer Configure Checkpoints — Data Models

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

export interface Checkpoint {
  id: string;
  sequence: number;
  name: string;
  type: CheckpointType;
  requirement: CheckpointRequirement;
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

export interface EventDetailsInfo {
  id: string;
  name: string;
  date: string;
  location: string;
  distanceKm: number;
  organizer: string;
}

export const MOCK_EVENT_DETAILS: EventDetailsInfo | null = null;

export const INITIAL_CHECKPOINTS: Checkpoint[] = [];
