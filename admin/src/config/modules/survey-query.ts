import type { ModuleConfig } from '../module-config';

/**
 * Survey Query (chatbot question tree). The list/delete use the generic
 * resource pages; create/edit use a custom form page (custom-survey-query-form)
 * because the parent dropdown needs runtime options.
 */
export const surveyQueryModule: ModuleConfig = {
  key: 'survey-query',
  apiBase: '/admin/survey-query',
  kind: 'collection',
  title: 'Survey Queries',
  singularLabel: 'Survey Query',
  pluralLabel: 'Survey Queries',
  description: 'Author the chatbot survey question / category tree.',
  icon: 'ClipboardList',
  routePath: 'survey-query',
  idField: '_id',
  idParam: 'surveyQueryId',
  detailsBy: 'id',
  searchable: false,
  primaryField: 'name',
  countable: false,
  columns: [
    { key: 'sequence', label: 'Seq', type: 'number', sortable: true },
    { key: 'sub_sequence', label: 'Sub', type: 'number' },
    { key: 'name', label: 'Category', type: 'text' },
    { key: 'question', label: 'Question', type: 'truncate' },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true },
  ],
  fields: [],
};
