import { Controller, useFormContext } from 'react-hook-form';
import type { FieldConfig } from '@/config/field-config';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldShell } from './field-shell';
import { RichTextEditor } from './rich-text-editor';
import { ImageUpload } from './image-upload';
import { ImageList } from './image-list';
import { TagsInput } from './tags-input';
import { StringList } from './string-list';
import type { ImageValue } from '@/types/common';

interface FormFieldProps {
  field: FieldConfig;
  name: string;
}

/** Renders one leaf field, wired to react-hook-form via Controller. */
export function FormField({ field, name }: FormFieldProps) {
  const { control } = useFormContext();
  const id = name;

  // Boolean switch uses its own inline layout.
  if (field.type === 'switch') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: f }) => (
          <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
            <div className="space-y-0.5">
              <Label htmlFor={id}>{field.label}</Label>
              {field.description && (
                <p className="text-xs text-muted-foreground">
                  {field.description}
                </p>
              )}
            </div>
            <Switch
              id={id}
              checked={Boolean(f.value)}
              onCheckedChange={f.onChange}
            />
          </div>
        )}
      />
    );
  }

  return (
    <FieldShell
      name={name}
      label={field.label}
      description={field.description}
      required={field.required}
      htmlFor={id}
    >
      <Controller
        name={name}
        control={control}
        render={({ field: f }) => {
          switch (field.type) {
            case 'textarea':
              return (
                <Textarea
                  id={id}
                  rows={field.rows ?? 3}
                  placeholder={field.placeholder}
                  value={(f.value as string) ?? ''}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                />
              );
            case 'richtext':
              return (
                <RichTextEditor
                  id={id}
                  value={(f.value as string) ?? ''}
                  onChange={f.onChange}
                  placeholder={field.placeholder}
                />
              );
            case 'select':
              return (
                <Select
                  value={(f.value as string) ?? ''}
                  onValueChange={f.onChange}
                >
                  <SelectTrigger id={id}>
                    <SelectValue
                      placeholder={field.placeholder || 'Select an option'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            case 'image':
              return (
                <ImageUpload
                  id={id}
                  value={f.value as ImageValue}
                  onChange={f.onChange}
                  accept={field.accept}
                  maxSizeMb={field.maxSizeMb}
                />
              );
            case 'image-list':
              return (
                <ImageList
                  value={(f.value as ImageValue[]) ?? []}
                  onChange={f.onChange}
                />
              );
            case 'tags':
              return (
                <TagsInput
                  id={id}
                  value={(f.value as string[]) ?? []}
                  onChange={f.onChange}
                  placeholder={field.placeholder}
                />
              );
            case 'string-list':
              return (
                <StringList
                  value={(f.value as string[]) ?? []}
                  onChange={f.onChange}
                  placeholder={field.placeholder}
                />
              );
            case 'number':
              return (
                <Input
                  id={id}
                  type="number"
                  placeholder={field.placeholder}
                  value={
                    f.value === undefined || f.value === null
                      ? ''
                      : (f.value as number)
                  }
                  onChange={(e) =>
                    f.onChange(
                      e.target.value === '' ? undefined : Number(e.target.value),
                    )
                  }
                  onBlur={f.onBlur}
                />
              );
            case 'date':
              return (
                <Input
                  id={id}
                  type="date"
                  value={
                    typeof f.value === 'string' ? f.value.slice(0, 10) : ''
                  }
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                />
              );
            case 'email':
            case 'url':
            case 'password':
            case 'slug':
            case 'text':
            default:
              return (
                <Input
                  id={id}
                  type={
                    field.type === 'email'
                      ? 'email'
                      : field.type === 'password'
                        ? 'password'
                        : field.type === 'url'
                          ? 'url'
                          : 'text'
                  }
                  placeholder={field.placeholder}
                  value={(f.value as string) ?? ''}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                />
              );
          }
        }}
      />
    </FieldShell>
  );
}
