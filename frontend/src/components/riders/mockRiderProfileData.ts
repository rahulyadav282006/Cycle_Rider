import { RiderStatus } from './mockRidersData';

export type CheckpointProgressStatus = 'Completed' | 'Current' | 'Pending';

export interface CheckpointTimelineItem {
  sequence: string;
  name: string;
  type: string;
  status: CheckpointProgressStatus;
  time?: string;
}

export interface RiderProfileData {
  id: string;
  name: string;
  mobile: string;
  emergencyContact: string;
  bloodGroup: string;
  age: number;
  gender: string;
  club: string;
  bicycleType: string;
  jerseyNumber: string | number;
  event: string;
  rideDistance: string;
  status: RiderStatus;
  paymentStatus?: 'pending' | 'verified' | string;
  paymentRequired?: boolean;
  medicalNotes: string;
  timeline: CheckpointTimelineItem[];
}

export const MOCK_RIDER_PROFILE: RiderProfileData | null = null;
