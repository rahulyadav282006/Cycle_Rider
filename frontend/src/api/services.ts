// RideTrack Strongly-Typed API Services
import { api, setAuthSession, clearAuthSession } from './client';

// --------------------------------------------------
// DATA MODELS
// --------------------------------------------------
export type UserRole = 'SUPER_ADMIN' | 'ORGANIZER' | 'VOLUNTEER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationName?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface EventItem {
  id: string;
  eventName: string;
  description: string;
  location: string;
  rideDistance: number;
  rideDate: string;
  startTime: string;
  organizerId: string;
  organizerName: string;
  status: 'draft' | 'upcoming' | 'active' | 'completed' | 'archived';
  riderCount: number;
  checkpointCount: number;
  volunteerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CheckpointItem {
  id: string;
  eventId: string;
  name: string;
  type: string;
  sequenceNumber: number;
  mandatory: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RiderItem {
  id: string;
  riderId: string;
  eventId: string;
  name: string;
  mobile: string;
  emergencyContact: string;
  bloodGroup: string;
  age?: number;
  gender: string;
  club: string;
  bicycleType: string;
  jerseyNumber: string;
  medicalNotes: string;
  qrCodeValue: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  timeline?: any[];
}

export interface VolunteerItem {
  id: string;
  userId?: string;
  eventId: string;
  checkpointId?: string;
  checkpointName?: string;
  name: string;
  mobile: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScanResult {
  id: string;
  clientScanId: string;
  riderId: string;
  riderName: string;
  jerseyNumber: string;
  eventId: string;
  eventName: string;
  checkpointId: string;
  checkpointName: string;
  volunteerId: string;
  scanTime: string;
  status: string;
}

export interface LiveTrackingData {
  eventId: string;
  eventName: string;
  registeredRiders: number;
  startedRiders: number;
  finishedRiders: number;
  dnfRiders: number;
  homeSafeRiders: number;
  checkpointProgress: {
    checkpointId: string;
    name: string;
    sequenceNumber: number;
    mandatory: boolean;
    scannedCount: number;
  }[];
  recentScans: {
    id: string;
    riderId: string;
    riderName: string;
    jerseyNumber: string;
    checkpointName: string;
    scanTime: string;
    status: string;
  }[];
  ridersStatusList: {
    id: string;
    riderId: string;
    name: string;
    jerseyNumber: string;
    status: string;
    lastCheckpoint: string;
    lastScanTime: string;
    mandatoryCheckpointsCompleted: number;
    totalMandatoryCheckpoints: number;
  }[];
}

export interface AdminStats {
  totalOrganizers: number;
  activeOrganizers: number;
  totalEvents: number;
  activeEvents: number;
  totalRiders: number;
  totalCheckpoints: number;
}

export interface AdminOrganizerItem {
  id: string;
  name: string;
  email: string;
  mobile: string;
  organization: string;
  eventsCount: number;
  activeEventsCount: number;
  completedEventsCount: number;
  totalRiders: number;
  status: string;
  joinedDate: string;
  recentEvents: {
    id: string;
    name: string;
    date: string;
    location: string;
    distance: string;
    status: string;
  }[];
}

export interface SystemSettings {
  platformName: string;
  supportEmail: string;
  allowPublicRegistration: boolean;
  allowEventCreation: boolean;
  allowOrganizerRegistration: boolean;
  offlineScanning: boolean;
  automaticSync: boolean;
  platformNotifications: boolean;
  platformStatus: 'Operational' | 'Degraded' | 'Maintenance';
  qrCodeGracePeriodHours: number;
  offlineSyncWindowHours: number;
  maintenanceMode: boolean;
  updatedAt: string;
}

// --------------------------------------------------
// API SERVICES
// --------------------------------------------------
export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const data = await api.post<AuthResponse>('/api/v1/auth/login', credentials);
    setAuthSession(data.accessToken, data.refreshToken, data.user);
    return data;
  },

  register: async (details: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    organizationName?: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const data = await api.post<AuthResponse>('/api/v1/auth/register', details);
    setAuthSession(data.accessToken, data.refreshToken, data.user);
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/api/v1/auth/me');
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch {
      // ignore
    } finally {
      clearAuthSession();
    }
  },
};

