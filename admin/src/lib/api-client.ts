import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';
import { env } from './env';
import { storage } from './storage';

/** Standard response envelope used by every backend endpoint. */
export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

/** Paginated list payload returned under `data` by `/list` endpoints. */
export interface PaginatedData<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Normalised error thrown by the API helpers. */
export class ApiError extends Error {
  status: number;
  data: unknown;
  isNetworkError: boolean;

  constructor(
    message: string,
    status: number,
    data: unknown = null,
    isNetworkError = false,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;
  }
}

/** Event name dispatched when the API returns 401 so the app can log out. */
export const UNAUTHORIZED_EVENT = 'sv:unauthorized';

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// --- Request interceptor: attach the bearer token --------------------------
apiClient.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  if (token) {
    config.headers.set?.('Authorization', `Bearer ${token}`);
  }
  return config;
});

// --- Response interceptor: normalise errors + handle auth expiry -----------
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      storage.clear();
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }

    const isNetworkError = !error.response;
    const message =
      error.response?.data?.message ||
      (isNetworkError
        ? 'Network error — the server is unreachable.'
        : error.message) ||
      'Something went wrong.';

    return Promise.reject(
      new ApiError(
        message,
        error.response?.status ?? 0,
        error.response?.data ?? null,
        isNetworkError,
      ),
    );
  },
);

// --- Typed helpers that unwrap the `{ code, message, data }` envelope ------
export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.get<ApiEnvelope<T>>(url, config);
  return res.data.data;
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.post<ApiEnvelope<T>>(url, body, config);
  return res.data.data;
}

export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.put<ApiEnvelope<T>>(url, body, config);
  return res.data.data;
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.patch<ApiEnvelope<T>>(url, body, config);
  return res.data.data;
}

export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.delete<ApiEnvelope<T>>(url, config);
  return res.data.data;
}
