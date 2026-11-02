import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import type { ModuleConfig } from '@/config/module-config';
import type { FieldConfig } from '@/config/field-config';
import type { EntityRecord, ImageValue } from '@/types/common';
import { useDeleteResource, useResourceDetails } from '@/hooks/use-resource';
import { PageHeader } from '@/components/common/page-header';
import { SectionLoader } from '@/components/common/loaders';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn, formatDate, formatDateTime, humanize } from '@/lib/utils';

function imgSrc(value: ImageValue): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && value.file) return value.file;
  return '';
}

function FieldValue({
  field,
  value,
}: {
  field: FieldConfig;
  value: unknown;
}) {
  if (value === undefined || value === null || value === '') {
    return <span className="text-muted-foreground">—</span>;
  }

  switch (field.type) {
    case 'image':
      return (
        <img
          src={imgSrc(value as ImageValue)}
          alt={field.label}
          className="h-32 w-auto rounded-lg border border-border object-cover"
        />
      );
    case 'image-list':
      return (
        <div className="flex flex-wrap gap-2">
          {(value as ImageValue[]).map((item, i) => (
            <img
              key={i}
              src={imgSrc(item)}
              alt=""
              className="h-20 w-28 rounded-md border border-border object-cover"
            />
          ))}
        </div>
      );
    case 'richtext':
      return (
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: String(value) }}
        />
      );
    case 'tags':
    case 'string-list':
      return (
        <div className="flex flex-wrap gap-1.5">
          {(value as string[]).map((item, i) => (
            <Badge key={i} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      );
    case 'switch':
      return (
        <Badge variant={value ? 'success' : 'secondary'}>
          {value ? 'Enabled' : 'Disabled'}
        </Badge>
      );
    case 'select': {
      const opt = field.options?.find((o) => o.value === value);
      return <Badge variant="outline">{opt?.label ?? humanize(String(value))}</Badge>;
    }
    case 'date':
      return <span>{formatDate(value as string)}</span>;
    case 'url':
      return (
        <a
          href={String(value)}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {String(value)}
        </a>
      );
    case 'group':
    case 'seo':
      return (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <FieldGrid
            fields={field.fields ?? []}
            data={(value as Record<string, unknown>) ?? {}}
          />
        </div>
      );
    case 'array':
      return (
        <div className="space-y-3">
          {(value as Record<string, unknown>[]).map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {field.itemLabel ?? 'Item'} {i + 1}
              </p>
              <FieldGrid fields={field.fields ?? []} data={item} />
            </div>
          ))}
        </div>
      );
    default:
      return <span className="whitespace-pre-line">{String(value)}</span>;
  }
}

function FieldGrid({
  fields,
  data,
}: {
  fields: FieldConfig[];
  data: Record<string, unknown>;
}) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {fields
        .filter((f) => !f.hidden)
        .map((field) => {
          const full = ['group', 'seo', 'array', 'richtext', 'image-list'].includes(
            field.type,
          );
          return (
            <div key={field.name} className={cn(full && 'sm:col-span-2')}>
              <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {field.label ?? humanize(field.name)}
              </dt>
              <dd className="text-sm">
                <FieldValue field={field} value={data[field.name]} />
              </dd>
            </div>
          );
        })}
    </dl>
  );
}

interface ResourceDetailsPageProps {
  config: ModuleConfig;
}

export function ResourceDetailsPage({ config }: ResourceDetailsPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useResourceDetails(config, id);
  const deleteMut = useDeleteResource(config);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const backToList = () => navigate(`/${config.routePath}`);

  if (isLoading) return <SectionLoader className="min-h-[50vh]" />;
  if (isError || !data) {
    return (
      <EmptyState
        icon="TriangleAlert"
        title="Record not found"
        description={(error as Error)?.message}
        action={<Button onClick={backToList}>Back to list</Button>}
      />
    );
  }

  const record = data as EntityRecord;
  const routeKey =
    config.detailsBy === 'slug'
      ? String(record.slug ?? record._id)
      : config.detailsBy === 'type'
        ? String(record.type ?? record._id)
        : String(record._id);
  const title = String(record[config.primaryField ?? 'title'] ?? config.singularLabel);
  const heroImage = config.imageField ? imgSrc(record[config.imageField] as ImageValue) : '';
  const statusValue = config.statusField ? record[config.statusField] : undefined;

  return (
    <div>
      <PageHeader
        title={title}
        description={config.singularLabel}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={backToList}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/${config.routePath}/${routeKey}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            {heroImage && (
              <img
                src={heroImage}
                alt={title}
                className="mb-6 h-56 w-full rounded-lg border border-border object-cover"
              />
            )}
            <FieldGrid fields={config.fields} data={record} />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {statusValue !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">{humanize(String(statusValue))}</Badge>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDateTime(record.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Updated</span>
              <span>{formatDateTime(record.updatedAt)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">ID</span>
              <span className="truncate font-mono text-xs">{record._id}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${title}?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={deleteMut.isPending}
        onConfirm={() =>
          deleteMut.mutate(String(record._id), { onSuccess: backToList })
        }
      />
    </div>
  );
}
