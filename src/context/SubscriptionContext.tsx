
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { SubscriptionTier, TierDetails } from '@/types/subscription';
import { supabase } from '@/integrations/supabase/client';

// Subscription tiers configuration
export const tierDetails: TierDetails[] = [
  {
    id: 'free',
    name: 'Gratis',
    description: 'Perfekt för att prova Learny',
    price: '0 kr',
    priceId: '',
    features: [
      '5 flashcards per dag',
      '1 flashcard-modul',
      'Grundläggande funktioner',
    ],
    limits: {
      dailyCards: 5,
      modules: 1,
      ai: false,
    },
    cta: 'Aktuell plan',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'För seriösa studenter',
    price: '29 kr/månad',
    priceId: 'price_premium', // Replace with actual Stripe price ID
    features: [
      'Obegränsade flashcards',
      'Upp till 100 moduler',
      'Avancerade statistiker',
      'Prioriterad support',
    ],
    limits: {
      dailyCards: Infinity,
      modules: 100,
      ai: false,
    },
    cta: 'Uppgradera',
    popular: true,
  },
  {
    id: 'super',
    name: 'Super Learner',
    description: 'För professionellt lärande',
    price: '99 kr/månad',
    priceId: 'price_super', // Replace with actual Stripe price ID
    features: [
      'Alla Premium-funktioner',
      'AI-assisterad flashcard-skapande',
      'Avancerad inlärningsoptimering',
      'Prioriterad support',
    ],
    limits: {
      dailyCards: Infinity,
      modules: 100,
      ai: true,
    },
    cta: 'Uppgradera',
  },
];

type SubscriptionContextType = {
  currentTier: SubscriptionTier;
  tierDetails: TierDetails[];
  currentTierDetails: TierDetails;
  isLoading: boolean;
  remainingDailyCards: number;
  remainingModules: number;
  canUseAI: boolean;
  hasReachedDailyLimit: boolean;
  hasReachedModuleLimit: boolean;
  initiateCheckout: (priceId: string) => Promise<string | null>;
  refreshSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, tier: authTier, dailyUsage } = useAuth();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [moduleCount, setModuleCount] = useState(0);

  // Use tier from auth context but verify with Supabase on mount
  useEffect(() => {
    setCurrentTier(authTier);
    
    if (user) {
      refreshSubscription();
    } else {
      setIsLoading(false);
    }
  }, [user, authTier]);

  // Fetch module count from Supabase
  useEffect(() => {
    const fetchModuleCount = async () => {
      if (!user) {
        setModuleCount(0);
        return;
      }

      try {
        const { count, error } = await supabase
          .from('flashcard_modules')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        if (error) throw error;
        setModuleCount(count || 0);
      } catch (error) {
        console.error('Error fetching module count:', error);
      }
    };

    fetchModuleCount();
  }, [user]);

  const refreshSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Verify subscription status directly with Stripe via Supabase function
      const { data, error } = await supabase.functions.invoke('check-subscription', {});
      
      if (error) throw error;
      
      // Update local state based on verified subscription
      if (data?.tier) {
        setCurrentTier(data.tier);
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateCheckout = async (priceId: string): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      });
      
      if (error) throw error;
      return data?.url || null;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  };

  // Get current tier details
  const currentTierDetails = tierDetails.find(t => t.id === currentTier) || tierDetails[0];
  
  // Calculate remaining daily cards
  const remainingDailyCards = Math.max(0, currentTierDetails.limits.dailyCards - dailyUsage);
  
  // Calculate remaining modules
  const remainingModules = Math.max(0, currentTierDetails.limits.modules - moduleCount);
  
  // AI access
  const canUseAI = currentTierDetails.limits.ai;
  
  // Check limits
  const hasReachedDailyLimit = dailyUsage >= currentTierDetails.limits.dailyCards;
  const hasReachedModuleLimit = moduleCount >= currentTierDetails.limits.modules;

  const value = {
    currentTier,
    tierDetails,
    currentTierDetails,
    isLoading,
    remainingDailyCards,
    remainingModules,
    canUseAI,
    hasReachedDailyLimit,
    hasReachedModuleLimit,
    initiateCheckout,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
