import { create } from 'zustand';

export interface SettingsState {
  baseUrl: string;
  apiKey: string;
  model: string;
  loading: boolean;
  setSettings: (settings: Partial<SettingsState>) => void;
  fetchSettings: () => Promise<void>;
  saveSettings: (settings: { baseUrl: string; apiKey: string; model: string }) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  loading: false,
  setSettings: (settings) => set((state) => ({ ...state, ...settings })),
  fetchSettings: async () => {
    try {
      set({ loading: true });
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const settings = data.data || data;
        set({
          baseUrl: settings.baseUrl || 'https://api.openai.com/v1',
          apiKey: settings.apiKey || '',
          model: settings.model || 'gpt-4o-mini',
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch settings:', error);
    }
  },
  saveSettings: async (settings) => {
    try {
      set({ loading: true });
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        throw new Error('Failed to save settings');
      }
      set({ ...settings, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
