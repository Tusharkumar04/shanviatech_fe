import { useUIStore } from '@/store/ui-store';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Logo } from './logo';
import { SidebarNav } from './sidebar-nav';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MobileSidebar() {
  const open = useUIStore((s) => s.mobileSidebarOpen);
  const setOpen = useUIStore((s) => s.setMobileSidebarOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Logo />
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
