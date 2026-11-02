import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const productModule: ModuleConfig = {
  key: 'product',
  apiBase: '/admin/product',
  kind: 'collection',
  title: 'Products',
  singularLabel: 'Product',
  pluralLabel: 'Products',
  description: 'Products shown on the site.',
  icon: 'Package',
  routePath: 'product',
  idField: '_id',
  idParam: 'productId',
  detailsBy: 'id',
  searchable: true,
  searchPlaceholder: 'Search products…',
  primaryField: 'title',
  countable: true,
  columns: [
    { key: 'images', label: 'Image', type: 'image' },
    { key: 'title', label: 'Title', type: 'text', sortable: true },
    { key: 'subtitle', label: 'Subtitle', type: 'truncate' },
    { key: 'order', label: 'Order', type: 'number', sortable: true },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true },
  ],
  formTabs: [
    { id: 'content', label: 'Content', fieldNames: ['title', 'subtitle', 'description', 'images', 'key_features', 'order'] },
    { id: 'seo', label: 'SEO', fieldNames: ['metaInformation'] },
  ],
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
    { name: 'subtitle', type: 'text', label: 'Subtitle', colSpan: 2 },
    { name: 'images', type: 'image-list', label: 'Images', colSpan: 2 },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      rows: 6,
      colSpan: 2,
    },
    {
      name: 'key_features',
      type: 'string-list',
      label: 'Key features',
      placeholder: 'Type a feature and press Enter',
      colSpan: 2,
    },
    { name: 'order', type: 'number', label: 'Display order' },
    seoField(),
  ],
};