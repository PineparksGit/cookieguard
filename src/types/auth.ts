import { User, Session } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  status?: number;
  type?: 'error' | 'info';
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}