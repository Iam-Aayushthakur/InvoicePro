import { useAuthStore } from '../../stores/auth.store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1';

export class ApiError extends Error {
  constructor(public status: number, public message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { jwtToken, activeCompanyId, logout } = useAuthStore.getState();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (jwtToken) {
    headers.set('Authorization', `Bearer ${jwtToken}`);
  }
  
  if (activeCompanyId) {
    headers.set('x-company-id', activeCompanyId);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError(response.status, 'An unexpected error occurred');
    }
    throw new ApiError(response.status, errorData.message || 'API Error', errorData.code, errorData.details);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
