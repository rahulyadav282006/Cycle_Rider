import { RiderStatus } from './mockRidersData';

export type CheckpointProgressStatus = 'Completed' | 'Current' | 'Pending';

export interface CheckpointTimelineItem {
  sequence: string; // e.g. '01', '02', etc.
  name: string;
  type: string;
  status: CheckpointProgressStatus;
  time?: string;
}

export interface RiderProfileData {
  id: string;             // 'RT-0001'
  name: string;           // 'Rahul Patil'
  mobile: string;         // '98765 43210'
  emergencyContact: string; // '98765 12345'
  bloodGroup: string;     // 'O+'
  age: number;            // 28
  gender: string;         // 'Male'
  club: string;           // 'Kolhapur Cycling Club'
  bicycleType: string;    // 'Road Bike'
  jerseyNumber: string | number; // 101
  event: string;          // 'Kolhapur Endurance Ride'
  rideDistance: string;   // '200 km'
  status: RiderStatus;    // 'Active'
  medicalNotes: string;   // 'No known medical information provided.'
  timeline: CheckpointTimelineItem[];
}

export const MOCK_RIDER_PROFILE: RiderProfileData = {
  id: 'RT-0001',
  name: 'Rahul Patil',
  mobile: '98765 43210',
  emergencyContact: '98765 12345',
  bloodGroup: 'O+',
  age: 28,
  gender: 'Male',
  club: 'Kolhapur Cycling Club',
  bicycleType: 'Road Bike',
  jerseyNumber: 101,
  event: 'Kolhapur Endurance Ride',
  rideDistance: '200 km',
  status: 'Active',
  medicalNotes: 'No known medical information provided.',
  timeline: [
    {
      sequence: '01',
      name: 'Registration',
      type: 'Check-in',
      status: 'Completed',
      time: '05:45 AM',
    },
    {
      sequence: '02',
      name: 'Bike Check',
      type: 'Technical Inspection',
      status: 'Completed',
      time: '06:05 AM',
    },
    {
      sequence: '03',
      name: 'Breakfast',
      type: 'Nutrition Stage',
      status: 'Completed',
      time: '06:20 AM',
    },
    {
      sequence: '04',
      name: 'Start',
      type: 'Course Start Flag',
      status: 'Completed',
      time: '07:00 AM',
    },
    {
      sequence: '05',
      name: 'Checkpoint 1',
      type: 'Intermediate Timing (50 km)',
      status: 'Completed',
      time: '09:15 AM',
    },
    {
      sequence: '06',
      name: 'Lunch',
      type: 'Mid-Course Refueling (100 km)',
      status: 'Completed',
      time: '11:45 AM',
    },
    {
      sequence: '07',
      name: 'Checkpoint 2',
      type: 'Intermediate Timing (150 km)',
      status: 'Current',
      time: 'In Progress',
    },
    {
      sequence: '08',
      name: 'Destination',
      type: 'Course Finish Line (200 km)',
      status: 'Pending',
    },
    {
      sequence: '09',
      name: 'Medal Collection',
      type: 'Finisher Ceremony',
      status: 'Pending',
    },
    {
      sequence: '10',
      name: 'Home Safe Confirmation',
      type: 'Safety Protocol',
      status: 'Pending',
    },
  ],
};
