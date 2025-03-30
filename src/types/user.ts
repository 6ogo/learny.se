
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