export const eventService = {
  listEvents: async (): Promise<EventItem[]> => {
    return api.get<EventItem[]>('/api/v1/events');
  },

  getEvent: async (eventId: string): Promise<EventItem> => {
    return api.get<EventItem>(`/api/v1/events/${eventId}`);
  },

  createEvent: async (payload: {
    eventName: string;
    description?: string;
    location: string;
    rideDistance: string | number;
    rideDate: string;
    startTime: string;
    organizerName?: string;
    status?: string;
  }): Promise<EventItem> => {
    return api.post<EventItem>('/api/v1/events', payload);
  },

  updateEvent: async (eventId: string, payload: Partial<EventItem>): Promise<EventItem> => {
    return api.put<EventItem>(`/api/v1/events/${eventId}`, payload);
  },

  deleteEvent: async (eventId: string): Promise<{ deleted: boolean }> => {
    return api.delete<{ deleted: boolean }>(`/api/v1/events/${eventId}`);
  },
};

export const checkpointService = {
  listCheckpoints: async (eventId: string): Promise<CheckpointItem[]> => {
    return api.get<CheckpointItem[]>(`/api/v1/events/${eventId}/checkpoints`);
  },

  createCheckpoint: async (
    eventId: string,
    payload: { name: string; type?: string; sequenceNumber: number; mandatory?: boolean }
  ): Promise<CheckpointItem> => {
    return api.post<CheckpointItem>(`/api/v1/events/${eventId}/checkpoints`, payload);
  },

  updateCheckpoint: async (
    checkpointId: string,
    payload: Partial<CheckpointItem>
  ): Promise<CheckpointItem> => {
    return api.put<CheckpointItem>(`/api/v1/checkpoints/${checkpointId}`, payload);
  },

  deleteCheckpoint: async (checkpointId: string): Promise<{ deleted: boolean }> => {
    return api.delete<{ deleted: boolean }>(`/api/v1/checkpoints/${checkpointId}`);
  },
};

export const riderService = {
  listRiders: async (eventId: string): Promise<RiderItem[]> => {
    return api.get<RiderItem[]>(`/api/v1/events/${eventId}/riders`);
  },

  getRider: async (riderId: string): Promise<RiderItem> => {
    return api.get<RiderItem>(`/api/v1/riders/${riderId}`);
  },

  createRider: async (
    eventId: string,
    payload: {
      name: string;
      mobile: string;
      emergencyContact: string;
      bloodGroup?: string;
      age?: number;
      gender?: string;
      club?: string;
      bicycleType?: string;
      jerseyNumber?: string | number;
      medicalNotes?: string;
    }
  ): Promise<RiderItem> => {
    return api.post<RiderItem>(`/api/v1/events/${eventId}/riders`, payload);
  },

  updateRider: async (riderId: string, payload: Partial<RiderItem>): Promise<RiderItem> => {
    return api.put<RiderItem>(`/api/v1/riders/${riderId}`, payload);
  },

  deleteRider: async (riderId: string): Promise<{ deleted: boolean }> => {
    return api.delete<{ deleted: boolean }>(`/api/v1/riders/${riderId}`);
  },
};

export const volunteerService = {
  listVolunteers: async (eventId: string): Promise<VolunteerItem[]> => {
    return api.get<VolunteerItem[]>(`/api/v1/events/${eventId}/volunteers`);
  },

  createVolunteer: async (
    eventId: string,
    payload: { name: string; mobile: string; checkpointId?: string; checkpointName?: string; status?: string }
  ): Promise<VolunteerItem> => {
    return api.post<VolunteerItem>(`/api/v1/events/${eventId}/volunteers`, payload);
  },

  updateVolunteer: async (volunteerId: string, payload: Partial<VolunteerItem>): Promise<VolunteerItem> => {
    return api.put<VolunteerItem>(`/api/v1/volunteers/${volunteerId}`, payload);
  },

  deleteVolunteer: async (volunteerId: string): Promise<{ deleted: boolean }> => {
    return api.delete<{ deleted: boolean }>(`/api/v1/volunteers/${volunteerId}`);
  },

  getMyAssignment: async (): Promise<{
    assignment: VolunteerItem;
    event: EventItem;
    checkpoint?: CheckpointItem;
  }> => {
    return api.get('/api/v1/volunteers/me');
  },
};

