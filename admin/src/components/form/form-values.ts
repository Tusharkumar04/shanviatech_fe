import type { FieldConfig } from '@/config/field-config';

/** A blank, correctly-shaped default value for a single field. */
export function defaultValueForField(field: FieldConfig): unknown {
  switch (field.type) {
    case 'switch':
      return false;
    case 'tags':
    case 'string-list':
    case 'image-list':
    case 'array':
      return [];
    case 'number':
      return undefined;
    case 'group':
    case 'seo':
      return defaultsForFields(field.fields ?? []);
    case 'image':
      return null;
    default:
      return '';
  }
}

/** Blank default object for a list of fields (create mode + new array rows). */
export function defaultsForFields(
  fields: FieldConfig[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.hidden) continue;
    out[field.name] = defaultValueForField(field);
  }
  return out;
}

/** Coerce a fetched value into the shape the form expects for a field. */
export function valueFromData(field: FieldConfig, data: unknown): unknown {
  const raw =
    data && typeof data === 'object'
      ? (data as Record<string, unknown>)[field.name]
      : undefined;

  switch (field.type) {
    case 'group':
    case 'seo':
      return valuesFromData(field.fields ?? [], raw ?? {});
    case 'array':
      return Array.isArray(raw)
        ? raw.map((item) => valuesFromData(field.fields ?? [], item ?? {}))
        : [];
    case 'switch':
      return Boolean(raw);
    case 'tags':
    case 'string-list':
    case 'image-list':
      return Array.isArray(raw) ? raw : [];
    case 'image':
      return raw ?? null;
    case 'number':
      if (typeof raw === 'number') return raw;
      return raw === undefined || raw === null || raw === ''
        ? undefined
        : Number(raw);
    case 'date':
      return typeof raw === 'string' ? raw : '';
    default:
      return raw ?? '';
  }
}

/** Build a full RHF value object from fetched data, scoped to the config. */
export function valuesFromData(
  fields: FieldConfig[],
  data: unknown,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.hidden) continue;
    out[field.name] = valueFromData(field, data);
  }
  return out;
}

/**
 * Wrap any image value into the `{ file, filename? }` object shape that the
 * backend Joi validators (`createOrUpdateFileInput`) expect.
 *
 * - `{ file: <dataURL>, filename }` — new upload → passes through unchanged.
 * - `"https://…/some.jpg"` — existing URL → wrapped as `{ file: <url> }`.
 *   The backend's `uploadOriginalFile` returns `data.file` unchanged when no
 *   `filename` is present, so the stored URL round-trips safely.
 * - `null` / `undefined` / `""` — left as-is so required validation can still
 *   surface a clear error and optional images are simply omitted.
 */
function normalizeImageValue(value: unknown): unknown {
  if (value && typeof value === 'object' && 'file' in (value as object)) {
    return value;
  }
  if (typeof value === 'string' && value) return { file: value };
  return value;
}

/**
 * Decide whether a leaf value should be sent. Joi's defaults are strict:
 *   - `Joi.string()` rejects `""` (you'd need `.allow('')` to permit it)
 *   - `Joi.number()` rejects `NaN`
 *   - `Joi.object()` for nested groups rejects `{}` when it has required keys
 *
 * To stay compatible we strip empty leaves entirely (so the key isn't sent),
 * and the caller drops whole groups/arrays when nothing useful is left.
 */
function cleanLeaf(
  field: FieldConfig,
  value: unknown,
): { keep: boolean; value: unknown } {
  switch (field.type) {
    case 'image':
      if (value == null || value === '') return { keep: false, value: null };
      return { keep: true, value: normalizeImageValue(value) };

    case 'image-list': {
      if (!Array.isArray(value) || value.length === 0) {
        return { keep: false, value: [] };
      }
      const mapped = value
        .map(normalizeImageValue)
        .filter((v) => v != null && v !== '');
      return mapped.length > 0
        ? { keep: true, value: mapped }
        : { keep: false, value: [] };
    }

    case 'tags':
    case 'string-list': {
      if (!Array.isArray(value)) return { keep: false, value: [] };
      const filtered = value.filter(
        (v) => typeof v === 'string' && v.trim() !== '',
      );
      return filtered.length > 0
        ? { keep: true, value: filtered }
        : { keep: false, value: [] };
    }

    case 'number': {
      if (value === undefined || value === null || value === '') {
        return { keep: false, value: undefined };
      }
      const num = typeof value === 'number' ? value : Number(value);
      return Number.isNaN(num)
        ? { keep: false, value: undefined }
        : { keep: true, value: num };
    }

    case 'switch':
      // Booleans are always defined; send as-is.
      return { keep: true, value: Boolean(value) };

    case 'date':
    case 'select':
    case 'text':
    case 'email':
    case 'url':
    case 'password':
    case 'slug':
    case 'textarea':
    case 'richtext':
    default: {
      if (value == null) return { keep: false, value: '' };
      if (typeof value === 'string' && value.trim() === '') {
        return { keep: false, value: '' };
      }
      return { keep: true, value };
    }
  }
}

/**
 * Walk the field tree producing a payload that:
 *   1. Wraps existing image URLs as `{ file: url }` for `createOrUpdateFileInput`.
 *   2. Strips empty strings / nulls / NaN / empty arrays on optional leaves.
 *   3. Omits any group or array item that ends up entirely empty, so untouched
 *      sections (e.g. `our_approach: {}`) aren't sent and don't trigger Joi
 *      "required" errors on their nested fields.
 */
export function normalizePayloadForSubmit(
  fields: FieldConfig[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.hidden) continue;
    const raw = values?.[field.name];

    if (field.type === 'group' || field.type === 'seo') {
      const cleaned = normalizePayloadForSubmit(
        field.fields ?? [],
        (raw as Record<string, unknown>) ?? {},
      );
      if (Object.keys(cleaned).length > 0) {
        out[field.name] = cleaned;
      }
      continue;
    }

    if (field.type === 'array') {
      if (!Array.isArray(raw)) continue;
      const items = raw
        .map((item) =>
          normalizePayloadForSubmit(
            field.fields ?? [],
            (item as Record<string, unknown>) ?? {},
          ),
        )
        .filter((item) => Object.keys(item).length > 0);
      if (items.length > 0) out[field.name] = items;
      continue;
    }

    const { keep, value } = cleanLeaf(field, raw);
    if (keep) out[field.name] = value;
  }

  return out;
}
