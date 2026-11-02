import type { ColumnConfig, FieldConfig } from './field-config';

export type ModuleKind = 'collection' | 'single';

/** What the GET `/details/:x` route keys on. */
export type DetailsBy = 'id' | 'slug' | 'type' | 'none';

/** Optional tabbed grouping of form fields (e.g. Content / Media / SEO). */
export interface FormTab {
  id: string;
  label: string;
  /** Names of top-level fields that belong to this tab. */
  fieldNames: string[];
}

/**
 * Single source of truth for a CMS module. Drives the sidebar, routes,
 * list table, create/edit form, validation and details view.
 */
export interface ModuleConfig {
  /** Stable unique key, e.g. `blog`. Used in routes and query keys. */
  key: string;
  /** API base relative to VITE_API_URL, e.g. `/admin/blog`. */
  apiBase: string;
  kind: ModuleKind;

  title: string;
  singularLabel: string;
  pluralLabel: string;
  description?: string;
  /** lucide-react icon name. */
  icon: string;

  /** Route segment under the dashboard shell, e.g. `blog`. */
  routePath: string;

  // --- collection specifics ------------------------------------------------
  idField?: string;
  /** Path-param name used by PUT/DELETE, e.g. `blogId`. */
  idParam?: string;
  detailsBy?: DetailsBy;
  /** Field used to resolve details when `detailsBy` is slug/type. */
  detailsKey?: string;
  /**
   * Payload field that should be stamped with the currently signed-in user's
   * id on create (e.g. `author`). Skipped on edit so existing ownership stays.
   */
  authorField?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  columns?: ColumnConfig[];
  /** Fields shown in the read-only details panel (defaults to columns). */

  // --- shared --------------------------------------------------------------
  fields: FieldConfig[];
  formTabs?: FormTab[];

  primaryField?: string;
  imageField?: string;
  statusField?: string;
  /** Whether this module participates in the dashboard counts. */
  countable?: boolean;
}
