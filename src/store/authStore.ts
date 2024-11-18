import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthState, AuthError } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user, session: data.session });
    } catch (error: any) {
      set({
        error: {
          message: error.message || 'Failed to sign in. Please try again.',
          status: error.status,
          type: 'error'
        },
      });
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const emailDomain = email.split('@')[1];
      
      // Check if the domain is allowed
      const { data: domains, error: domainsError } = await supabase
        .from('allowed_email_domains')
        .select('domain')
        .eq('domain', emailDomain)
        .single();

      if (domainsError || !domains) {
        throw new Error(`Registration with email domain @${emailDomain} is not allowed. Please use an authorized email domain or contact support.`);
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      set({ 
        user: data.user,
        session: data.session,
        error: {
          message: 'Please check your email for the confirmation link.',
          status: 200,
          type: 'info'
        }
      });
    } catch (error: any) {
      set({
        error: {
          message: error.message || 'Failed to create account. Please try again.',
          status: error.status,
          type: 'error'
        },
      });
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (error: any) {
      set({
        error: {
          message: error.message || 'Failed to sign out. Please try again.',
          status: error.status,
          type: 'error'
        },
      });
    } finally {
      set({ loading: false });
    }
  },
  clearError: () => set({ error: null }),
}));