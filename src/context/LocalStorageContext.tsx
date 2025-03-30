import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialFlashcards } from '@/data/flashcards';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastReviewed?: number;
  nextReview?: number;
  reviewCount?: number;
  knowledgeLevel?: number;
}

interface LocalStorageContextType {
  flashcards: Flashcard[];
  getFlashcardsByCategory: (category: string) => Flashcard[];
  getTopicsByCategory: (category: string) => string[];
  markReviewed: (id: string, knowledgeLevel: number) => void;
  getDueFlashcards: () => Flashcard[];
  getRecentlyReviewedFlashcards: () => Flashcard[];
  addCustomFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  deleteFlashcard: (id: string) => void;
  editFlashcard: (id: string, flashcard: Partial<Flashcard>) => void;
  resetProgress: () => void;
  exportFlashcards: () => string;
  importFlashcards: (data: string) => boolean;
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  
  // Load flashcards from local storage on initial load
  useEffect(() => {
    const storedFlashcards = localStorage.getItem('flashcards');
    if (storedFlashcards) {
      setFlashcards(JSON.parse(storedFlashcards));
    } else {
      // Initialize with default flashcards if none exist
      setFlashcards(initialFlashcards);
      localStorage.setItem('flashcards', JSON.stringify(initialFlashcards));
    }
  }, []);

  // Save flashcards to local storage whenever they change
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
  }, [flashcards]);

  // Get flashcards by category
  const getFlashcardsByCategory = (category: string) => {
    return flashcards.filter(card => card.category === category);
  };

  // Extract topics from flashcards for a category
  const getTopicsByCategory = (category: string) => {
    const cards = getFlashcardsByCategory(category);
    const topics = new Set<string>();
    
    cards.forEach(card => {
      // Extract topic from question (format: "[Topic] Question")
      const match = card.question.match(/^\[([^\]]+)\]/);
      if (match) {
        topics.add(match[1]);
      }
    });
    
    return Array.from(topics);
  };

  // Mark a flashcard as reviewed
  const markReviewed = (id: string, knowledgeLevel: number) => {
    setFlashcards(prevCards => 
      prevCards.map(card => {
        if (card.id === id) {
          const now = Date.now();
          const reviewCount = (card.reviewCount || 0) + 1;
          
          // Calculate next review time based on knowledge level
          // 1 = difficult (review in 1 day)
          // 2 = moderate (review in 3 days)
          // 3 = easy (review in 7 days)
          let nextReviewDays = 1;
          if (knowledgeLevel === 2) nextReviewDays = 3;
          if (knowledgeLevel === 3) nextReviewDays = 7;
          
          const nextReview = now + (nextReviewDays * 24 * 60 * 60 * 1000);
          
          return {
            ...card,
            lastReviewed: now,
            nextReview,
            reviewCount,
            knowledgeLevel
          };
        }
        return card;
      })
    );
  };

  // Get flashcards due for review
  const getDueFlashcards = () => {
    const now = Date.now();
    return flashcards
      .filter(card => (card.nextReview || 0) <= now)
      .sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0));
  };

  // Get recently reviewed flashcards
  const getRecentlyReviewedFlashcards = () => {
    return flashcards
      .filter(card => card.lastReviewed)
      .sort((a, b) => (b.lastReviewed || 0) - (a.lastReviewed || 0))
      .slice(0, 10);
  };

  // Add a custom flashcard
  const addCustomFlashcard = (flashcard: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...flashcard,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };
    
    setFlashcards(prev => [...prev, newCard]);
  };

  // Delete a flashcard
  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  };

  // Edit a flashcard
  const editFlashcard = (id: string, flashcardUpdates: Partial<Flashcard>) => {
    setFlashcards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, ...flashcardUpdates } : card
      )
    );
  };

  // Reset all progress (review data)
  const resetProgress = () => {
    setFlashcards(prev => 
      prev.map(card => ({
        ...card,
        lastReviewed: undefined,
        nextReview: undefined,
        reviewCount: undefined,
        knowledgeLevel: undefined
      }))
    );
  };

  // Export flashcards to JSON string
  const exportFlashcards = () => {
    return JSON.stringify(flashcards);
  };

  // Import flashcards from JSON string
  const importFlashcards = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        setFlashcards(parsed);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const value = {
    flashcards,
    getFlashcardsByCategory,
    getTopicsByCategory,
    markReviewed,
    getDueFlashcards,
    getRecentlyReviewedFlashcards,
    addCustomFlashcard,
    deleteFlashcard,
    editFlashcard,
    resetProgress,
    exportFlashcards,
    importFlashcards
  };

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};