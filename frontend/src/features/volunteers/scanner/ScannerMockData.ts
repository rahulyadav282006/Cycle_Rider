export type ScannerState =
  | 'ready'
  | 'detected'
  | 'success'
  | 'duplicate'
  | 'invalid'
  | 'wrong-checkpoint'
  | 'offline';

export interface DetectedRider {
  name: string;
  riderId: string;
  jerseyNumber: string;
  checkpoint: string;
  event: string;
  scanTime: string;
}

export interface ScannerCheckpointContext {
  checkpointCode: string;
  checkpointName: string;
  checkpointType: string;
  event: string;
  status: string;
  pendingSyncCount: number;
}

export const MOCK_SCANNER_CONTEXT: ScannerCheckpointContext = {
  checkpointCode: 'CP 06',
  checkpointName: 'Lunch',
  checkpointType: 'Refreshment',
  event: 'Kolhapur Endurance Ride',
  status: 'Assigned / Ready',
  pendingSyncCount: 3,
};

export const MOCK_DETECTED_RIDER: DetectedRider = {
  name: 'Rahul Patil',
  riderId: 'RT-0001',
  jerseyNumber: '#101',
  checkpoint: 'CP 06 — Lunch',
  event: 'Kolhapur Endurance Ride',
  scanTime: '10:42 AM',
};
