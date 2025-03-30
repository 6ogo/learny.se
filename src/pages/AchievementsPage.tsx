
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { AchievementCard } from '@/components/AchievementCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, Award } from 'lucide-react';

const AchievementsPage = () => {
  const { userStats, updateUserStats } = useLocalStorage();
  
  useEffect(() => {
    // Mark all achievements as displayed
    const updatedAchievements = userStats.achievements.map(achievement => ({
      ...achievement,
      displayed: true,
    }));
    
    updateUserStats({
      achievements: updatedAchievements,
    });
  }, [userStats.achievements, updateUserStats]);
  
  // Sort achievements by date, with newest first
  const sortedAchievements = [...userStats.achievements].sort((a, b) => b.dateEarned - a.dateEarned);
  
  // Separate new (not displayed) achievements
  const newAchievements = sortedAchievements.filter(a => !a.displayed);
  const oldAchievements = sortedAchievements.filter(a => a.displayed);

  return (
    <div className="container px-4 py-8 mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-learny-purple mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till startsidan
      </Link>

      <div className="flex items-center mb-6">
        <Trophy className="h-8 w-8 text-learny-purple mr-3" />
        <h1 className="text-3xl font-bold">Dina prestationer</h1>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Statistik</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Prestationer</p>
            <p className="text-2xl font-bold">{userStats.achievements.length}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Streak</p>
            <p className="text-2xl font-bold">{userStats.streak} dagar</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Rätta svar</p>
            <p className="text-2xl font-bold">{userStats.totalCorrect}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Inlärda kort</p>
            <p className="text-2xl font-bold">{userStats.cardsLearned}</p>
          </div>
        </div>
      </div>

      {newAchievements.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Nya prestationer</h2>
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
          <h2 className="text-xl font-bold">Alla prestationer</h2>
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
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">Inga prestationer ännu</h3>
            <p className="text-gray-500 mb-4">
              Fortsätt att studera och slutför träningsprogram för att låsa upp prestationer.
            </p>
            <Button asChild>
              <Link to="/">Börja studera</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AchievementsPage;
