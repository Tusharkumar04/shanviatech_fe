import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/ui-store';
import { useSurveyNotifications } from '@/hooks/use-survey-notifications';
import { Sidebar } from './sidebar';
import { MobileSidebar } from './mobile-sidebar';
import { Topbar } from './topbar';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const location = useLocation();

  // App-wide live notifications for new visitor messages / visits.
  useSurveyNotifications();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-64',
        )}
      >
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mx-auto w-full max-w-7xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
