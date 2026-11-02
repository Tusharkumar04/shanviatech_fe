/**
 * Centralised, typed access to environment configuration.
 * The backend mounts admin routes under `${VITE_API_URL}/admin`.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1',
  /** Socket.IO server origin (survey chat). Defaults to the API host root. */
  socketUrl: import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001',
  enableMockFallback: import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true',
  isDev: import.meta.env.DEV,
} as const;
