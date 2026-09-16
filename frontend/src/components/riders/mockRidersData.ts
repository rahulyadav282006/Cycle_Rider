export type RiderStatus = 'Registered' | 'Active' | 'Finished' | 'DNF';

export interface Rider {
  id: string;             // e.g. 'RT-0001'
  name: string;           // e.g. 'Rahul Patil'
  mobile: string;         // e.g. '98765 43210'
  jerseyNo: number;       // e.g. 101
  event: string;          // e.g. 'Kolhapur Endurance Ride'
  bicycleType: string;    // e.g. 'Road Bike'
  status: RiderStatus;    // 'Registered' | 'Active' | 'Finished' | 'DNF'
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  bloodGroup?: string;
  registeredDate?: string;
}

export interface RiderSummaryMetrics {
  totalRiders: number;
  activeEventRiders: number;
  registeredToday: number;
}

export const MOCK_RIDER_SUMMARY: RiderSummaryMetrics = {
  totalRiders: 1248,
  activeEventRiders: 342,
  registeredToday: 24,
};

export const MOCK_EVENTS_LIST: string[] = [
  'All Events',
  'Kolhapur Endurance Ride',
  'Lakeside 100K Ride',
  'Community Century Ride',
];

export const MOCK_RIDERS: Rider[] = [
  {
    id: 'RT-0001',
    name: 'Rahul Patil',
    mobile: '98765 43210',
    jerseyNo: 101,
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Registered',
    emergencyContact: {
      name: 'Sunita Patil',
      relation: 'Spouse',
      phone: '98765 43211',
    },
    bloodGroup: 'O+',
    registeredDate: 'Today, 08:30 AM',
  },
  {
    id: 'RT-0002',
    name: 'Amit Sharma',
    mobile: '98765 12345',
    jerseyNo: 102,
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Active',
    emergencyContact: {
      name: 'Vikram Sharma',
      relation: 'Brother',
      phone: '98765 12349',
    },
    bloodGroup: 'B+',
    registeredDate: 'Yesterday',
  },
  {
    id: 'RT-0003',
    name: 'Sneha Joshi',
    mobile: '99887 66554',
    jerseyNo: 103,
    event: 'Lakeside 100K Ride',
    bicycleType: 'MTB',
    status: 'Registered',
    emergencyContact: {
      name: 'Anand Joshi',
      relation: 'Father',
      phone: '99887 66550',
    },
    bloodGroup: 'A+',
    registeredDate: 'Today, 10:15 AM',
  },
  {
    id: 'RT-0004',
    name: 'Vikram More',
    mobile: '91234 56789',
    jerseyNo: 104,
    event: 'Community Century Ride',
    bicycleType: 'Road Bike',
    status: 'Finished',
    emergencyContact: {
      name: 'Meera More',
      relation: 'Spouse',
      phone: '91234 56780',
    },
    bloodGroup: 'AB+',
    registeredDate: '10 Sep 2026',
  },
  {
    id: 'RT-0005',
    name: 'Priyanka Deshmukh',
    mobile: '98220 11223',
    jerseyNo: 105,
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Hybrid Bike',
    status: 'Registered',
    emergencyContact: {
      name: 'Sanjay Deshmukh',
      relation: 'Father',
      phone: '98220 11224',
    },
    bloodGroup: 'B+',
    registeredDate: 'Today, 11:45 AM',
  },
  {
    id: 'RT-0006',
    name: 'Rohit Shinde',
    mobile: '97654 32109',
    jerseyNo: 106,
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'DNF',
    emergencyContact: {
      name: 'Kavita Shinde',
      relation: 'Spouse',
      phone: '97654 32110',
    },
    bloodGroup: 'O-',
    registeredDate: '09 Sep 2026',
  },
  {
    id: 'RT-0007',
    name: 'Ananya Roy',
    mobile: '98112 33445',
    jerseyNo: 107,
    event: 'Lakeside 100K Ride',
    bicycleType: 'Gravel Bike',
    status: 'Active',
    emergencyContact: {
      name: 'Deepak Roy',
      relation: 'Spouse',
      phone: '98112 33440',
    },
    bloodGroup: 'A-',
    registeredDate: '08 Sep 2026',
  },
  {
    id: 'RT-0008',
    name: 'Rohan Kulkarni',
    mobile: '98450 67890',
    jerseyNo: 108,
    event: 'Community Century Ride',
    bicycleType: 'Road Bike',
    status: 'Finished',
    emergencyContact: {
      name: 'Smita Kulkarni',
      relation: 'Mother',
      phone: '98450 67899',
    },
    bloodGroup: 'O+',
    registeredDate: '07 Sep 2026',
  },
  {
    id: 'RT-0009',
    name: 'Tanvi Mehta',
    mobile: '98901 23456',
    jerseyNo: 109,
    event: 'Kolhapur Endurance Ride',
    bicycleType: 'Road Bike',
    status: 'Registered',
    emergencyContact: {
      name: 'Harsh Mehta',
      relation: 'Brother',
      phone: '98901 23450',
    },
    bloodGroup: 'B-',
    registeredDate: 'Today, 09:20 AM',
  },
  {
    id: 'RT-0010',
    name: 'Suresh Nair',
    mobile: '97441 55667',
    jerseyNo: 110,
    event: 'Lakeside 100K Ride',
    bicycleType: 'MTB',
    status: 'Active',
    emergencyContact: {
      name: 'Radhika Nair',
      relation: 'Spouse',
      phone: '97441 55660',
    },
    bloodGroup: 'AB-',
    registeredDate: '05 Sep 2026',
  },
];
