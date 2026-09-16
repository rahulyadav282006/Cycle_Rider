// RideTrack Organizer Configure Checkpoints — Mock Data Models and Datasets

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

export const MOCK_EVENT_DETAILS: EventDetailsInfo = {
  id: 'ev-kolhapur-2026',
  name: 'Kolhapur Endurance Ride',
  date: '13 September 2026',
  location: 'Kolhapur',
  distanceKm: 200,
  organizer: 'Organizer Admin',
};

export const INITIAL_CHECKPOINTS: Checkpoint[] = [
  {
    id: 'cp-1',
    sequence: 1,
    name: 'Registration',
    type: 'Registration',
    requirement: 'Mandatory',
  },
  {
    id: 'cp-2',
    sequence: 2,
    name: 'Bike Check',
    type: 'Bike Check',
    requirement: 'Mandatory',
  },
  {
    id: 'cp-3',
    sequence: 3,
    name: 'Breakfast',
    type: 'Refreshment',
    requirement: 'Optional',
  },
  {
    id: 'cp-4',
    sequence: 4,
    name: 'Start',
    type: 'Start',
    requirement: 'Mandatory',
  },
  {
    id: 'cp-5',
    sequence: 5,
    name: 'Checkpoint 1',
    type: 'Checkpoint',
    requirement: 'Mandatory',
  },
  {
    id: 'cp-6',
    sequence: 6,
    name: 'Lunch',
    type: 'Refreshment',
    requirement: 'Optional',
  },
  {
    id: 'cp-7',
    sequence: 7,
    name: 'Checkpoint 2',
    type: 'Checkpoint',
    requirement: 'Mandatory',
  },
  {
    id: 'cp-8',
    sequence: 8,
    name: 'Destination',
    type: 'Finish',
    requirement: 'Mandatory',
  },
  {
    id: 'cp-9',
    sequence: 9,
    name: 'Medal Collection',
    type: 'Medal',
    requirement: 'Optional',
  },
  {
    id: 'cp-10',
    sequence: 10,
    name: 'Home Safe Confirmation',
    type: 'Home Safe',
    requirement: 'Mandatory',
  },
];
