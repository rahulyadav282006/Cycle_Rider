// RideTrack Organizer Events Management — Data Models and Empty Default State

export type EventStatus = 'upcoming' | 'active' | 'completed';

export interface RideEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  distanceKm: number;
  riderCount: number;
  status: EventStatus;
  tagline: string;
}

export const MOCK_EVENTS_DATA: RideEvent[] = [];
