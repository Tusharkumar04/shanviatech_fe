import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';

interface FieldShellProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

/** Shared label + description + validation-error chrome for a single field. */
export function FieldShell({
  name,
  label,
  description,
  required,
  htmlFor,
  children,
}: FieldShellProps) {
  const { getFieldState, formState } = useFormContext();
  const { error } = getFieldState(name, formState);
  const message = error?.message as string | undefined;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      {children}
      {description && !message && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {message && (
        <p className="text-xs font-medium text-destructive">{message}</p>
      )}
    </div>
  );
}
