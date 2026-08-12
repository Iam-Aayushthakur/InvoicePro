import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../lib/api/api-client';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // Calls the /api/v1/auth/login endpoint on the backend
      const response = await apiClient.post<{ user: any; token: string; companyId?: string }>('/auth/login', credentials);
      return response;
    },
    onSuccess: (data) => {
      // Update the Zustand global state
      setAuth(data.user, data.token, data.companyId);
      // Navigate to dashboard
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: { fullName: string; companyName: string; email: string; password: string }) => {
      // Calls the /api/v1/auth/register endpoint on the backend
      const response = await apiClient.post<{ user: any; token: string; companyId?: string }>('/auth/register', payload);
      return response;
    },
    onSuccess: (data) => {
      // Automatically log the user in if the backend responds with a token
      if (data.token && data.user) {
        setAuth(data.user, data.token, data.companyId);
        router.push('/onboarding');
      } else {
        router.push('/login?registered=true');
      }
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Optionally call a backend /api/v1/auth/logout if it exists
      await apiClient.post('/auth/logout', {}).catch(() => {});
    },
    onSuccess: () => {
      logout();
      router.push('/login');
    },
  });
}
