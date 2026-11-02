import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const technologyModule: ModuleConfig = {
  key: 'technology',
  apiBase: '/admin/technology',
  kind: 'collection',
  title: 'Technology',
  singularLabel: 'Technology',
  pluralLabel: 'Technologies',
  description: 'Tools, platforms and frameworks in the stack.',
  icon: 'Cpu',
  routePath: 'technology',
  idField: '_id',
  idParam: 'technologyId',
  detailsBy: 'id',
  searchable: true,
  searchPlaceholder: 'Search technologies…',
  primaryField: 'title',
  imageField: 'image',
  countable: true,
  columns: [
    { key: 'image', label: 'Logo', type: 'image' },
    { key: 'title', label: 'Title', type: 'text', sortable: true },
    { key: 'link', label: 'Link', type: 'truncate' },
    { key: 'order', label: 'Order', type: 'number', sortable: true },
  ],
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
    {
      name: 'image',
      type: 'image',
      label: 'Logo / image',
      required: true,
      uploadFolder: 'technology/image',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      rows: 3,
      colSpan: 2,
    },
    { name: 'button_title', type: 'text', label: 'Button label' },
    { name: 'link', type: 'url', label: 'Link URL' },
    { name: 'order', type: 'number', label: 'Display order' },
    seoField(),
  ],
};
