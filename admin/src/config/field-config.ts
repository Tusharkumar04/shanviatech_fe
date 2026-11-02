import type { BadgeProps } from '@/components/ui/badge';

/** Every input the generic form builder knows how to render. */
export type FieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'password'
  | 'number'
  | 'textarea'
  | 'richtext'
  | 'date'
  | 'slug'
  | 'select'
  | 'switch'
  | 'image'
  | 'image-list'
  | 'tags'
  | 'string-list'
  | 'group'
  | 'array'
  | 'seo';

export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Declarative description of a single form field. Groups and arrays nest
 * `fields`, so a whole page form (however deep) is just data.
 */
export interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  /** Column span inside the 2-column responsive grid. */
  colSpan?: 1 | 2;
  /** Rendered in the form but excluded from validation / submit. */
  hidden?: boolean;
  defaultValue?: unknown;
  /** `select` options. */
  options?: SelectOption[];
  /** `slug` source sibling field (auto-generates while empty/untouched). */
  from?: string;
  /** Children for `group` / `array` / `seo`. */
  fields?: FieldConfig[];
  /** Label for each `array` row, e.g. "Member". */
  itemLabel?: string;
  rows?: number;
  min?: number;
  max?: number;
  /** Upload subfolder hint shown to the user. */
  uploadFolder?: string;
  /** `image` upload: HTML accept filter, e.g. `application/pdf`. */
  accept?: string;
  /** `image` upload: max file size in megabytes. */
  maxSizeMb?: number;
}

export type ColumnType =
  | 'text'
  | 'truncate'
  | 'image'
  | 'badge'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'number';

/** Declarative table column. Configs stay JSX-free; rendering lives in DataTable. */
export interface ColumnConfig {
  key: string;
  label: string;
  type?: ColumnType;
  sortable?: boolean;
  className?: string;
  /** Map a status string to a badge variant, e.g. { pending: 'warning' }. */
  badgeMap?: Record<string, BadgeProps['variant']>;
  /** Prettify enum-like values (snake_case → "Snake Case"). */
  humanize?: boolean;
}

/** Convenience builder for the shared SEO / metaInformation field block. */
export function seoField(name = 'metaInformation'): FieldConfig {
  return {
    name,
    type: 'seo',
    label: 'SEO & Metadata',
    fields: [
      { name: 'meta_title', type: 'text', label: 'Meta title', colSpan: 2 },
      {
        name: 'meta_description',
        type: 'textarea',
        label: 'Meta description',
        rows: 3,
        colSpan: 2,
      },
      {
        name: 'meta_keywords',
        type: 'tags',
        label: 'Meta keywords',
        placeholder: 'Type a keyword and press Enter',
        colSpan: 2,
      },
      { name: 'slug', type: 'text', label: 'Canonical slug', colSpan: 2 },
      { name: 'og_title', type: 'text', label: 'OG title' },
      { name: 'og_image', type: 'image', label: 'OG image' },
      {
        name: 'og_description',
        type: 'textarea',
        label: 'OG description',
        rows: 2,
        colSpan: 2,
      },
    ],
  };
}
