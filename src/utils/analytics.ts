import { supabase } from '@/integrations/supabase/client';

/**
 * Starts a flashcard study session and returns the session data
 * @param userId The ID of the user starting the session
 * @param category The category of flashcards being studied
 * @param subcategory Optional subcategory of flashcards
 * @returns The created session object or null if there was an error
 */
export async function startFlashcardSession(userId: string, category: string, subcategory?: string) {
  try {
    const { data, error } = await supabase
      .from('flashcard_sessions')
      .insert({
        user_id: userId,
        category,
        subcategory: subcategory || null,
        start_time: new Date().toISOString()
      })
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error starting flashcard session:', error);
    return null;
  }
}

/**
 * Ends a flashcard study session and updates activity metrics
 * @param sessionId The ID of the session to end
 * @param userId The ID of the user who started the session
 * @param cardsStudied Total number of cards studied in the session
 * @param correctCount Number of correct answers in the session
 * @param incorrectCount Number of incorrect answers in the session
 */
export async function endFlashcardSession(
  sessionId: string, 
  userId: string,
  cardsStudied: number, 
  correctCount: number, 
  incorrectCount: number
) {
  try {
    // Update the session record
    await supabase
      .from('flashcard_sessions')
      .update({
        end_time: new Date().toISOString(),
        cards_studied: cardsStudied,
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        completed: true
      })
      .eq('id', sessionId);
      
    // Update total flashcards studied for today
    const today = new Date().toISOString().split('T')[0];
    
    // First, check if we have an entry for today
    const { data: activityData } = await supabase
      .from('user_activity')
      .select('id, flashcards_studied')
      .eq('user_id', userId)
      .eq('login_date', today)
      .single();
    
    if (activityData) {
      // Update existing record
      await supabase
        .from('user_activity')
        .update({ 
          flashcards_studied: (activityData.flashcards_studied || 0) + cardsStudied 
        })
        .eq('id', activityData.id);
    } else {
      // Create new record
      await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          login_date: today,
          flashcards_studied: cardsStudied
        });
    }
  } catch (error) {
    console.error('Error ending flashcard session:', error);
  }
}

/**
 * Tracks an individual flashcard interaction
 * @param userId The ID of the user interacting with the flashcard
 * @param flashcardId The ID of the flashcard
 * @param sessionId The ID of the current study session
 * @param isCorrect Whether the user answered correctly
 * @param responseTimeMs The time in milliseconds it took to respond
 */
export async function trackFlashcardInteraction(
  userId: string,
  flashcardId: string,
  sessionId: string,
  isCorrect: boolean,
  responseTimeMs: number
) {
  try {
    await supabase
      .from('flashcard_interactions')
      .insert({
        user_id: userId,
        flashcard_id: flashcardId,
        session_id: sessionId,
        is_correct: isCorrect,
        response_time_ms: responseTimeMs,
      });
      
    // Also update the flashcard's correct/incorrect counts
    // This ensures our interaction tracking is consistent with our flashcard stats
    await supabase
      .from('flashcards')
      .update({
        [isCorrect ? 'correct_count' : 'incorrect_count']: supabase.rpc('increment', { 
          row_id: flashcardId,
          table_name: 'flashcards',
          column_name: isCorrect ? 'correct_count' : 'incorrect_count'
        })
      })
      .eq('id', flashcardId);
  } catch (error) {
    console.error('Error tracking flashcard interaction:', error);
  }
}

/**
 * Gets user analytics data for a specific time period
 * @param userId The user ID to get analytics for
 * @param days Number of days to include in the report
 * @returns Object containing analytics data
 */
export async function getUserAnalytics(userId: string, days: number = 30) {
  try {
    // Calculate the start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    // Get activity data
    const { data: activityData, error: activityError } = await supabase
      .from('user_activity')
      .select('login_date, flashcards_studied')
      .eq('user_id', userId)
      .gte('login_date', startDateStr)
      .order('login_date', { ascending: true });
      
    if (activityError) throw activityError;
    
    // Get flashcard interactions
    const { data: interactionsData, error: interactionsError } = await supabase
      .from('flashcard_interactions')
      .select('is_correct, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });
      
    if (interactionsError) throw interactionsError;
    
    // Get study sessions
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('flashcard_sessions')
      .select('category, subcategory, cards_studied, correct_count, incorrect_count, start_time, end_time')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())
      .order('start_time', { ascending: true });
      
    if (sessionsError) throw sessionsError;
    
    // Calculate analytics
    const totalFlashcardsStudied = activityData?.reduce((sum, day) => sum + (day.flashcards_studied || 0), 0) || 0;
    const correctAnswers = interactionsData?.filter(i => i.is_correct).length || 0;
    const incorrectAnswers = interactionsData?.filter(i => !i.is_correct).length || 0;
    const accuracy = interactionsData?.length ? (correctAnswers / interactionsData.length * 100).toFixed(1) : '0';
    
    // Calculate study time (in minutes)
    const totalStudyTimeMinutes = sessionsData?.reduce((sum, session) => {
      if (!session.end_time || !session.start_time) return sum;
      const startTime = new Date(session.start_time).getTime();
      const endTime = new Date(session.end_time).getTime();
      const durationMinutes = (endTime - startTime) / (1000 * 60);
      return sum + (durationMinutes < 180 ? durationMinutes : 0); // Cap at 3 hours to avoid outliers
    }, 0) || 0;
    
    // Get most studied category
    const categoryCount: Record<string, number> = {};
    sessionsData?.forEach(session => {
      const category = session.category || 'unknown';
      categoryCount[category] = (categoryCount[category] || 0) + (session.cards_studied || 0);
    });
    
    // Find category with highest count
    let mostStudiedCategory = 'none';
    let maxCount = 0;
    Object.entries(categoryCount).forEach(([category, count]) => {
      if (count > maxCount) {
        mostStudiedCategory = category;
        maxCount = count;
      }
    });
    
    return {
      dailyActivity: activityData || [],
      totalDaysActive: activityData?.length || 0,
      totalFlashcardsStudied,
      correctAnswers,
      incorrectAnswers,
      accuracy: `${accuracy}%`,
      totalStudyTimeMinutes: Math.round(totalStudyTimeMinutes),
      mostStudiedCategory,
      sessions: sessionsData || []
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    return null;
  }
}