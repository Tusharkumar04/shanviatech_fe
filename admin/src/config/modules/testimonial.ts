import type { ModuleConfig } from '../module-config';
import { seoField } from '../field-config';

export const testimonialModule: ModuleConfig = {
  key: 'testimonial',
  apiBase: '/admin/testimonial',
  kind: 'collection',
  title: 'Testimonials',
  singularLabel: 'Testimonial',
  pluralLabel: 'Testimonials',
  description: 'Client quotes and social proof.',
  icon: 'Quote',
  routePath: 'testimonial',
  idField: '_id',
  idParam: 'testimonialId',
  detailsBy: 'id',
  searchable: true,
  searchPlaceholder: 'Search testimonials…',
  primaryField: 'author_name',
  imageField: 'author_image',
  countable: true,
  columns: [
    { key: 'author_image', label: 'Author', type: 'image' },
    { key: 'author_name', label: 'Name', type: 'text', sortable: true },
    { key: 'author_location', label: 'Location', type: 'text' },
    { key: 'order', label: 'Order', type: 'number', sortable: true },
  ],
  fields: [
    {
      name: 'author_name',
      type: 'text',
      label: 'Author name',
      required: true,
    },
    { name: 'author_location', type: 'text', label: 'Author location' },
    {
      name: 'author_image',
      type: 'image',
      label: 'Author photo',
      uploadFolder: 'testimonial/image',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Testimonial',
      required: true,
      rows: 4,
      colSpan: 2,
    },
    { name: 'order', type: 'number', label: 'Display order' },
    seoField(),
  ],
};
