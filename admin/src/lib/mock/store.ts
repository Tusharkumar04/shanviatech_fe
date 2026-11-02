import type { ModuleConfig } from '@/config/module-config';
import type { EntityRecord, ListParams } from '@/types/common';
import type { PaginatedData } from '@/lib/api-client';
import { collectionModules } from '@/config/modules';
import { seedCollection, seedSingle } from './generator';
import { uid } from './faker';

const collections = new Map<string, EntityRecord[]>();
const singles = new Map<string, EntityRecord>();

function collectionFor(config: ModuleConfig): EntityRecord[] {
  if (!collections.has(config.key)) {
    collections.set(config.key, seedCollection(config));
  }
  return collections.get(config.key)!;
}

function matchesSearch(item: EntityRecord, search: string): boolean {
  const needle = search.toLowerCase();
  return Object.values(item).some(
    (v) => typeof v === 'string' && v.toLowerCase().includes(needle),
  );
}

export const mockStore = {
  list(config: ModuleConfig, params: ListParams = {}): PaginatedData<EntityRecord> {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.max(Number(params.limit) || 10, 1);
    const sort = params.sort || '-createdAt';
    const search = (params.search as string) || '';

    let items = [...collectionFor(config)];

    if (search) items = items.filter((i) => matchesSearch(i, search));

    const desc = sort.startsWith('-');
    const key = desc ? sort.slice(1) : sort;
    items.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av ?? '').localeCompare(String(bv ?? ''));
      return desc ? -cmp : cmp;
    });

    const total = items.length;
    const start = (page - 1) * limit;
    return {
      items: items.slice(start, start + limit),
      meta: { total, page, limit, totalPages: Math.max(Math.ceil(total / limit), 1) },
    };
  },

  details(config: ModuleConfig, idOrKey: string): EntityRecord {
    const items = collectionFor(config);
    const detailsKey = config.detailsKey;
    const found =
      items.find((i) => i._id === idOrKey) ||
      (detailsKey ? items.find((i) => i[detailsKey] === idOrKey) : undefined);
    if (!found) throw new Error('Mock record not found');
    return found;
  },

  create(config: ModuleConfig, payload: Record<string, unknown>): EntityRecord {
    const now = new Date().toISOString();
    const record: EntityRecord = {
      ...(payload as EntityRecord),
      _id: uid(config.key),
      createdAt: now,
      updatedAt: now,
    };
    collectionFor(config).unshift(record);
    return record;
  },

  update(config: ModuleConfig, id: string, payload: Record<string, unknown>): EntityRecord {
    const items = collectionFor(config);
    const index = items.findIndex((i) => i._id === id);
    if (index === -1) throw new Error('Mock record not found');
    items[index] = {
      ...items[index],
      ...payload,
      _id: id,
      updatedAt: new Date().toISOString(),
    };
    return items[index];
  },

  remove(config: ModuleConfig, id: string): EntityRecord {
    const items = collectionFor(config);
    const index = items.findIndex((i) => i._id === id);
    if (index === -1) throw new Error('Mock record not found');
    return items.splice(index, 1)[0];
  },

  single(config: ModuleConfig): EntityRecord {
    if (!singles.has(config.key)) singles.set(config.key, seedSingle(config));
    return singles.get(config.key)!;
  },

  saveSingle(config: ModuleConfig, payload: Record<string, unknown>): EntityRecord {
    const now = new Date().toISOString();
    const existing = singles.get(config.key);
    const record: EntityRecord = {
      ...(existing ?? ({} as EntityRecord)),
      ...(payload as EntityRecord),
      _id: existing?._id ?? uid(config.key),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    singles.set(config.key, record);
    return record;
  },

  counts(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const config of collectionModules) {
      if (config.countable) result[config.key] = collectionFor(config).length;
    }
    return result;
  },
};
