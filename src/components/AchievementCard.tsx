import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Trophy, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    dateEarned: string | number; // Accept both string and number
    displayed?: boolean;
  };
  isNew?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isNew = false,
}) => {
  // Map achievement icon to Lucide icon component
  const getIcon = () => {
    switch (achievement.icon) {
      case 'flame':
        return <Flame className="h-6 w-6" />;
      case 'trophy':
        return <Trophy className="h-6 w-6" />;
      case 'medal':
        return <Medal className="h-6 w-6" />;
      case 'star':
        return <Star className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  const formatDate = (date: string | number) => {
    // Handle both string and number formats
    const dateObj = typeof date === 'number' ? new Date(date) : new Date(date);
    return format(dateObj, 'd MMMM yyyy', { locale: sv });
  };

  return (
    <motion.div
      initial={isNew ? { scale: 0.8, opacity: 0 } : false}
      animate={isNew ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        "dark:bg-gray-800 rounded-lg border p-4 relative overflow-hidden",
        isNew ? "border-learny-purple dark:border-learny-purple-dark shadow-md" : "border-gray-200 dark:border-gray-700"
      )}
    >
      {isNew && (
        <div className="absolute top-0 right-0">
          <div className="bg-learny-purple text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-2 dark:bg-learny-purple-dark">
            NY!
          </div>
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className={cn(
          "flex-shrink-0 rounded-full p-3",
          isNew ? "bg-learny-purple/10 text-learny-purple dark:bg-learny-purple-dark/10 dark:text-learny-purple-dark" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        )}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h3 className={cn(
            "text-lg font-medium dark:text-white",
            isNew && "text-learny-purple dark:text-learny-purple-dark"
          )}>
            {achievement.name}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {achievement.description}
          </p>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Uppnådd: {formatDate(achievement.dateEarned)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};