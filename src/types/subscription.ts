
export type SubscriptionTier = 'free' | 'premium' | 'super';

export type SubscriptionFeature = {
  id: string;
  name: string;
  description: string;
  tiers: {
    free: boolean | string;
    premium: boolean | string;
    super: boolean | string;
  };
  highlighted?: boolean;
};

export type TierDetails = {
  id: SubscriptionTier;
  name: string;
  description: string;
  price: string;
  priceId: string; // Stripe price ID
  features: string[];
  limits: {
    dailyCards: number;
    modules: number;
    ai: boolean;
  };
  cta: string;
  popular?: boolean;
};

export type SubscriptionData = {
  id?: string;
  userId: string;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  activeUntil?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
