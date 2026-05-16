import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  globalLoading: boolean;
  globalLoadingText: string;
  setGlobalLoading: (loading: boolean, text?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.body.setAttribute('arco-theme', 'dark');
        } else {
          document.body.removeAttribute('arco-theme');
        }
      },
      globalLoading: false,
      globalLoadingText: '',
      setGlobalLoading: (loading, text = '') => set({ globalLoading: loading, globalLoadingText: text }),
    }),
    {
      name: 'creagen-app-storage',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'dark') {
            document.body.setAttribute('arco-theme', 'dark');
          } else {
            document.body.removeAttribute('arco-theme');
          }
        }
      },
    }
  )
);
