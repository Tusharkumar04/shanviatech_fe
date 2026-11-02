import { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import type { ModuleConfig } from '@/config/module-config';
import { useSaveSingle, useSingleDocument } from '@/hooks/use-single';
import {
  normalizePayloadForSubmit,
  valuesFromData,
} from '@/components/form/form-values';
import { ResourceForm } from '@/components/form/resource-form';
import { PageHeader } from '@/components/common/page-header';
import { SectionLoader } from '@/components/common/loaders';
import { Badge } from '@/components/ui/badge';

interface SinglePageEditorProps {
  config: ModuleConfig;
}

export function SinglePageEditor({ config }: SinglePageEditorProps) {
  // A 404 here simply means the document hasn't been created yet.
  const { data, isLoading, isFetched } = useSingleDocument(config);
  const saveMut = useSaveSingle(config);

  const defaultValues = useMemo(
    () => valuesFromData(config.fields, data ?? {}),
    [config.fields, data],
  );

  const exists = Boolean(data?._id);

  return (
    <div>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <Badge variant={exists ? 'success' : 'secondary'} className="gap-1.5">
            <ExternalLink className="h-3 w-3" />
            {exists ? 'Published' : 'Not created yet'}
          </Badge>
        }
      />

      {isLoading && !isFetched ? (
        <SectionLoader />
      ) : (
        <ResourceForm
          config={config}
          defaultValues={defaultValues}
          submitLabel={`Save ${config.title}`}
          submitting={saveMut.isPending}
          onSubmit={(values) =>
            saveMut.mutate(normalizePayloadForSubmit(config.fields, values))
          }
        />
      )}
    </div>
  );
}
