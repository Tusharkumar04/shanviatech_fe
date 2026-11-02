import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const projectModule: ModuleConfig = {
  key: 'project',
  apiBase: '/admin/project',
  kind: 'collection',
  title: 'Projects',
  singularLabel: 'Project',
  pluralLabel: 'Projects',
  description: 'Portfolio of delivered work and showcases.',
  icon: 'FolderKanban',
  routePath: 'project',
  idField: '_id',
  idParam: 'projectId',
  detailsBy: 'id',
  searchable: true,
  searchPlaceholder: 'Search projects…',
  primaryField: 'title',
  imageField: 'image',
  countable: true,
  columns: [
    { key: 'image', label: 'Image', type: 'image' },
    { key: 'title', label: 'Title', type: 'text', sortable: true },
    { key: 'subtitle', label: 'Subtitle', type: 'truncate' },
    { key: 'order', label: 'Order', type: 'number', sortable: true },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true },
  ],
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
    { name: 'subtitle', type: 'text', label: 'Subtitle', colSpan: 2 },
    {
      name: 'image',
      type: 'image',
      label: 'Project image',
      required: true,
      uploadFolder: 'project/image',
    },
    {
      name: 'description',
      type: 'richtext',
      label: 'Description',
      required: true,
      colSpan: 2,
    },
    { name: 'order', type: 'number', label: 'Display order' },
    seoField(),
  ],
};
