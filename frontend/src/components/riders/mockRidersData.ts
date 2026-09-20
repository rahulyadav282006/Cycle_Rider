export type RiderStatus = 'Registered' | 'Active' | 'Finished' | 'DNF';

export interface Rider {
  id: string;
  name: string;
  mobile: string;
  jerseyNo: number;
  event: string;
  bicycleType: string;
  status: RiderStatus;
  paymentStatus?: string;
  paymentRequired?: boolean;
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
  totalRiders: 0,
  activeEventRiders: 0,
  registeredToday: 0,
};

export const MOCK_EVENTS_LIST: string[] = ['All Events'];

export const MOCK_RIDERS: Rider[] = [];
