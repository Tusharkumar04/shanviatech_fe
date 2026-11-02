import { useFieldArray, useFormContext } from 'react-hook-form';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { FieldConfig } from '@/config/field-config';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FormField } from './form-field';
import { SeoFields } from './seo-fields';
import { defaultsForFields } from './form-values';

const FULL_WIDTH_TYPES = new Set<FieldConfig['type']>([
  'group',
  'array',
  'seo',
  'richtext',
  'image-list',
  'string-list',
]);

function fullName(prefix: string | undefined, name: string): string {
  return prefix ? `${prefix}.${name}` : name;
}

function spanFor(field: FieldConfig): 1 | 2 {
  return field.colSpan ?? (FULL_WIDTH_TYPES.has(field.type) ? 2 : 1);
}

/** Renders a list of fields into a responsive 2-column grid. */
export function FormBuilder({
  fields,
  prefix,
}: {
  fields: FieldConfig[];
  prefix?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {fields
        .filter((field) => !field.hidden)
        .map((field) => (
          <FieldRenderer key={field.name} field={field} prefix={prefix} />
        ))}
    </div>
  );
}

function FieldRenderer({
  field,
  prefix,
}: {
  field: FieldConfig;
  prefix?: string;
}) {
  const name = fullName(prefix, field.name);
  const span = spanFor(field);

  let node;
  if (field.type === 'group') node = <FieldGroup field={field} name={name} />;
  else if (field.type === 'seo') node = <SeoFields field={field} name={name} />;
  else if (field.type === 'array') node = <FieldArray field={field} name={name} />;
  else node = <FormField field={field} name={name} />;

  return <div className={cn(span === 2 && 'md:col-span-2')}>{node}</div>;
}

function FieldGroup({ field, name }: { field: FieldConfig; name: string }) {
  return (
    <Card className="border-dashed bg-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{field.label}</CardTitle>
        {field.description && (
          <CardDescription>{field.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <FormBuilder fields={field.fields ?? []} prefix={name} />
      </CardContent>
    </Card>
  );
}

function FieldArray({ field, name }: { field: FieldConfig; name: string }) {
  const { control } = useFormContext();
  const { fields: rows, append, remove, move } = useFieldArray({ control, name });
  const itemLabel = field.itemLabel ?? 'Item';

  return (
    <Card className="border-dashed bg-muted/20">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-0.5">
          <CardTitle className="text-sm">
            {field.label}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {rows.length} {rows.length === 1 ? 'item' : 'items'}
            </span>
          </CardTitle>
          {field.description && (
            <CardDescription>{field.description}</CardDescription>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(defaultsForFields(field.fields ?? []))}
        >
          <Plus className="h-4 w-4" />
          Add {itemLabel}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            No {itemLabel.toLowerCase()}s yet. Click “Add {itemLabel}”.
          </p>
        )}
        {rows.map((row, index) => (
          <div key={row.id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {itemLabel} {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === rows.length - 1}
                  onClick={() => move(index, index + 1)}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <FormBuilder
              fields={field.fields ?? []}
              prefix={`${name}.${index}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
