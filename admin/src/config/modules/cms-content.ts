import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const cmsContentModule: ModuleConfig = {
  key: 'cms-content',
  apiBase: '/admin/cms-content',
  kind: 'single',
  title: 'CMS Content',
  singularLabel: 'CMS Content',
  pluralLabel: 'CMS Content',
  description: 'Shared CMS blocks (Reach us, Clients).',
  icon: 'LayoutTemplate',
  routePath: 'cms-content',
  detailsBy: 'none',
  fields: [
    {
      name: 'reach_us',
      type: 'group',
      label: 'Reach Us',
      colSpan: 2,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
        { name: 'image', type: 'image', label: 'Image', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true, rows: 3, colSpan: 2 },
        { name: 'button_title', type: 'text', label: 'Button label' },
        { name: 'link', type: 'url', label: 'Link URL' },
      ],
    },
    {
      name: 'client',
      type: 'group',
      label: 'Clients',
      colSpan: 2,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
        { name: 'image', type: 'image', label: 'Image', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true, rows: 3, colSpan: 2 },
        { name: 'key_points', type: 'string-list', label: 'Key points', colSpan: 2 },
        { name: 'button_title', type: 'text', label: 'Button label' },
        { name: 'link', type: 'url', label: 'Link URL' },
      ],
    },
    seoField(),
  ],
};
