/** SEO / Open Graph metadata attached to most documents. */
export interface MetaInformation {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  slug?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

/** Common fields present on every persisted document. */
export interface BaseEntity {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  metaInformation?: MetaInformation;
}

/**
 * An image field is either an absolute URL (existing, unchanged) or an
 * upload envelope `{ file, filename }` the backend turns into a stored path.
 */
export type ImageValue =
  | string
  | { file: string; filename?: string }
  | null
  | undefined;

/** A generic record returned by collection endpoints. */
export type EntityRecord = BaseEntity & Record<string, unknown>;

export interface ListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: string | number | undefined;
}
