// RideTrack Organizer Events Management — Mock Data Models and Datasets
// Structure mirrors future API payloads without backend dependencies

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

export const MOCK_EVENTS_DATA: RideEvent[] = [
  {
    id: 'ev-kolhapur-2026',
    name: 'Kolhapur Endurance Ride',
    date: '13 September 2026',
    location: 'Kolhapur',
    distanceKm: 200,
    riderCount: 342,
    status: 'active',
    tagline: 'Course is active — 4 checkpoints currently operating',
  },
  {
    id: 'ev-lakeside-2026',
    name: 'Lakeside 100K Ride',
    date: '15 October 2026',
    location: 'Lakeside Highway',
    distanceKm: 100,
    riderCount: 580,
    status: 'upcoming',
    tagline: 'Registration open — Bib allocation in progress',
  },
  {
    id: 'ev-western-ghats-2026',
    name: 'Western Ghats Brevet',
    date: '28 October 2026',
    location: 'Sahyadri Pass',
    distanceKm: 300,
    riderCount: 180,
    status: 'upcoming',
    tagline: 'High-elevation route with mandatory night lights',
  },
  {
    id: 'ev-community-2026',
    name: 'Community Century Ride',
    date: '05 September 2026',
    location: 'City Circuit',
    distanceKm: 160,
    riderCount: 326,
    status: 'completed',
    tagline: 'Completed — 326 verified finishers recorded',
  },
  {
    id: 'ev-monsoon-2026',
    name: 'Monsoon Challenge 75K',
    date: '20 August 2026',
    location: 'Lonavala Valley',
    distanceKm: 75,
    riderCount: 410,
    status: 'completed',
    tagline: 'Rain stage successfully concluded with zero incidents',
  },
];
