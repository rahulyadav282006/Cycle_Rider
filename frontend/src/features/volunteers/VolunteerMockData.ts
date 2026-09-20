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

export const MOCK_VOLUNTEER_PROFILE: VolunteerProfile | null = null;
export const MOCK_TODAY_ASSIGNMENT: TodayAssignment | null = null;
export const MOCK_ASSIGNED_CHECKPOINT: AssignedCheckpoint | null = null;
export const MOCK_CHECKPOINT_ACTIVITY: CheckpointActivity | null = null;
export const MOCK_EVENT_PROGRESS: ProgressStage[] = [];
