import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ModuleConfig } from '@/config/module-config';
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
import { useAuthStore } from '@/store/auth-store';
import { PageHeader } from '@/components/common/page-header';
import { SectionLoader } from '@/components/common/loaders';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';

interface ResourceFormPageProps {
  config: ModuleConfig;
}

export function ResourceFormPage({ config }: ResourceFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data, isLoading, isError, error } = useResourceDetails(
    config,
    id,
    isEdit,
  );
  const createMut = useCreateResource(config);
  const updateMut = useUpdateResource(config);
  const currentUser = useAuthStore((s) => s.user);

  const defaultValues = useMemo(
    () => valuesFromData(config.fields, isEdit ? data ?? {} : {}),
    [config.fields, data, isEdit],
  );

  const backToList = () => navigate(`/${config.routePath}`);

  const handleSubmit = (values: Record<string, unknown>) => {
    const payload = normalizePayloadForSubmit(config.fields, values);

    // Stamp the signed-in user's id onto the configured author field
    // for both create and update.
    if (config.authorField) {
      const authorId = currentUser?.id ?? currentUser?._id;
      if (authorId) payload[config.authorField] = authorId;
    }

    if (isEdit) {
      const recordId = String(data?._id ?? id);
      updateMut.mutate(
        { id: recordId, payload },
        { onSuccess: backToList },
      );
    } else {
      createMut.mutate(payload, { onSuccess: backToList });
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? `Edit ${config.singularLabel}` : `New ${config.singularLabel}`}
        description={config.description}
        actions={
          <Button variant="outline" onClick={backToList}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      {isEdit && isLoading ? (
        <SectionLoader />
      ) : isEdit && isError ? (
        <EmptyState
          icon="TriangleAlert"
          title="Could not load record"
          description={(error as Error)?.message}
          action={<Button onClick={backToList}>Back to list</Button>}
        />
      ) : (
        <ResourceForm
          config={config}
          defaultValues={defaultValues}
          submitLabel={isEdit ? 'Save changes' : `Create ${config.singularLabel}`}
          submitting={createMut.isPending || updateMut.isPending}
          onSubmit={handleSubmit}
          onCancel={backToList}
        />
      )}
    </div>
  );
}
