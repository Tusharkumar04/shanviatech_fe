import type { ListParams } from '@/types/common';

/** Centralised React Query keys for cache coherence. */
export const queryKeys = {
  profile: ['profile'] as const,
  dashboard: ['dashboard'] as const,
  list: (moduleKey: string, params: ListParams) =>
    [moduleKey, 'list', params] as const,
  details: (moduleKey: string, id?: string) =>
    [moduleKey, 'details', id] as const,
  single: (moduleKey: string) => [moduleKey, 'single'] as const,
};
