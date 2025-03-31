
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AchievementCard } from '@/components/AchievementCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, Award } from 'lucide-react';

const AchievementsPage = () => {
  const { achievements, markAchievementDisplayed } = useAuth();
  
  useEffect(() => {
    // Mark all achievements as displayed
    const newAchievements = achievements.filter(a => !a.displayed);
    
    for (const achievement of newAchievements) {
      markAchievementDisplayed(achievement.id);
    }
  }, [achievements, markAchievementDisplayed]);
  
  // Sort achievements by date, with newest first
  const sortedAchievements = [...achievements].sort((a, b) => {
    const dateA = new Date(a.dateEarned).getTime();
    const dateB = new Date(b.dateEarned).getTime();
    return dateB - dateA;
  });
  
  // Separate new (not displayed) achievements
  const newAchievements = sortedAchievements.filter(a => !a.displayed);
  const oldAchievements = sortedAchievements.filter(a => a.displayed);

  return (
    <div>
      <Link to="/home" className="inline-flex items-center text-gray-600 hover:text-learny-purple mb-6 dark:text-gray-300 dark:hover:text-learny-purple-dark">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      <div className="flex items-center mb-6">
        <Trophy className="h-8 w-8 text-learny-purple dark:text-learny-purple-dark mr-3" />
        <h1 className="text-3xl font-bold dark:text-white">Dina prestationer</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold dark:text-white">Statistik</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Prestationer</p>
            <p className="text-2xl font-bold dark:text-white">{achievements.length}</p>
          </div>
          
          {/* We'll add other stat cards here later when needed */}
        </div>
      </div>

      {newAchievements.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white">Nya prestationer</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
                isNew={true}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold dark:text-white">Alla prestationer</h2>
        </div>
        
        {oldAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {oldAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <Award className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2 dark:text-white">Inga prestationer ännu</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Fortsätt att studera och slutför träningsprogram för att låsa upp prestationer.
            </p>
            <Button asChild>
              <Link to="/home">Börja studera</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AchievementsPage;
