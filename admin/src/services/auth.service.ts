import { apiPost, ApiError } from '@/lib/api-client';
import type { LoginPayload, LoginResponse } from '@/types/auth';
import { env } from '@/lib/env';

const DEMO_USER: LoginResponse = {
  _id: 'demo-admin',
  name: 'Shanvia Admin',
  email: 'admin@shanviatech.com',
  role: 'admin',
  accessToken: 'demo.access.token',
  refreshToken: 'demo.refresh.token',
};

export const authService = {
  /**
   * POST /auth/login → `{ ...user, accessToken, refreshToken }`.
   * Falls back to a demo session if the backend is offline and mock mode is on.
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      return await apiPost<LoginResponse>('/auth/login', payload);
    } catch (error) {
      // Only fall back to a demo session when the backend is unreachable —
      // genuine rejections (wrong credentials, etc.) must surface to the user.
      if (
        env.enableMockFallback &&
        error instanceof ApiError &&
        error.isNetworkError
      ) {
        return { ...DEMO_USER, email: payload.email };
      }
      throw error;
    }
  },
};
