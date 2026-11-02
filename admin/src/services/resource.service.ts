import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import type { PaginatedData } from '@/lib/api-client';
import type { ModuleConfig } from '@/config/module-config';
import type { EntityRecord, ListParams } from '@/types/common';
import { mockStore } from '@/lib/mock/store';
import { withFallback } from './_fallback';

/**
 * Factory producing a typed CRUD service for any collection module.
 * Each method transparently falls back to the in-memory mock store when the
 * backend is offline (and mock mode is enabled).
 */
export function createResourceService(config: ModuleConfig) {
  const base = config.apiBase;

  return {
    config,

    list(params: ListParams = {}): Promise<PaginatedData<EntityRecord>> {
      return withFallback(
        () => apiGet<PaginatedData<EntityRecord>>(`${base}/list`, { params }),
        () => mockStore.list(config, params),
      );
    },

    details(idOrKey: string): Promise<EntityRecord> {
      return withFallback(
        () =>
          apiGet<EntityRecord>(
            `${base}/details/${encodeURIComponent(idOrKey)}`,
          ),
        () => mockStore.details(config, idOrKey),
      );
    },

    create(payload: Record<string, unknown>): Promise<EntityRecord> {
      return withFallback(
        () => apiPost<EntityRecord>(base, payload),
        () => mockStore.create(config, payload),
      );
    },

    update(id: string, payload: Record<string, unknown>): Promise<EntityRecord> {
      return withFallback(
        () => apiPut<EntityRecord>(`${base}/${id}`, payload),
        () => mockStore.update(config, id, payload),
      );
    },

    remove(id: string): Promise<EntityRecord> {
      return withFallback(
        () => apiDelete<EntityRecord>(`${base}/${id}`),
        () => mockStore.remove(config, id),
      );
    },
  };
}

export type ResourceService = ReturnType<typeof createResourceService>;
