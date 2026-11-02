import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Full-viewport spinner used during initial bootstrapping. */
export function FullScreenLoader({ label }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        {label && <p className="text-sm">{label}</p>}
      </div>
    </div>
  );
}

/** Inline section spinner. */
export function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={cn('grid place-items-center py-16', className)}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
