import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const leadershipModule: ModuleConfig = {
  key: 'leadership',
  apiBase: '/admin/leadership',
  kind: 'collection',
  title: 'Leadership',
  singularLabel: 'Leadership Section',
  pluralLabel: 'Leadership Sections',
  description: 'Leadership groups and their members.',
  icon: 'Users',
  routePath: 'leadership',
  idField: '_id',
  idParam: 'leadershipId',
  detailsBy: 'id',
  searchable: true,
  searchPlaceholder: 'Search leadership…',
  primaryField: 'title',
  countable: true,
  columns: [
    { key: 'title', label: 'Title', type: 'text', sortable: true },
    { key: 'subtitle', label: 'Subtitle', type: 'truncate' },
    { key: 'order', label: 'Order', type: 'number', sortable: true },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true },
  ],
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true },
    { name: 'subtitle', type: 'text', label: 'Subtitle', required: true },
    { name: 'order', type: 'number', label: 'Display order' },
    {
      name: 'members',
      type: 'array',
      label: 'Members',
      itemLabel: 'Member',
      colSpan: 2,
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true },
        {
          name: 'designation',
          type: 'text',
          label: 'Designation',
          required: true,
        },
        {
          name: 'qualification',
          type: 'text',
          label: 'Qualification',
          required: true,
        },
        {
          name: 'image',
          type: 'image',
          label: 'Photo',
          uploadFolder: 'leadership/image',
        },
        { name: 'order', type: 'number', label: 'Order' },
      ],
    },
    seoField(),
  ],
};
