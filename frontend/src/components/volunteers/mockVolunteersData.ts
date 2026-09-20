export type VolunteerStatus = 'Assigned' | 'Unassigned';

export interface Volunteer {
  id: string;
  name: string;
  mobile: string;
  event: string;
  checkpoint: string;
  checkpointId?: string;
  status: VolunteerStatus;
  assignedAt?: string;
  email?: string;
  role?: string;
  assignedDate?: string;
}

export interface VolunteerSummary {
  totalVolunteers: number;
  assigned: number;
  unassigned: number;
}

export const EVENT_OPTIONS: readonly string[] = [];

export const CHECKPOINT_OPTIONS: readonly string[] = [];

export const MOCK_VOLUNTEER_SUMMARY: VolunteerSummary = {
  totalVolunteers: 0,
  assigned: 0,
  unassigned: 0,
};

export const MOCK_VOLUNTEERS: Volunteer[] = [];
