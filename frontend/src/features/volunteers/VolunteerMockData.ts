export interface VolunteerProfile {
  name: string;
  role: string;
  avatar: string;
  id: string;
  mobile: string;
}

export interface TodayAssignment {
  event: string;
  date: string;
  location: string;
  distance: string;
  volunteer: string;
}

export interface AssignedCheckpoint {
  number: string;
  name: string;
  type: string;
  status: 'Assigned';
  supportingText: string;
  sequence: string;
  assignmentType: string;
  readinessStatus: 'Ready';
}

export interface CheckpointActivity {
  ridersExpected: number;
  scannedHere: number;
  remaining: number;
  lastScan: {
    riderName: string;
    time: string;
    riderId: string;
  };
}

export type ProgressStageStatus = 'Completed' | 'Current' | 'Upcoming';

export interface ProgressStage {
  number: string;
  name: string;
  type: string;
  status: ProgressStageStatus;
  isAssignedToMe?: boolean;
}

export const MOCK_VOLUNTEER_PROFILE: VolunteerProfile = {
  name: 'Dipti Patil',
  role: 'Volunteer',
  avatar: 'DP',
  id: 'VOL-002',
  mobile: '98765 54321',
};

export const MOCK_TODAY_ASSIGNMENT: TodayAssignment = {
  event: 'Kolhapur Endurance Ride',
  date: '13 September 2026',
  location: 'Kolhapur',
  distance: '200 km',
  volunteer: 'Dipti Patil',
};

export const MOCK_ASSIGNED_CHECKPOINT: AssignedCheckpoint = {
  number: '06',
  name: 'Lunch',
  type: 'Refreshment',
  status: 'Assigned',
  supportingText: 'You are assigned to verify riders at this checkpoint.',
  sequence: '06 of 10',
  assignmentType: 'Primary Volunteer',
  readinessStatus: 'Ready',
};

export const MOCK_CHECKPOINT_ACTIVITY: CheckpointActivity = {
  ridersExpected: 342,
  scannedHere: 128,
  remaining: 214,
  lastScan: {
    riderName: 'Rahul Patil',
    time: '10:42 AM',
    riderId: 'RT-0001',
  },
};

export const MOCK_EVENT_PROGRESS: ProgressStage[] = [
  { number: '01', name: 'Registration', type: 'Administrative', status: 'Completed' },
  { number: '02', name: 'Bike Check', type: 'Safety Inspection', status: 'Completed' },
  { number: '03', name: 'Breakfast', type: 'Refreshment', status: 'Completed' },
  { number: '04', name: 'Start', type: 'Flag-off', status: 'Completed' },
  { number: '05', name: 'Checkpoint 1', type: 'Time Check', status: 'Completed' },
  {
    number: '06',
    name: 'Lunch',
    type: 'Refreshment',
    status: 'Current',
    isAssignedToMe: true,
  },
  { number: '07', name: 'Checkpoint 2', type: 'Time Check', status: 'Upcoming' },
  { number: '08', name: 'Destination', type: 'Finish Line', status: 'Upcoming' },
  { number: '09', name: 'Medal Collection', type: 'Awards', status: 'Upcoming' },
  { number: '10', name: 'Home Safe Confirmation', type: 'Safety & De-registration', status: 'Upcoming' },
];
