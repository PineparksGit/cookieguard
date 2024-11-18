import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Website {
  id: string;
  domain: string;
  name: string;
  created_at: string;
  last_scan: string | null;
  is_active: boolean;
  settings: Record<string, any>;
}

interface WebsiteState {
  websites: Website[];
  loading: boolean;
  error: string | null;
  fetchWebsites: () => Promise<void>;
  addWebsite: (domain: string, name: string) => Promise<void>;
  deleteWebsite: (id: string) => Promise<void>;
}

export const useWebsiteStore = create<WebsiteState>((set, get) => ({
  websites: [],
  loading: false,
  error: null,

  fetchWebsites: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ websites: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addWebsite: async (domain: string, name: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('websites')
        .insert([{ domain, name }]);

      if (error) throw error;
      await get().fetchWebsites();
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteWebsite: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchWebsites();
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));