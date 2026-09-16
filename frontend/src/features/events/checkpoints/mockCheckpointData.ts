// RideTrack Event Checkpoint Management — Mock Data Models and Datasets

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

export const MOCK_EVENT_SUMMARY: EventSummaryInfo = {
  id: 'ev-kolhapur-2026',
  name: 'Kolhapur Endurance Ride',
  date: '13 September 2026',
  location: 'Kolhapur',
  distanceKm: 200,
  status: 'Active',
  organizer: 'Organizer Admin',
};

// 10 Checkpoints: Exactly 7 Mandatory and 3 Optional
// Assigned: 8 / 10 volunteers total
export const INITIAL_CHECKPOINT_ITEMS: CheckpointItem[] = [
  {
    id: 'cp-01',
    sequence: 1,
    name: 'Registration',
    type: 'Registration',
    requirement: 'Mandatory',
    volunteersAssigned: 1,
  },
  {
    id: 'cp-02',
    sequence: 2,
    name: 'Bike Check',
    type: 'Bike Check',
    requirement: 'Mandatory',
    volunteersAssigned: 1,
  },
  {
    id: 'cp-03',
    sequence: 3,
    name: 'Breakfast',
    type: 'Refreshment',
    requirement: 'Optional',
    volunteersAssigned: 1,
  },
  {
    id: 'cp-04',
    sequence: 4,
    name: 'Start',
    type: 'Start',
    requirement: 'Mandatory',
    volunteersAssigned: 1,
  },
  {
    id: 'cp-05',
    sequence: 5,
    name: 'Checkpoint 1',
    type: 'Checkpoint',
    requirement: 'Mandatory',
    volunteersAssigned: 1,
  },
  {
    id: 'cp-06',
    sequence: 6,
    name: 'Lunch',
    type: 'Refreshment',
    requirement: 'Optional',
    volunteersAssigned: 0, // 0 volunteers for edit view; delete warning shows 1 volunteer assigned
  },
  {
    id: 'cp-07',
    sequence: 7,
    name: 'Checkpoint 2',
    type: 'Checkpoint',
    requirement: 'Mandatory',
    volunteersAssigned: 1,
  },
  {
    id: 'cp-08',
    sequence: 8,
    name: 'Destination',
    type: 'Finish',
    requirement: 'Mandatory',
    volunteersAssigned: 1,
  },
  {
    id: 'cp-09',
    sequence: 9,
    name: 'Medal Collection',
    type: 'Medal',
    requirement: 'Optional',
    volunteersAssigned: 1,
  },
  {
    id: 'cp-10',
    sequence: 10,
    name: 'Home Safe Confirmation',
    type: 'Home Safe',
    requirement: 'Mandatory',
    volunteersAssigned: 1,
  },
];
