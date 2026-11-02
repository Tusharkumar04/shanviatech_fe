import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  setMobileSidebarOpen: (value: boolean) => void;
  initTheme: () => void;
}

function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function resolve(theme: Theme): ResolvedTheme {
  if (theme === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return theme;
}

function applyClass(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      sidebarCollapsed: false,
      mobileSidebarOpen: false,

      setTheme: (theme) => {
        const resolvedTheme = resolve(theme);
        applyClass(resolvedTheme);
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        const next: ResolvedTheme =
          get().resolvedTheme === 'dark' ? 'light' : 'dark';
        applyClass(next);
        set({ theme: next, resolvedTheme: next });
      },

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
      setMobileSidebarOpen: (value) => set({ mobileSidebarOpen: value }),

      initTheme: () => {
        const { theme } = get();
        const resolvedTheme = resolve(theme);
        applyClass(resolvedTheme);
        set({ resolvedTheme });

        // React to OS changes only while in "system" mode.
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', () => {
            if (get().theme === 'system') {
              const r = resolve('system');
              applyClass(r);
              set({ resolvedTheme: r });
            }
          });
      },
    }),
    {
      name: 'sv_ui',
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    },
  ),
);
