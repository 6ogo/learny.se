// src/utils/analytics.ts
import { supabase } from '@/integrations/supabase/client';

// Track user login activity
export const trackUserLogin = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have an entry for today
    const { data: existingActivity } = await supabase
      .from('user_activity')
      .select('id')
      .eq('user_id', userId)
      .eq('login_date', today)
      .maybeSingle();
    
    if (existingActivity) {
      // Already logged today, no need to create a new record
      return;
    }
    
    // Create new activity record
    await supabase
      .from('user_activity')
      .insert({
        user_id: userId,
        login_date: today,
        flashcards_studied: 0,
        study_duration_seconds: 0
      });
      
    // Update user profile streak
    await updateUserStreak(userId);
    
  } catch (error) {
    console.error('Error tracking user login:', error);
  }
};

// Update user streak
const updateUserStreak = async (userId: string) => {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('current_streak, last_active_date, longest_streak')
      .eq('id', userId)
      .single();
      
    if (!profile) return;
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // If no last active date, this is first login
    if (!profile.last_active_date) {
      await supabase
        .from('user_profiles')
        .update({
          current_streak: 1,
          longest_streak: 1,
          last_active_date: todayStr
        })
        .eq('id', userId);
      return;
    }
    
    // Check if last active date was yesterday
    const lastActive = new Date(profile.last_active_date);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isYesterday = lastActive.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
    const isToday = lastActive.toISOString().split('T')[0] === todayStr;
    
    if (isToday) {
      // Already logged in today, no streak change
      return;
    } else if (isYesterday) {
      // Continuing streak
      const newStreak = (profile.current_streak || 0) + 1;
      const newLongestStreak = Math.max(newStreak, profile.longest_streak || 0);
      
      await supabase
        .from('user_profiles')
        .update({
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_active_date: todayStr
        })
        .eq('id', userId);
    } else {
      // Streak broken
      await supabase
        .from('user_profiles')
        .update({
          current_streak: 1,
          last_active_date: todayStr
        })
        .eq('id', userId);
    }
  } catch (error) {
    console.error('Error updating user streak:', error);
  }
};

// Track flashcard study session
export const trackStudySession = async (
  userId: string, 
  flashcardIds: string[], 
  correctCount: number,
  incorrectCount: number,
  category?: string,
  subcategory?: string
) => {
  try {
    const startTime = new Date().toISOString();
    
    // Create session record
    const { data: session, error } = await supabase
      .from('flashcard_sessions')
      .insert({
        user_id: userId,
        start_time: startTime,
        category: category || null,
        subcategory: subcategory || null,
        cards_studied: flashcardIds.length,
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        completed: false
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating study session:', error);
      return null;
    }
    
    return session.id;
  } catch (error) {
    console.error('Error tracking study session:', error);
    return null;
  }
};

// Complete a study session
export const completeStudySession = async (
  sessionId: string,
  userId: string,
  finalCorrectCount: number,
  finalIncorrectCount: number
) => {
  try {
    const endTime = new Date().toISOString();
    
    // Update session record
    await supabase
      .from('flashcard_sessions')
      .update({
        end_time: endTime,
        correct_count: finalCorrectCount,
        incorrect_count: finalIncorrectCount,
        completed: true
      })
      .eq('id', sessionId)
      .eq('user_id', userId);
      
    // Update user's daily flashcards studied count
    const today = new Date().toISOString().split('T')[0];
    await supabase.rpc('increment_flashcards_studied', {
      user_id: userId,
      study_date: today,
      count: finalCorrectCount + finalIncorrectCount
    });
    
  } catch (error) {
    console.error('Error completing study session:', error);
  }
};

// Track flashcard interaction
export const trackFlashcardInteraction = async (
  userId: string,
  flashcardId: string,
  sessionId: string | null,
  isCorrect: boolean,
  responseTimeMs: number
) => {
  try {
    // Record the interaction
    await supabase
      .from('flashcard_interactions')
      .insert({
        user_id: userId,
        flashcard_id: flashcardId,
        session_id: sessionId,
        is_correct: isCorrect,
        response_time_ms: responseTimeMs
      });
      
    // Update the flashcard's correct/incorrect counts
    const columnToUpdate = isCorrect ? 'correct_count' : 'incorrect_count';
    
    // First get the current count
    const { data: currentFlashcard } = await supabase
      .from('flashcards')
      .select(columnToUpdate)
      .eq('id', flashcardId)
      .single();
    
    if (currentFlashcard) {
      // Then update with the incremented value
      const newCount = (currentFlashcard[columnToUpdate] || 0) + 1;
      
      await supabase
        .from('flashcards')
        .update({
          [columnToUpdate]: newCount,
          last_reviewed: new Date().toISOString()
        })
        .eq('id', flashcardId);
    }
      
  } catch (error) {
    console.error('Error tracking flashcard interaction:', error);
  }
};

// Fix for error TS2322: Type 'string' is not assignable to type 'number'
const convertTimestampToNumber = (timestamp: string | number | undefined): number => {
  if (typeof timestamp === 'string') {
    return new Date(timestamp).getTime();
  }
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  return Date.now(); // Default value if undefined
};

// Calculate next review date using spaced repetition algorithm
export const calculateNextReview = (
  lastReviewed: string | number | undefined,
  correctCount: number,
  incorrectCount: number
): number => {
  const now = Date.now();
  const lastReviewedTime = convertTimestampToNumber(lastReviewed);
  
  // If never reviewed before or reviewed more than 6 months ago, start fresh
  if (!lastReviewed || (now - lastReviewedTime > 15768000000)) {
    return now + 86400000; // Review tomorrow
  }
  
  // Calculate success rate (minimum 10%)
  const totalReviews = correctCount + incorrectCount;
  const successRate = totalReviews > 0 
    ? Math.max(0.1, correctCount / totalReviews) 
    : 0.5;
  
  // Base interval calculation
  let interval: number;
  
  if (totalReviews <= 1) {
    interval = 1; // 1 day for first review
  } else if (totalReviews <= 3) {
    interval = 3; // 3 days for early reviews
  } else if (totalReviews <= 5) {
    interval = 7; // 1 week
  } else if (totalReviews <= 10) {
    interval = 14; // 2 weeks
  } else {
    interval = 30; // 1 month
  }
  
  // Adjust interval based on success rate
  if (successRate > 0.9) {
    interval *= 1.5; // Extend interval for high success
  } else if (successRate < 0.6) {
    interval *= 0.5; // Shorten interval for low success
  }
  
  // Convert interval from days to milliseconds
  const intervalMs = Math.round(interval * 86400000);
  
  return now + intervalMs;
};

// Get user activity statistics
export const getUserActivityStats = async (userId: string, days: number = 30) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fix the type error by using the .then() to extract data
    const { data, error } = await supabase.rpc('get_user_activity', {
      start_date: startDate.toISOString().split('T')[0],
      time_range: days
    });
    
    if (error) {
      console.error('Error getting user activity stats:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserActivityStats:', error);
    return [];
  }
};
