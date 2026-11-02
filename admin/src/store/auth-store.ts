import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True until we've attempted to restore the session on first load. */
  isHydrating: boolean;
  setSession: (params: {
    user: AuthUser;
    accessToken: string;
    refreshToken?: string;
  }) => void;
  setUser: (user: AuthUser) => void;
  setHydrating: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: storage.getUser<AuthUser>(),
  isAuthenticated: Boolean(storage.getAccessToken()),
  isHydrating: Boolean(storage.getAccessToken()),

  setSession: ({ user, accessToken, refreshToken }) => {
    storage.setTokens(accessToken, refreshToken);
    storage.setUser(user);
    set({ user, isAuthenticated: true, isHydrating: false });
  },

  setUser: (user) => {
    storage.setUser(user);
    set({ user });
  },

  setHydrating: (value) => set({ isHydrating: value }),

  logout: () => {
    storage.clear();
    set({ user: null, isAuthenticated: false, isHydrating: false });
  },
}));
