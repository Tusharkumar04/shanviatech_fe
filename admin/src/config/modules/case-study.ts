import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const caseStudyModule: ModuleConfig = {
  key: 'case-study',
  apiBase: '/admin/case-study',
  kind: 'collection',
  title: 'Case Studies',
  singularLabel: 'Case Study',
  pluralLabel: 'Case Studies',
  description: 'In-depth stories of customer outcomes.',
  icon: 'BookOpen',
  routePath: 'case-study',
  idField: '_id',
  idParam: 'caseStudyId',
  detailsBy: 'id',
  searchable: true,
  searchPlaceholder: 'Search case studies…',
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
      label: 'Cover image',
      required: true,
      uploadFolder: 'case-study/image',
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
