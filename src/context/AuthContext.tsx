import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';

type SubscriptionTier = 'free' | 'premium' | 'super';

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: string; // Keep as string from DB
  displayed: boolean;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google' | 'apple') => Promise<void>;
  tier: SubscriptionTier;
  isAdmin: boolean;
  dailyUsage: number;
  incrementDailyUsage: () => void;
  resetDailyUsage: () => void;
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, 'id' | 'dateEarned' | 'displayed'>) => Promise<void>;
  markAchievementDisplayed: (id: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isAdmin, setIsAdmin] = useState(false);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // --- Wrap functions with useCallback ---
  const fetchUserDetails = useCallback(async (userId: string) => {
    // Don't set isLoading true here, let useEffect handle it
    try {
      console.log("AuthContext: Fetching user details for", userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Allow 'PGRST116' (0 rows)
        console.error('AuthContext: Error fetching user profile (select):', error);
        throw error;
      }

      // Cast the data to UserProfile type to ensure TypeScript properly recognizes is_super_admin
      let userProfile = data as UserProfile | null;

      // If profile doesn't exist, create it
      if (!userProfile) {
        console.log("AuthContext: No profile found, creating one...");
        const { data: insertedData, error: insertError } = await supabase
          .from('user_profiles')
          .insert([{ id: userId, subscription_tier: 'free', daily_usage: 0, is_admin: false, is_super_admin: null }])
          .select()
          .single();
        if (insertError) {
          console.error('AuthContext: Error creating user profile:', insertError);
          throw insertError;
        }
        userProfile = insertedData as UserProfile;
        console.log("AuthContext: Profile created.");
      }

      // Now we are sure userProfile exists
      setTier((userProfile.subscription_tier || 'free') as SubscriptionTier);
      
      // Check both is_admin and is_super_admin fields
      const userIsAdmin = userProfile.is_admin === true || userProfile.is_super_admin === 'yes';
      setIsAdmin(userIsAdmin);
      
      setDailyUsage(userProfile.daily_usage || 0);
      console.log("AuthContext: Profile details set - Tier:", userProfile.subscription_tier, "Is Admin:", userIsAdmin);

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      if (achievementsError) {
        console.error('AuthContext: Error fetching achievements:', achievementsError);
        setAchievements([]);
      } else if (achievementsData) {
        const formattedAchievements: Achievement[] = achievementsData.map(a => ({
          id: a.id, name: a.name, description: a.description, icon: a.icon,
          dateEarned: a.date_earned, displayed: a.displayed
        }));
        setAchievements(formattedAchievements);
        console.log("AuthContext: Achievements fetched:", formattedAchievements.length);
      } else {
        setAchievements([]);
      }

    } catch (error) {
      console.error('AuthContext: General error fetching user details:', error);
      setTier('free');
      setIsAdmin(false);
      setDailyUsage(0);
      setAchievements([]);
    } finally {
      console.log("AuthContext: fetchUserDetails finished, setting isLoading to false.");
      setIsLoading(false); // Set loading false ONLY after fetching details or error
    }
  }, []); // No dependencies to avoid endless loops

  // Enhanced streak checking logic
  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem('learny_usage');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Streak check: Stored date:', parsedData.date, 'Today:', today);
        
        if (parsedData.date === today) {
          // Only set if it's different from current state to avoid potential loops
          setDailyUsage(current => current === parsedData.count ? current : parsedData.count);
        }
        else {
          // Reset for a new day
          console.log('Streak check: New day detected, resetting daily usage');
          localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: 0 }));
          if (user) updateUserUsage(0); // Reset in database too if user is logged in
        }
      } else {
        console.log('Streak check: No stored data, initializing');
        localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: 0 }));
      }
    } catch (e) { 
      console.error("Error handling daily usage in localStorage:", e); 
    }
  }, [user]); // Depend on user to ensure this runs when login state changes

  const updateUserUsage = useCallback(async (count: number) => {
    if (!user) return;
    try {
      await supabase
        .from('user_profiles')
        .update({ daily_usage: count })
        .eq('id', user.id);
    } catch (error) { console.error('AuthContext: Error updating daily usage:', error); }
  }, [user]);

  const incrementDailyUsage = useCallback(() => {
    setDailyUsage(currentCount => {
      const newCount = currentCount + 1;
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: newCount }));
      if (user) updateUserUsage(newCount);
      return newCount;
    });
  }, [user, updateUserUsage]);

  const resetDailyUsage = useCallback(() => {
    setDailyUsage(0);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: 0 }));
    if (user) updateUserUsage(0);
  }, [user, updateUserUsage]);

  const addAchievement = useCallback(async (achievement: Omit<Achievement, 'id' | 'dateEarned' | 'displayed'>) => {
    if (!user) return;
    try {
      const { data: existing } = await supabase.from('user_achievements').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('name', achievement.name);
      if (existing && existing.length > 0) {
        console.log(`AuthContext: Achievement "${achievement.name}" already exists.`);
        return;
      }

      const { data, error } = await supabase.from('user_achievements')
        .insert([{ user_id: user.id, name: achievement.name, description: achievement.description, icon: achievement.icon, displayed: false }])
        .select().single();
      if (error) throw error;

      if (data) {
        const newAchievement: Achievement = {
          id: data.id, name: data.name, description: data.description, icon: data.icon,
          dateEarned: data.date_earned, displayed: data.displayed
        };
        setAchievements(prev => [...prev, newAchievement]);
        toast({ title: 'Ny utmärkelse!', description: `Du har låst upp "${achievement.name}"!`, duration: 10000 });
      }
    } catch (error) { console.error('AuthContext: Error adding achievement:', error); }
  }, [user]); // Depend on user

  const markAchievementDisplayed = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await supabase.from('user_achievements').update({ displayed: true }).eq('id', id).eq('user_id', user.id);
      setAchievements(prev => prev.map(a => a.id === id ? { ...a, displayed: true } : a));
    } catch (error) { console.error('AuthContext: Error marking achievement as displayed:', error); }
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log("AuthContext: Attempting sign in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) console.log("AuthContext: Sign in successful (pending auth state change).");
    else console.error("AuthContext: Sign in error:", error);
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    console.log("AuthContext: Attempting sign up...");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error) console.log("AuthContext: Sign up successful (pending auth state change/confirmation).");
    else console.error("AuthContext: Sign up error:", error);
    return { error, data };
  }, []);

  const signOut = useCallback(async () => {
    console.log("AuthContext: Signing out...");
    setIsLoading(true); // Indicate loading during sign out
    await supabase.auth.signOut();
    // Reset state immediately
    setTier('free');
    setIsAdmin(false);
    setDailyUsage(0);
    setAchievements([]);
    setUser(null);
    setSession(null);
    setIsLoading(false); // Stop loading after state reset
    console.log("AuthContext: Sign out complete.");
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`, // Adjust if needed
    });
    return { error };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  }, []);

  const signInWithProvider = useCallback(async (provider: 'google' | 'apple') => {
    await supabase.auth.signInWithOAuth({ provider });
  }, []);

  // Memoize the context value
  const value = useMemo(() => ({
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithProvider,
    tier,
    isAdmin,
    dailyUsage,
    incrementDailyUsage,
    resetDailyUsage,
    achievements,
    addAchievement,
    markAchievementDisplayed,
  }), [
    session, user, isLoading, signIn, signUp, signOut, resetPassword, updatePassword,
    signInWithProvider, tier, isAdmin, dailyUsage, incrementDailyUsage, resetDailyUsage,
    achievements, addAchievement, markAchievementDisplayed
  ]);

  console.log("AuthContext: Rendering Provider. isLoading:", isLoading, "User:", user ? user.id : null);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
