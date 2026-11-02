/** Thin, typed wrapper over localStorage for auth tokens + cached profile. */
const KEYS = {
  accessToken: 'sv_access_token',
  refreshToken: 'sv_refresh_token',
  user: 'sv_user',
  theme: 'sv_theme',
} as const;

export const storage = {
  getAccessToken: () => localStorage.getItem(KEYS.accessToken),
  getRefreshToken: () => localStorage.getItem(KEYS.refreshToken),
  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(KEYS.accessToken, accessToken);
    if (refreshToken) localStorage.setItem(KEYS.refreshToken, refreshToken);
  },
  getUser: <T>(): T | null => {
    const raw = localStorage.getItem(KEYS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setUser: (user: unknown) =>
    localStorage.setItem(KEYS.user, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem(KEYS.accessToken);
    localStorage.removeItem(KEYS.refreshToken);
    localStorage.removeItem(KEYS.user);
  },
} as const;

export const STORAGE_KEYS = KEYS;
