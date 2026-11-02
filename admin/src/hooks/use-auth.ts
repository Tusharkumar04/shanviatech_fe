import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import type { LoginPayload, AuthUser } from '@/types/auth';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return { user, isAuthenticated };
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (res) => {
      const { accessToken, refreshToken, ...user } = res;
      setSession({ user: user as AuthUser, accessToken, refreshToken });
      toast.success('Signed in successfully');
      navigate('/', { replace: true });
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Unable to sign in'),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useCallback(() => {
    logout();
    qc.clear();
    navigate('/login', { replace: true });
    toast.success('Signed out');
  }, [logout, navigate, qc]);
}