export const scanService = {
  recordScan: async (payload: {
    clientScanId: string;
    riderId: string;
    eventId: string;
    checkpointId: string;
    scanTime?: string;
  }): Promise<ScanResult> => {
    return api.post<ScanResult>('/api/v1/scans', payload);
  },
};

export const liveTrackingService = {
  getLiveTracking: async (eventId: string): Promise<LiveTrackingData> => {
    return api.get<LiveTrackingData>(`/api/v1/events/${eventId}/live`);
  },
};

export const reportService = {
  getReport: async (eventId: string, reportType: string): Promise<any> => {
    return api.get(`/api/v1/events/${eventId}/reports/${reportType}`);
  },

  downloadCsv: async (eventId: string, reportType: string): Promise<Blob> => {
    return api.get(`/api/v1/events/${eventId}/reports/${reportType}/export`);
  },
};

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    return api.get<AdminStats>('/api/v1/admin/stats');
  },

  getOrganizers: async (): Promise<AdminOrganizerItem[]> => {
    return api.get<AdminOrganizerItem[]>('/api/v1/admin/organizers');
  },

  createOrganizer: async (payload: {
    name: string;
    email: string;
    organization?: string;
    mobile?: string;
    password?: string;
  }): Promise<any> => {
    return api.post('/api/v1/admin/organizers', payload);
  },

  getOrganizerDetails: async (organizerId: string): Promise<any> => {
    return api.get(`/api/v1/admin/organizers/${organizerId}`);
  },

  getAdminEvents: async (): Promise<any[]> => {
    return api.get('/api/v1/admin/events');
  },

  getSettings: async (): Promise<SystemSettings> => {
    return api.get<SystemSettings>('/api/v1/admin/settings');
  },

  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    return api.put<SystemSettings>('/api/v1/admin/settings', settings);
  },
};

// --------------------------------------------------
// DYNAMIC QR CODE SERVICE
// --------------------------------------------------
export interface QrCodeData {
  id: string;
  shortId: string;
  destinationUrl: string;
  trackingUrl: string;
  svgUrl: string;
  totalScans: number;
  title?: string;
  createdAt: string;
}

export interface QrScanLog {
  timestamp: string;
  userAgent: string;
  clientIp: string;
}

export interface QrAnalyticsData {
  shortId: string;
  destinationUrl: string;
  trackingUrl: string;
  totalScans: number;
  scans: QrScanLog[];
  createdAt: string;
  updatedAt: string;
}

export const qrCodeService = {
  generateQrCode: async (payload: { destinationUrl: string; title?: string }): Promise<QrCodeData> => {
    return api.post<QrCodeData>('/api/v1/qr/generate', payload);
  },

  getQrAnalytics: async (shortId: string): Promise<QrAnalyticsData> => {
    return api.get<QrAnalyticsData>(`/api/v1/qr/${shortId}/analytics`);
  },

  getQrSvgUrl: (shortId: string): string => {
    return `/api/v1/qr/${shortId}/svg`;
  },

  getDirectSvgUrl: (url: string): string => {
    return `/api/v1/qr/direct/svg?url=${encodeURIComponent(url)}`;
  },

  downloadQrSvg: async (shortId: string, filename: string = 'new-rider-qr.svg'): Promise<void> => {
    const response = await fetch(`/api/v1/qr/${shortId}/svg`);
    if (!response.ok) {
      throw new Error(`Failed to fetch QR SVG: ${response.statusText}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  },

  downloadDirectSvg: async (content: string, filename: string = 'new-rider-qr.svg'): Promise<void> => {
    const response = await fetch(`/api/v1/qr/direct/svg?url=${encodeURIComponent(content)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch QR SVG: ${response.statusText}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  },
};

