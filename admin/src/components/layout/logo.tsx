import { cn } from '@/lib/utils';

export function Logo({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-soft">
        <span className="text-base font-extrabold leading-none">S</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight">Shanvia Tech</span>
          <span className="text-[11px] font-medium text-muted-foreground">
            CMS Admin
          </span>
        </div>
      )}
    </div>
  );
}
