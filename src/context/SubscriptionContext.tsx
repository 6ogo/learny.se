// src/context/SubscriptionContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionTier, TierDetails } from '@/types/subscription';

// Subscription tiers details
const tierDetailsData: TierDetails[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Start learning with basic flashcards',
    price: 'Free',
    priceId: '', // No price ID for free tier
    features: [
      'Unlimited study sessions',
      'Basic statistics',
      'Up to 1 flashcard module',
    ],
    limits: {
      dailyCards: 50,
      modules: 1,
      ai: false,
    },
    cta: 'Current Plan',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Enhance your learning experience',
    price: '99 kr/month',
    priceId: 'price_1PgHvhL8NfK43ZCzWM3qwZCw', // Replace with your actual Stripe price ID
    features: [
      'Everything in Free',
      'Up to 500 flashcards',
      'Advanced statistics',
      'Up to 10 modules',
      'Export capabilities',
    ],
    limits: {
      dailyCards: 500,
      modules: 10,
      ai: false,
    },
    cta: 'Upgrade to Premium',
  },
  {
    id: 'super',
    name: 'Super Learner',
    description: 'The ultimate learning toolkit',
    price: '199 kr/month',
    priceId: 'price_1PgHwUL8NfK43ZCzSKugtQJn', // Replace with your actual Stripe price ID
    features: [
      'Everything in Premium',
      'Unlimited flashcards',
      'AI flashcard generation',
      'Personalized learning insights',
      'Priority support',
    ],
    limits: {
      dailyCards: 2000,
      modules: 100,
      ai: true,
    },
    cta: 'Become a Super Learner',
    popular: true,
  },
];

// Define context type
interface SubscriptionContextType {
  currentTier: SubscriptionTier;
  tierDetails: TierDetails[];
  currentTierDetails: TierDetails;
  canUseAI: boolean;
  dailyCardsRemaining: number;
  dailyCardsLimit: number;
  hasReachedModuleLimit: boolean | number;
  initiateCheckout: (priceId: string) => Promise<string | null>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, tier } = useAuth();
  const { toast } = useToast();
  
  // State
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');
  const [dailyCardsRemaining, setDailyCardsRemaining] = useState<number>(50); // Default free tier

  // Effect to update tier when auth context changes
  useEffect(() => {
    if (tier) {
      // Ensure we convert string to SubscriptionTier type
      setCurrentTier(tier as SubscriptionTier);
    }
  }, [tier]);

  // Effect to fetch daily usage stats
  useEffect(() => {
    if (!user) return;

    // For now, just use the dailyUsage from user profile or a default value
    // In the future, this would be fetched from the database
    const dailyLimit = getCurrentTierDetails().limits.dailyCards;
    const used = user.daily_usage || 0; // Here we're assuming the user object has this property
    setDailyCardsRemaining(Math.max(0, dailyLimit - used));
    
  }, [user]);

  // Get current tier details
  const getCurrentTierDetails = (): TierDetails => {
    return tierDetailsData.find(t => t.id === currentTier) || tierDetailsData[0];
  };

  // Check if user can use AI
  const canUseAI = getCurrentTierDetails().limits.ai;
  
  // Check if user has reached module limit
  const hasReachedModuleLimit = (): boolean | number => {
    const limit = getCurrentTierDetails().limits.modules;
    if (!user) return false;
    
    // In a real implementation, we would check against actual modules count
    // For now, return the limit as a placeholder
    return limit;
  };

  // Initiate Stripe checkout
  const initiateCheckout = async (priceId: string): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to subscribe.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      });

      if (error) throw error;
      return data?.url || null;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Checkout Failed",
        description: "Could not initiate checkout process. Please try again later.",
        variant: "destructive",
      });
      return null;
    }
  };

  const value = {
    currentTier,
    tierDetails: tierDetailsData,
    currentTierDetails: getCurrentTierDetails(),
    canUseAI,
    dailyCardsRemaining,
    dailyCardsLimit: getCurrentTierDetails().limits.dailyCards,
    hasReachedModuleLimit: hasReachedModuleLimit(),
    initiateCheckout,
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