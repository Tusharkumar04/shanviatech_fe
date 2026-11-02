import { apiGet, apiPost } from '@/lib/api-client';
import type { ModuleConfig } from '@/config/module-config';
import type { EntityRecord } from '@/types/common';
import { mockStore } from '@/lib/mock/store';
import { withFallback } from './_fallback';

/**
 * Factory for single-document modules that use the
 * `POST /create-or-update` + `GET /details` convention.
 */
export function createSingleService(config: ModuleConfig) {
  const base = config.apiBase;

  return {
    config,

    get(): Promise<EntityRecord> {
      return withFallback(
        () => apiGet<EntityRecord>(`${base}/details`),
        () => mockStore.single(config),
      );
    },

    save(payload: Record<string, unknown>): Promise<EntityRecord> {
      return withFallback(
        () => apiPost<EntityRecord>(`${base}/create-or-update`, payload),
        () => mockStore.saveSingle(config, payload),
      );
    },
  };
}

export type SingleService = ReturnType<typeof createSingleService>;
