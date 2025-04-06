// src/context/SubscriptionContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionTier, TierDetails } from '@/types/subscription';

// Subscription tiers details
const tierDetailsData: TierDetails[] = [
  {
    id: 'gratis',
    name: 'Gratis',
    description: 'Påbörja ditt lärande.',
    price: 'Gratis!',
    priceId: '', // No price ID for free tier
    features: [
      'Tillgång till 10 moduler/dag',
      'Simpla resultat',
      'Skapa upp till 3 egna moduler'
    ],
    limits: {
      dailyCards: 200,
      modules: 3,
      ai: false,
    },
    cta: 'Current Plan',
  },
  {
    id: 'plus',
    name: 'Plus',
    description: 'Effektivisera ditt lärande!',
    price: '35 kr/mån',
    priceId: 'price_1PgHvhL8NfK43ZCzWM3qwZCw', // Replace with your actual Stripe price ID
    features: [
      'Obegränsad tillgång till moduler',
      'Skapa upp till 500 moduler',
      'Advanced statistics',
      'Exportera egna moduler'
    ],
    limits: {
      dailyCards: 10000,
      modules: 500,
      ai: false,
    },
    cta: 'Uppgradera till Plus',
  },
  {
    id: 'super',
    name: 'Super Learner',
    description: 'Ultimata lärandet!',
    price: '99 kr/mån',
    priceId: 'price_1PgHwUL8NfK43ZCzSKugtQJn', // Replace with your actual Stripe price ID
    features: [
      'Allt som ingår i Premium',
      'AI flashcard generering',
      'Personaliserade inlärnings-insikter'
    ],
    limits: {
      dailyCards: 10000,
      modules: 500,
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