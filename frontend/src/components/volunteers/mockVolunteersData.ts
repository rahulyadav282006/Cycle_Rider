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

export const EVENT_OPTIONS = [
  'Kolhapur Endurance Ride',
  'Lakeside 100K Ride',
  'Community Century Ride',
] as const;

export const CHECKPOINT_OPTIONS = [
  'Registration',
  'Bike Check',
  'Breakfast',
  'Start',
  'Checkpoint 1',
  'Lunch',
  'Checkpoint 2',
  'Destination',
  'Medal Collection',
  'Home Safe Confirmation',
] as const;

export const MOCK_VOLUNTEER_SUMMARY: VolunteerSummary = {
  totalVolunteers: 12,
  assigned: 10,
  unassigned: 2,
};

export const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: 'VOL-001',
    name: 'Amit Kulkarni',
    mobile: '98765 43210',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Checkpoint 1',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 09:30 AM',
  },
  {
    id: 'VOL-002',
    name: 'Priya Patil',
    mobile: '98765 54321',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Breakfast',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 10:15 AM',
  },
  {
    id: 'VOL-003',
    name: 'Suresh Jadhav',
    mobile: '99887 66554',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Checkpoint 2',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 11:00 AM',
  },
  {
    id: 'VOL-004',
    name: 'Neha More',
    mobile: '91234 56789',
    event: 'Lakeside 100K Ride',
    checkpoint: 'Unassigned',
    status: 'Unassigned',
  },
  {
    id: 'VOL-005',
    name: 'Rahul Deshmukh',
    mobile: '98220 11223',
    event: 'Community Century Ride',
    checkpoint: 'Destination',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 02:45 PM',
  },
  {
    id: 'VOL-006',
    name: 'Snehal Joshi',
    mobile: '98231 22334',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Registration',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 08:00 AM',
  },
  {
    id: 'VOL-007',
    name: 'Vikram Shinde',
    mobile: '98242 33445',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Bike Check',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 08:30 AM',
  },
  {
    id: 'VOL-008',
    name: 'Ananya Kadam',
    mobile: '98253 44556',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Start',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 09:00 AM',
  },
  {
    id: 'VOL-009',
    name: 'Mahesh Bhosale',
    mobile: '98264 55667',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Lunch',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 12:30 PM',
  },
  {
    id: 'VOL-010',
    name: 'Pooja Sawant',
    mobile: '98275 66778',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Medal Collection',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 04:00 PM',
  },
  {
    id: 'VOL-011',
    name: 'Tanaji Ghorpade',
    mobile: '98286 77889',
    event: 'Kolhapur Endurance Ride',
    checkpoint: 'Home Safe Confirmation',
    status: 'Assigned',
    assignedAt: '12 Sep 2026, 05:30 PM',
  },
  {
    id: 'VOL-012',
    name: 'Sachin Shinde',
    mobile: '91345 67890',
    event: 'Community Century Ride',
    checkpoint: 'Unassigned',
    status: 'Unassigned',
  },
];
