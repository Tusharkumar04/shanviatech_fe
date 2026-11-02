import type { FieldConfig } from '@/config/field-config';
import type { ModuleConfig } from '@/config/module-config';
import type { EntityRecord } from '@/types/common';
import { slugify } from '@/lib/utils';
import * as f from './faker';

function valueForField(field: FieldConfig, seed: string): unknown {
  const n = field.name;
  switch (field.type) {
    case 'text':
      if (/title|heading|subject/.test(n)) return f.titleCase(f.words(3));
      if (/name/.test(n)) return /author|candidate|member|person/.test(n) ? f.personName() : f.titleCase(f.words(2));
      if (/button/.test(n)) return 'Learn more';
      if (/location|city/.test(n)) return f.city();
      if (/state/.test(n)) return 'Karnataka';
      if (/country/.test(n)) return 'India';
      if (/version/.test(n)) return '1.0';
      if (/experience/.test(n)) return `${1 + Math.floor(Math.random() * 8)}+ years`;
      if (/salary/.test(n)) return '₹12L – ₹24L';
      if (/qualification/.test(n)) return 'B.Tech, M.Tech';
      if (/designation/.test(n)) return f.titleCase(f.words(2));
      if (/mobile/.test(n)) return f.mobile();
      if (/cin/.test(n)) return 'U72900KA2020PTC000000';
      if (/job_id/.test(n)) return f.uid('job');
      return f.titleCase(f.words(2));
    case 'email':
      return f.email();
    case 'url':
      return 'https://shanviatech.com';
    case 'password':
      return '';
    case 'number':
      if (/year/.test(n)) return 2018 + Math.floor(Math.random() * 7);
      if (/pin/.test(n)) return 560001;
      if (/lat/.test(n)) return 12.97;
      if (/long/.test(n)) return 77.59;
      return Math.floor(Math.random() * 12);
    case 'textarea':
      return f.paragraph();
    case 'richtext':
      return f.richParagraph();
    case 'date':
      return f.recentDate();
    case 'slug':
      return slugify(f.words(2));
    case 'select':
      return field.options?.length
        ? f.pick(field.options).value
        : '';
    case 'switch':
      return Math.random() > 0.5;
    case 'image':
      return /author|photo|avatar/.test(n) ? f.avatar(seed) : f.image(seed);
    case 'image-list':
      return [f.image(`${seed}-a`), f.image(`${seed}-b`)];
    case 'tags':
    case 'string-list':
      return [f.titleCase(f.words(2)), f.titleCase(f.words(2)), f.titleCase(f.words(3))];
    case 'group':
      return generateObject(field.fields ?? [], `${seed}-${n}`);
    case 'seo':
      return {
        meta_title: f.titleCase(f.words(4)),
        meta_description: f.sentence(),
        meta_keywords: [f.words(1), f.words(1), f.words(1)],
        slug: slugify(f.words(3)),
        og_title: f.titleCase(f.words(4)),
        og_description: f.sentence(),
        og_image: f.image(`${seed}-og`),
      };
    case 'array': {
      const count = 1 + Math.floor(Math.random() * 2);
      return Array.from({ length: count }, (_, i) =>
        generateObject(field.fields ?? [], `${seed}-${n}-${i}`),
      );
    }
    default:
      return '';
  }
}

function generateObject(fields: FieldConfig[], seed: string): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const field of fields) {
    obj[field.name] = valueForField(field, seed);
  }
  return obj;
}

/** Build one realistic-looking record for a module. */
export function generateItem(config: ModuleConfig, index: number): EntityRecord {
  const seed = `${config.key}-${index}`;
  const record = generateObject(config.fields, seed) as EntityRecord;
  record._id = f.uid(config.key);
  record.createdAt = f.recentDate();
  record.updatedAt = record.createdAt;
  if ('order' in record) record.order = index + 1;
  return record;
}

/** Seed a collection with `count` items. */
export function seedCollection(config: ModuleConfig, count = 14): EntityRecord[] {
  return Array.from({ length: count }, (_, i) => generateItem(config, i));
}

/** Seed a single-document module. */
export function seedSingle(config: ModuleConfig): EntityRecord {
  return generateItem(config, 0);
}
