
export type UserAchievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: number;
  displayed?: boolean;
};

export type UserStats = {
  streak: number;
  lastActivity: number;
  totalCorrect: number;
  totalIncorrect: number;
  cardsLearned: number;
  achievements: UserAchievement[];
  completedPrograms: string[];
};

export type UserProfile = {
  id: string;
  subscription_tier: string;
  is_admin: boolean;
  daily_usage: number;
  created_at: string;
  updated_at: string;
  current_streak?: number;
  longest_streak?: number;
  last_active_date?: string;
  email: string; // Define email as required
};
