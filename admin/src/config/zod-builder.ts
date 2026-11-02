import { z } from 'zod';
import type { FieldConfig } from './field-config';

const REQUIRED = 'This field is required';

function leafSchema(field: FieldConfig): z.ZodTypeAny {
  const { type, required } = field;

  switch (type) {
    case 'email': {
      if (required) return z.string().min(1, REQUIRED).email('Invalid email');
      return z
        .string()
        .email('Invalid email')
        .or(z.literal(''))
        .optional();
    }
    case 'url': {
      if (required) return z.string().min(1, REQUIRED).url('Invalid URL');
      return z.string().url('Invalid URL').or(z.literal('')).optional();
    }
    case 'number': {
      const base = z.coerce.number({ invalid_type_error: 'Must be a number' });
      return required ? base : base.optional().or(z.nan().transform(() => undefined));
    }
    case 'switch':
      return z.boolean().optional().default(false);
    case 'date':
      return required ? z.string().min(1, REQUIRED) : z.string().optional();
    case 'tags':
    case 'string-list': {
      const arr = z.array(z.string());
      return required ? arr.min(1, REQUIRED) : arr.optional().default([]);
    }
    case 'image-list': {
      // Items are either an existing string URL or a freshly uploaded
      // `{ file, filename }` object, so validate loosely like a single image.
      const arr = z.array(z.any());
      return required ? arr.min(1, REQUIRED) : arr.optional().default([]);
    }
    case 'image':
      // string URL | { file } | null — validated loosely, required = truthy.
      return required
        ? z
            .any()
            .refine(
              (v) => Boolean(typeof v === 'string' ? v : v?.file),
              REQUIRED,
            )
        : z.any().optional().nullable();
    case 'text':
    case 'password':
    case 'textarea':
    case 'richtext':
    case 'slug':
    case 'select':
    default:
      return required ? z.string().min(1, REQUIRED) : z.string().optional();
  }
}

function fieldSchema(field: FieldConfig): z.ZodTypeAny {
  if (field.type === 'group' || field.type === 'seo') {
    const obj = buildSchema(field.fields ?? []);
    return field.required ? obj : obj.optional();
  }
  if (field.type === 'array') {
    const item = buildSchema(field.fields ?? []);
    const arr = z.array(item);
    return field.required ? arr.min(1, REQUIRED) : arr.optional().default([]);
  }
  return leafSchema(field);
}

/** Recursively build a Zod object schema from a list of field configs. */
export function buildSchema(fields: FieldConfig[]): z.ZodObject<z.ZodRawShape> {
  const shape: z.ZodRawShape = {};
  for (const field of fields) {
    if (field.hidden) continue;
    shape[field.name] = fieldSchema(field);
  }
  return z.object(shape);
}
