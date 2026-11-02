import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const domainExpertiseModule: ModuleConfig = {
  key: 'domain-expertise',
  apiBase: '/admin/domain-expertise',
  kind: 'collection',
  title: 'Domain Expertise',
  singularLabel: 'Domain Expertise',
  pluralLabel: 'Domain Expertise',
  description: 'Industries and domains the company specialises in.',
  icon: 'Layers',
  routePath: 'domain-expertise',
  idField: '_id',
  idParam: 'domainExpertiseId',
  detailsBy: 'id',
  searchable: true,
  searchPlaceholder: 'Search domains…',
  primaryField: 'title',
  imageField: 'image',
  countable: true,
  columns: [
    { key: 'image', label: 'Image', type: 'image' },
    { key: 'title', label: 'Title', type: 'text', sortable: true },
    { key: 'order', label: 'Order', type: 'number', sortable: true },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true },
  ],
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
    {
      name: 'image',
      type: 'image',
      label: 'Image',
      required: true,
      uploadFolder: 'domain-expertise/image',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      rows: 4,
      colSpan: 2,
    },
    { name: 'order', type: 'number', label: 'Display order' },
    seoField(),
  ],
};
