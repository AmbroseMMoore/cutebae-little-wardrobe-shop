
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}, 
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            role: 'customer', // Default role
          });
          
          // Load user profile
          await refreshProfile();
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: 'customer', // Default role
        });
        
        // Load user profile
        await refreshProfile();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Implemented the missing refreshProfile function
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      // In a real app, you would fetch the profile from your API
      // For now, we'll use mock data
      const mockProfile = {
        name: "Test User",
        phone: "9876543210",
        address: "123 Test Street",
        city: "Test City",
        state: "Test State",
        pincode: "123456"
      };
      
      setProfile(mockProfile);
      
      // Set admin status
      if (user.email === "admin@cutebae.com") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
