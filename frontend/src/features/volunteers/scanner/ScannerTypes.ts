// RideTrack Volunteer Scanner Types

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
