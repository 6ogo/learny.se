import React, { createContext, useContext, useEffect, useState } from 'react';
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
  dateEarned: string;
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

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        await fetchUserDetails(session.user.id);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (session?.user) {
          await fetchUserDetails(session.user.id);
        } else {
          setTier('free');
          setIsAdmin(false);
          setDailyUsage(0);
          setAchievements([]);
        }
      }
    );

    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem('learny_usage');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.date === today) {
        setDailyUsage(parsedData.count);
      } else {
        localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: 0 }));
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setTier(data.subscription_tier as SubscriptionTier || 'free');
        setIsAdmin(data.is_admin === true || data.is_super_admin === 'yes');
        setDailyUsage(data.daily_usage || 0);
      } else {
        await supabase
          .from('user_profiles')
          .insert([
            { id: userId, subscription_tier: 'free', daily_usage: 0, is_admin: false, is_super_admin: null }
          ]);
        
        setIsAdmin(false);
      }

      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      if (achievementsError) throw achievementsError;

      if (achievementsData) {
        const formattedAchievements: Achievement[] = achievementsData.map(a => ({
          id: a.id,
          name: a.name,
          description: a.description,
          icon: a.icon,
          dateEarned: a.date_earned,
          displayed: a.displayed
        }));
        setAchievements(formattedAchievements);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsAdmin(false);
    }
  };

  const updateUserUsage = async (count: number) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_profiles')
        .update({ daily_usage: count })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating daily usage:', error);
    }
  };

  const incrementDailyUsage = () => {
    const newCount = dailyUsage + 1;
    setDailyUsage(newCount);
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: newCount }));
    
    if (user) {
      updateUserUsage(newCount);
    }
  };

  const resetDailyUsage = () => {
    setDailyUsage(0);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('learny_usage', JSON.stringify({ date: today, count: 0 }));
    
    if (user) {
      updateUserUsage(0);
    }
  };

  const addAchievement = async (achievement: Omit<Achievement, 'id' | 'dateEarned' | 'displayed'>) => {
    if (!user) return;

    try {
      const { data: existingAchievements } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', achievement.name);

      if (existingAchievements && existingAchievements.length > 0) {
        console.log(`Achievement "${achievement.name}" already earned.`);
        return;
      }

      const { data, error } = await supabase
        .from('user_achievements')
        .insert([
          {
            user_id: user.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            displayed: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newAchievement: Achievement = {
          id: data.id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          dateEarned: data.date_earned,
          displayed: data.displayed
        };
        
        setAchievements(prev => [...prev, newAchievement]);
        
        toast({
          title: 'Ny utmärkelse!',
          description: `Du har låst upp "${achievement.name}"!`,
          duration: 10000
        });
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  const markAchievementDisplayed = async (id: string) => {
    if (!user) return;

    try {
      await supabase
        .from('user_achievements')
        .update({ displayed: true })
        .eq('id', id)
        .eq('user_id', user.id);

      setAchievements(prev => 
        prev.map(a => a.id === id ? { ...a, displayed: true } : a)
      );
    } catch (error) {
      console.error('Error marking achievement as displayed:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { error, data };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setTier('free');
    setIsAdmin(false);
    setDailyUsage(0);
    setAchievements([]);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const signInWithProvider = async (provider: 'google' | 'apple') => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  const value = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
