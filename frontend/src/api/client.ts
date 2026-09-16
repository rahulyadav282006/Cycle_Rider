const API_BASE_URL = ((import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://127.0.0.1:8000';

export interface APIError {
  code: string;
  message: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  error?: APIError;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('ridetrack_access_token');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('ridetrack_refresh_token');
}

export function getStoredUser(): any | null {
  const userJson = localStorage.getItem('ridetrack_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setAuthSession(accessToken: string, refreshToken: string, user: any) {
  localStorage.setItem('ridetrack_access_token', accessToken);
  localStorage.setItem('ridetrack_refresh_token', refreshToken);
  localStorage.setItem('ridetrack_user', JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem('ridetrack_access_token');
  localStorage.removeItem('ridetrack_refresh_token');
  localStorage.removeItem('ridetrack_user');
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr: any) {
    throw {
      code: 'NETWORK_ERROR',
      message: networkErr.message || 'Unable to connect to server. Please check your internet connection.',
    } as APIError;
  }

  if (response.status === 401) {
    // If unauthorized, clear auth and notify listeners
    clearAuthSession();
    window.dispatchEvent(new CustomEvent('ridetrack_auth_unauthorized'));
  }

  // If response is a blob/file download
  const contentType = response.headers.get('content-type');
  if (contentType && (contentType.includes('text/csv') || contentType.includes('application/octet-stream'))) {
    const blob = await response.blob();
    return blob as unknown as T;
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw {
        code: `HTTP_${response.status}`,
        message: response.statusText || 'Server error',
      } as APIError;
    }
    return {} as T;
  }

  if (!response.ok || data.success === false) {
    const err = data.error || { code: `HTTP_${response.status}`, message: 'Request failed' };
    throw err as APIError;
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
