// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserAchievement } from '@/types/user';
import { toast } from '@/hooks/use-toast';

// Extended User with profile properties
interface ExtendedUser extends User {
  daily_usage?: number;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  isLoading: boolean;
  isAdmin: boolean;
  tier: string;
  daily_usage: number; 
  achievements: UserAchievement[];
  addAchievement: (achievement: Omit<UserAchievement, 'id' | 'dateEarned'>) => Promise<void>;
  markAchievementDisplayed: (id: string) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'apple') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [tier, setTier] = useState<string>('free');
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [initDone, setInitDone] = useState(false);

  // Fetch user details (profile, admin status, achievements)
  const fetchUserDetails = useCallback(async (userId: string) => {
    console.log("AuthContext: Fetching user details for", userId);
    
    try {
      // Throttle and debounce - avoid making too many requests at once
      await new Promise(resolve => setTimeout(resolve, 50));

      // Get user profile (includes subscription tier and admin status)
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("AuthContext: Error fetching user profile (select):", profileError);
        // Don't throw, just continue with default values
        setIsAdmin(false);
        setTier('free');
        setDailyUsage(0);
      } else {
        setIsAdmin(profile?.is_admin || false);
        setTier(profile?.subscription_tier || 'free');
        setDailyUsage(profile?.daily_usage || 0);
        
        // Extend user object with profile data
        setUser(prev => prev ? { ...prev, daily_usage: profile?.daily_usage || 0 } : null);
      }
      
      // Get achievements - don't block on this
      try {
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', userId);
        
        if (achievementsError) {
          console.error("Error fetching achievements:", achievementsError);
        } else if (achievementsData) {
          // Convert to frontend format
          const formattedAchievements: UserAchievement[] = achievementsData.map(a => ({
            id: a.id,
            name: a.name,
            description: a.description,
            icon: a.icon,
            dateEarned: new Date(a.date_earned).getTime(),
            displayed: a.displayed
          }));
          
          setAchievements(formattedAchievements);
        }
      } catch (achieveError) {
        console.error("Error in achievements fetch:", achieveError);
      }
      
      // Check subscription status - don't block on this
      try {
        await refreshSubscription();
      } catch (subError) {
        console.log("Error refreshing subscription:", subError);
      }
    } catch (error) {
      console.error("AuthContext: General error fetching user details:", error);
    } finally {
      console.log("AuthContext: fetchUserDetails finished, setting isLoading to false.");
      setIsLoading(false);
    }
  }, []);

  // Initialize Supabase auth
  useEffect(() => {
    if (initDone) return; // Prevent multiple initializations
    
    console.log("AuthContext: Initializing...");
    
    const initializeAuth = async () => {
      try {
        console.log("AuthContext: Getting initial session...");
        setIsLoading(true);
        
        // Set up a timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          console.log("AuthContext: Session fetch timed out, continuing with no session");
          setIsLoading(false);
          setUser(null);
          setSession(null);
        }, 10000); // 10 second timeout
        
        // Check the initial session
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        // Clear the timeout as we got a response
        clearTimeout(timeoutId);
        
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }
        
        if (sessionData?.session) {
          console.log("AuthContext: Initial session data received:", sessionData.session.user ? `User ${sessionData.session.user.id}` : "No user");
          setSession(sessionData.session);
          setUser(sessionData.session.user);
          
          // Fetch user details if there's a session with a user
          if (sessionData.session.user) {
            await fetchUserDetails(sessionData.session.user.id);
          } else {
            setIsLoading(false);
          }
        } else {
          console.log("AuthContext: No initial session");
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("AuthContext: Error initializing auth:", error);
        setIsLoading(false);
      }
    };
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("AuthContext: onAuthStateChange triggered. Event:", event);
      
      if (newSession?.user) {
        console.log("AuthContext: User found in onAuthStateChange, fetching details...");
        setSession(newSession);
        setUser(newSession.user);
        await fetchUserDetails(newSession.user.id);
      } else {
        console.log("AuthContext: No user in onAuthStateChange");
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setTier('free');
        setDailyUsage(0);
        setIsLoading(false);
      }
    });
    
    // Run initial auth check
    initializeAuth();
    setInitDone(true);
    
    // Clean up listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserDetails, initDone]);

  // Refresh subscription from Stripe
  const refreshSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {});
      
      if (error) {
        console.error("Subscription check error:", error);
        return;
      }
      
      if (data) {
        setTier(data.tier || 'free');
      }
    } catch (error) {
      console.log("Error refreshing subscription:", error);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      return { error, data };
    } catch (error) {
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setTier('free');
    setDailyUsage(0);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth',
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign in with an OAuth provider
  const signInWithProvider = async (provider: 'google' | 'apple') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      toast({
        title: "Login Error",
        description: `Could not sign in with ${provider}. Please try again or use email.`,
        variant: "destructive",
      });
    }
  };

  // Add a new achievement
  const addAchievement = async (achievement: Omit<UserAchievement, 'id' | 'dateEarned'>) => {
    if (!user) return;
    
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          date_earned: now,
          displayed: false
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding achievement:", error);
        return;
      }
      
      const newAchievement: UserAchievement = {
        id: data.id,
        name: data.name,
        description: data.description,
        icon: data.icon,
        dateEarned: new Date(data.date_earned).getTime(),
        displayed: data.displayed
      };
      
      setAchievements(prev => [...prev, newAchievement]);
      
      // Show toast
      toast({
        title: "Achievement Unlocked!",
        description: achievement.name,
      });
    } catch (error) {
      console.error("Error adding achievement:", error);
    }
  };

  // Mark an achievement as displayed
  const markAchievementDisplayed = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_achievements')
        .update({ displayed: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error marking achievement as displayed:", error);
        return;
      }
      
      setAchievements(prev => 
        prev.map(a => a.id === id ? { ...a, displayed: true } : a)
      );
    } catch (error) {
      console.error("Error marking achievement as displayed:", error);
    }
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isLoading,
    isAdmin,
    tier,
    daily_usage: dailyUsage,
    achievements,
    addAchievement,
    markAchievementDisplayed,
    signInWithProvider
  };
  
  console.log("AuthContext: Rendering Provider. isLoading:", isLoading, "User:", user ? user.id : null);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};