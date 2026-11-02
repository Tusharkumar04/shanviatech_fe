import { useEffect, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { UNAUTHORIZED_EVENT } from '@/lib/api-client';

export function AppProviders({ children }: { children: ReactNode }) {
  const initTheme = useUIStore((s) => s.initTheme);
  const logout = useAuthStore((s) => s.logout);

  // Apply the persisted theme on first paint.
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // The axios interceptor dispatches this when a token expires.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener(UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  }, [logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
