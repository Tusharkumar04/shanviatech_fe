import { ApiError } from '@/lib/api-client';
import { env } from '@/lib/env';

/**
 * Run a live API call, transparently falling back to mock data when the
 * backend is unreachable and mock fallback is enabled. Non-network errors
 * (validation, auth, 404…) always propagate so the UI can react properly.
 */
export async function withFallback<T>(
  op: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  try {
    return await op();
  } catch (error) {
    if (
      env.enableMockFallback &&
      error instanceof ApiError &&
      error.isNetworkError
    ) {
      return fallback();
    }
    throw error;
  }
}
