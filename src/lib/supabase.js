
import { createClient } from '@supabase/supabase-js';

// Try to get the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a mock client if environment variables are missing
let supabase;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables are missing. Running in development mode with mock functionality.');
  
  // Create a client with the fallback values, which will work for development
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Override methods to prevent actual API calls
  const mockResponse = { data: null, error: null };
  
  // Mock common Supabase methods
  const originalFrom = supabase.from.bind(supabase);
  supabase.from = (table) => {
    const chain = originalFrom(table);
    
    // Override select to return empty data
    const originalSelect = chain.select.bind(chain);
    chain.select = (...args) => {
      console.log(`Mock: Supabase select called on table "${table}"`);
      return {
        ...originalSelect(...args),
        single: () => Promise.resolve(mockResponse),
        eq: () => ({
          ...mockResponse,
          data: [],
          then: (callback) => Promise.resolve(callback({ data: [], error: null }))
        }),
        order: () => ({
          ...mockResponse,
          data: [],
          then: (callback) => Promise.resolve(callback({ data: [], error: null }))
        })
      };
    };
    
    // Override upsert to do nothing
    chain.upsert = () => {
      console.log(`Mock: Supabase upsert called on table "${table}"`);
      return {
        ...mockResponse,
        select: () => ({
          ...mockResponse,
          single: () => Promise.resolve(mockResponse)
        })
      };
    };
    
    return chain;
  };
  
  // Mock auth methods
  const originalAuth = supabase.auth;
  supabase.auth = {
    ...originalAuth,
    getSession: () => {
      console.log('Mock: Supabase auth.getSession called');
      return Promise.resolve({ data: { session: null }, error: null });
    },
    signOut: () => {
      console.log('Mock: Supabase auth.signOut called');
      return Promise.resolve({ error: null });
    },
    onAuthStateChange: (callback) => {
      console.log('Mock: Supabase auth.onAuthStateChange called');
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithOAuth: (options) => {
      console.log('Mock: Supabase auth.signInWithOAuth called', options);
      return Promise.resolve({ data: {}, error: null });
    }
  };
} else {
  // Create the real Supabase client if environment variables are available
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
