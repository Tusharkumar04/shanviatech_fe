import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import type { FieldConfig } from '@/config/field-config';
import type { ModuleConfig } from '@/config/module-config';
import { surveyQueryModule } from '@/config/modules/survey-query';
import { apiGet } from '@/lib/api-client';
import {
  useCreateResource,
  useResourceDetails,
  useUpdateResource,
} from '@/hooks/use-resource';
import {
  normalizePayloadForSubmit,
  valuesFromData,
} from '@/components/form/form-values';
import { ResourceForm } from '@/components/form/resource-form';
import { PageHeader } from '@/components/common/page-header';
import { SectionLoader } from '@/components/common/loaders';
import { Button } from '@/components/ui/button';

/** Sentinel select value for "no parent" (Radix Select forbids empty values). */
const ROOT = '__root__';

interface SurveyQueryRecord {
  _id: string;
  name?: string;
  question?: string;
  parent_category_id?: string | null;
}

const stripHtml = (html?: string) => (html || '').replace(/<[^>]*>/g, '').trim();

const optionLabel = (q: SurveyQueryRecord) =>
  q.name?.trim() || stripHtml(q.question).slice(0, 50) || q._id;

export function SurveyQueryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: parents = [] } = useQuery({
    queryKey: ['survey-query', 'parents'],
    queryFn: () => apiGet<SurveyQueryRecord[]>('/admin/survey-query/parents'),
  });

  const { data, isLoading } = useResourceDetails(surveyQueryModule, id, isEdit);

  // Build the field config at runtime so the parent dropdown carries live options.
  const fields = useMemo<FieldConfig[]>(() => {
    const parentOptions = [
      { label: '— None (root category) —', value: ROOT },
      ...parents
        .filter((p) => p._id !== id)
        .map((p) => ({ label: optionLabel(p), value: p._id })),
    ];

    return [
      { name: 'name', type: 'text', label: 'Category name', placeholder: 'e.g. Study Abroad' },
      {
        name: 'parent_category_id',
        type: 'select',
        label: 'Parent category',
        options: parentOptions,
        description: 'Leave as “None” for a top-level category.',
      },
      {
        name: 'question',
        type: 'textarea',
        label: 'Query / Greeting (HTML allowed)',
        rows: 3,
        colSpan: 2,
        placeholder: '<p>Hi [First Name], what are you looking for?</p>',
      },
      { name: 'sequence', type: 'number', label: 'Sequence', required: true },
      { name: 'sub_sequence', type: 'number', label: 'Sub sequence' },
      {
        name: 'form',
        type: 'array',
        label: 'User form request fields',
        itemLabel: 'Field',
        colSpan: 2,
        fields: [
          { name: 'label', type: 'text', label: 'Label', required: true },
          { name: 'is_required', type: 'switch', label: 'Required' },
        ],
      },
    ];
  }, [parents, id]);

  const formConfig = useMemo<ModuleConfig>(
    () => ({ ...surveyQueryModule, fields }),
    [fields],
  );

  const defaultValues = useMemo(() => {
    const values = valuesFromData(fields, isEdit ? data ?? {} : {});
    // Map a missing/empty parent to the ROOT sentinel for the Select.
    if (!values.parent_category_id) values.parent_category_id = ROOT;
    if (!isEdit && values.sequence === undefined) values.sequence = 0;
    return values;
  }, [fields, data, isEdit]);

  const createMut = useCreateResource(formConfig);
  const updateMut = useUpdateResource(formConfig);

  const backToList = () => navigate(`/${surveyQueryModule.routePath}`);

  const handleSubmit = (values: Record<string, unknown>) => {
    const payload = normalizePayloadForSubmit(fields, values);
    // Strip the ROOT sentinel so the backend stores null (top-level category).
    if (payload.parent_category_id === ROOT) delete payload.parent_category_id;
    if (isEdit) {
      updateMut.mutate({ id: String(data?._id ?? id), payload }, { onSuccess: backToList });
    } else {
      createMut.mutate(payload, { onSuccess: backToList });
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Survey Query' : 'New Survey Query'}
        description={surveyQueryModule.description}
        actions={
          <Button variant="outline" onClick={backToList}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      {isEdit && isLoading ? (
        <SectionLoader />
      ) : (
        <ResourceForm
          config={formConfig}
          defaultValues={defaultValues}
          submitLabel={isEdit ? 'Save changes' : 'Create Survey Query'}
          submitting={createMut.isPending || updateMut.isPending}
          onSubmit={handleSubmit}
          onCancel={backToList}
        />
      )}
    </div>
  );
}
