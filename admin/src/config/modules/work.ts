import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const workModule: ModuleConfig = {
  key: 'work',
  apiBase: '/admin/work',
  kind: 'single',
  title: 'Work',
  singularLabel: 'Work Page',
  pluralLabel: 'Work Page',
  description: 'The "How we work" page content.',
  icon: 'Workflow',
  routePath: 'work',
  detailsBy: 'none',
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
    { name: 'points', type: 'string-list', label: 'Key points', colSpan: 2 },
    {
      name: 'image',
      type: 'image',
      label: 'Image',
      required: true,
      uploadFolder: 'work/image',
    },
    { name: 'button_title', type: 'text', label: 'Button label' },
    { name: 'link', type: 'text', label: 'Link URL' },
    {
      name: 'our_process',
      type: 'group',
      label: 'Our Process',
      colSpan: 2,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'icon', type: 'image', label: 'Icon' },
        { name: 'description', type: 'textarea', label: 'Description', rows: 3, colSpan: 2 , required:true},
        { name: 'order', type: 'number', label: 'Order' },
      ],
    },
    {
      name: 'our_methodology',
      type: 'group',
      label: 'Our Methodology',
      colSpan: 2,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'textarea', label: 'Description', rows: 3, colSpan: 2 , required:true},
        { name: 'order', type: 'number', label: 'Order' },
      ],
    },
    seoField(),
  ],
};
