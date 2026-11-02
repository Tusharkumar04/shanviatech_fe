import { useWatch, useFormContext } from 'react-hook-form';
import { Globe } from 'lucide-react';
import type { FieldConfig } from '@/config/field-config';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { truncate } from '@/lib/utils';
import { FormBuilder } from './form-builder';

interface SeoFieldsProps {
  field: FieldConfig;
  name: string;
}

/** SEO group with a live Google-style search preview. */
export function SeoFields({ field, name }: SeoFieldsProps) {
  const { control } = useFormContext();
  const meta = useWatch({ control, name }) as
    | Record<string, string>
    | undefined;

  const title = meta?.meta_title || 'Your page title appears here';
  const description =
    meta?.meta_description ||
    'A compelling meta description improves click-through from search results.';
  const slug = meta?.slug || 'page-url';

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-muted-foreground" />
          {field.label ?? 'SEO & Metadata'}
        </CardTitle>
        <CardDescription>
          Control how this content appears in search engines and social shares.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">
            shanviatech.com › {truncate(slug, 40)}
          </p>
          <p className="truncate text-base font-medium text-primary">
            {truncate(title, 60)}
          </p>
          <p className="text-sm text-muted-foreground">
            {truncate(description, 150)}
          </p>
        </div>
        <FormBuilder fields={field.fields ?? []} prefix={name} />
      </CardContent>
    </Card>
  );
}
