import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const approachModule: ModuleConfig = {
  key: 'approach',
  apiBase: '/admin/approach',
  kind: 'single',
  title: 'Approach',
  singularLabel: 'Approach Page',
  pluralLabel: 'Approach Page',
  description: 'The company "Approach" page content.',
  icon: 'Compass',
  routePath: 'approach',
  detailsBy: 'none',
  formTabs: [
    {
      id: 'overview',
      label: 'Overview',
      fieldNames: ['title', 'subtitle', 'images', 'description', 'our_approach', 'our_mission'],
    },
    { id: 'why', label: 'Why Choose Us', fieldNames: ['why_choose_us'] },
    { id: 'craft', label: 'Technical Craft', fieldNames: ['technical_craft'] },
    { id: 'hiring', label: 'Hiring', fieldNames: ['hiring_impressive'] },
    { id: 'seo', label: 'SEO', fieldNames: ['metaInformation'] },
  ],
  fields: [
    { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
    { name: 'subtitle', type: 'text', label: 'Subtitle', required: true, colSpan: 2 },
    { name: 'images', type: 'image-list', label: 'Images', colSpan: 2 },
    { name: 'description', type: 'textarea', label: 'Description', rows: 3, colSpan: 2 },
    { name: 'our_approach', type: 'textarea', label: 'Our approach', rows: 3, colSpan: 2 },
    { name: 'our_mission', type: 'textarea', label: 'Our mission', rows: 3, colSpan: 2 },
    {
      name: 'why_choose_us',
      type: 'group',
      label: 'Why Choose Us',
      colSpan: 2,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
        { name: 'description', type: 'textarea', label: 'Description', required: true, rows: 3, colSpan: 2 },
        {
          name: 'highlights',
          type: 'array',
          label: 'Highlights',
          itemLabel: 'Highlight',
          colSpan: 2,
          fields: [
            { name: 'title', type: 'text', label: 'Title', required: true },
            { name: 'logo', type: 'image', label: 'Logo', required: true },
            { name: 'description', type: 'textarea', label: 'Description', required: true, rows: 2, colSpan: 2 },
          ],
        },
      ],
    },
    {
      name: 'technical_craft',
      type: 'group',
      label: 'Technical Craft',
      colSpan: 2,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true, colSpan: 2 },
        { name: 'description', type: 'textarea', label: 'Description', required: true, rows: 3, colSpan: 2 },
        {
          name: 'highlights',
          type: 'array',
          label: 'Highlights',
          itemLabel: 'Highlight',
          colSpan: 2,
          fields: [
            { name: 'title', type: 'text', label: 'Title', required: true },
            { name: 'logo', type: 'image', label: 'Logo', required: true },
          ],
        },
      ],
    },
    {
      name: 'hiring_impressive',
      type: 'group',
      label: 'Hiring',
      colSpan: 2,
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'subtitle', type: 'text', label: 'Subtitle', required: true },
        { name: 'image', type: 'image', label: 'Image', required: true },
        { name: 'button_title', type: 'text', label: 'Button label' },
        { name: 'link', type: 'text', label: 'Link URL' },
      ],
    },
    seoField(),
  ],
};
