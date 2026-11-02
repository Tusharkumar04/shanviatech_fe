import { Menu } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { ProfileMenu } from './profile-menu';
import { Logo } from './logo';
import { Breadcrumbs } from './breadcrumbs';

export function Topbar() {
  const setMobileOpen = useUIStore((s) => s.setMobileSidebarOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border glass px-4 md:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="lg:hidden">
        <Logo collapsed />
      </div>

      <div className="hidden lg:block">
        <Breadcrumbs />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  );
}
