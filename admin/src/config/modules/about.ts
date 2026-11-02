import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const aboutModule: ModuleConfig = {
  key: 'about',
  apiBase: '/admin/about',
  kind: 'single',
  title: 'About',
  singularLabel: 'About Page',
  pluralLabel: 'About Page',
  description: 'The company "About" page content.',
  icon: 'Info',
  routePath: 'about',
  detailsBy: 'none',
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
    { name: 'subtitle', type: 'text', label: 'Subtitle', required: true, colSpan: 2 },
    {
      name: 'description',
      type: 'richtext',
      label: 'Description',
      required: true,
      colSpan: 2,
    },
    {
      name: 'our_journey',
      type: 'array',
      label: 'Our Journey',
      itemLabel: 'Milestone',
      colSpan: 2,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'subtitle', type: 'text', label: 'Subtitle', required: true },
        { name: 'year', type: 'number', label: 'Year' },
        { name: 'description', type: 'textarea', label: 'Description', rows: 3, colSpan: 2 },
        { name: 'order', type: 'number', label: 'Order' },
      ],
    },
    seoField(),
  ],
};
