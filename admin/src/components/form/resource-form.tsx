import { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ModuleConfig } from '@/config/module-config';
import type { FieldConfig } from '@/config/field-config';
import { buildSchema } from '@/config/zod-builder';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormBuilder } from './form-builder';

interface ResourceFormProps {
  config: ModuleConfig;
  defaultValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  submitting?: boolean;
  submitLabel: string;
  onCancel?: () => void;
}

export function ResourceForm({
  config,
  defaultValues,
  onSubmit,
  submitting,
  submitLabel,
  onCancel,
}: ResourceFormProps) {
  const schema = useMemo(() => buildSchema(config.fields), [config]);

  const form = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FieldValues,
    mode: 'onBlur',
  });

  // Re-seed the form whenever fetched defaults change (edit / async load).
  useEffect(() => {
    form.reset(defaultValues as FieldValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const [activeTab, setActiveTab] = useState(config.formTabs?.[0]?.id);

  const fieldsByNames = (names: string[]): FieldConfig[] =>
    names
      .map((name) => config.fields.find((f) => f.name === name))
      .filter((f): f is FieldConfig => Boolean(f));

  const handleInvalid = (errors: FieldValues) => {
    const firstKey = Object.keys(errors)[0];
    if (config.formTabs && firstKey) {
      const tab = config.formTabs.find((t) =>
        t.fieldNames.includes(firstKey),
      );
      if (tab) setActiveTab(tab.id);
    }
    toast.error('Please fix the highlighted fields');
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => onSubmit(values as Record<string, unknown>),
          handleInvalid,
        )}
        className="space-y-6 pb-20"
      >
        {config.formTabs ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex h-auto flex-wrap justify-start gap-1">
              {config.formTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {config.formTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <Card>
                  <CardContent className="pt-6">
                    <FormBuilder fields={fieldsByNames(tab.fieldNames)} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <FormBuilder fields={config.fields} />
            </CardContent>
          </Card>
        )}

        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border glass px-4 py-3 md:pl-72 md:pr-8">
          <div className="mx-auto flex max-w-7xl items-center justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
