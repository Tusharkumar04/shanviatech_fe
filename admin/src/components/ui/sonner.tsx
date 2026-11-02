import { Toaster as Sonner } from 'sonner';
import { useUIStore } from '@/store/ui-store';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/** App-wide toast surface, theme-synced with the UI store. */
export function Toaster(props: ToasterProps) {
  const theme = useUIStore((s) => s.resolvedTheme);

  return (
    <Sonner
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'group rounded-xl border border-border bg-card text-card-foreground shadow-elevated',
          description: 'text-muted-foreground',
        },
      }}
      {...props}
    />
  );
}

export { toast } from 'sonner';
