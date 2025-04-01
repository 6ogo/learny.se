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
      setIsAdmin(userProfile.is_admin === true || userProfile.is_super_admin === 'yes');
      setDailyUsage(userProfile.daily_usage || 0);
      console.log("AuthContext: Profile details set - Tier:", userProfile.subscription_tier);


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
  }, []); // REMOVE isAdmin from dependency list - this is the main fix


  useEffect(() => {
    console.log("AuthContext: Initializing...");

    const getInitialSession = async () => {
      console.log("AuthContext: Getting initial session...");
      setIsLoading(true); // Start loading

      try {
        // Try to get session without timeout first, to avoid accidentally interrupting valid auth
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("AuthContext: Error getting initial session:", error);
          setIsLoading(false);
          return;
        }

        console.log("AuthContext: Initial session data received:", session ? `User ${session.user.id}` : "No session");
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Add a safety timeout just for the user details fetch
          let detailsTimeoutId: any = null;
          try {
            const timeoutPromise = new Promise<void>((_, reject) => {
              detailsTimeoutId = setTimeout(() => {
                console.error("AuthContext: User details fetch timeout - continuing with basic session");
                reject(new Error('User details fetch timeout'));
              }, 10000); // Longer 10 second timeout
            });

            // Race between fetching details and timeout
            await Promise.race([
              fetchUserDetails(session.user.id),
              timeoutPromise
            ]);

            if (detailsTimeoutId) clearTimeout(detailsTimeoutId);

          } catch (detailsError) {
            // If details fetch times out, still keep the user session and set default values
            if (detailsTimeoutId) clearTimeout(detailsTimeoutId);
            console.error("AuthContext: Error fetching user details, but continuing with session:", detailsError);
            setTier('free');
            setIsAdmin(false);
            setDailyUsage(0);
            setAchievements([]);
            setIsLoading(false);
          }
        } else {
          console.log("AuthContext: No initial user, setting isLoading to false.");
          setIsLoading(false); // No user, stop loading
        }
      } catch (error) {
        console.error("AuthContext: Session fetch exception:", error);
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("AuthContext: onAuthStateChange triggered. Event:", _event);
        setIsLoading(true); // Start loading on auth change
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("AuthContext: User found in onAuthStateChange, fetching details...");

          // Add a safety timeout for user details
          let detailsTimeoutId: any = null;
          try {
            const timeoutPromise = new Promise<void>((_, reject) => {
              detailsTimeoutId = setTimeout(() => {
                console.error("AuthContext: User details fetch timeout in onAuthStateChange - continuing with basic session");
                reject(new Error('User details fetch timeout'));
              }, 10000); // 10 second timeout
            });

            await Promise.race([
              fetchUserDetails(session.user.id),
              timeoutPromise
            ]);

            if (detailsTimeoutId) clearTimeout(detailsTimeoutId);

          } catch (detailsError) {
            // If details fetch times out, still keep the user session
            if (detailsTimeoutId) clearTimeout(detailsTimeoutId);
            console.error("AuthContext: Error fetching user details in onAuthStateChange, but continuing with session:", detailsError);
            setTier('free');
            setIsAdmin(false);
            setDailyUsage(0);
            setAchievements([]);
            setIsLoading(false);
          }
        } else {
          console.log("AuthContext: No user in onAuthStateChange, resetting state and setting isLoading false.");
          setTier('free');
          setIsAdmin(false);
          setDailyUsage(0);
          setAchievements([]);
          setIsLoading(false); // No user, stop loading
        }
      }
    );

    // Daily usage logic remains the same...
    try {
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem('learny_usage');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.date === today) {
          // Only set if it's different from current state to avoid potential loops
          setDailyUsage(current => current === parsedData.count ? current : parsedData.count);
        }
        else localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: 0 }));
      } else {
        localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: 0 }));
      }
    } catch (e) { console.error("Error handling daily usage in localStorage:", e); }


    return () => {
      console.log("AuthContext: Unsubscribing auth listener.");
      subscription.unsubscribe();
    };
  }, [fetchUserDetails]); // Include fetchUserDetails in dependency array

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