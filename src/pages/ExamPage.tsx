import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/context/LocalStorageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const ExamPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { getProgram, getFlashcardsByProgram, markProgramCompleted } = useLocalStorage();
  const { addAchievement } = useAuth();

  const program = getProgram(programId || '');
  const flashcards = getFlashcardsByProgram(programId || '');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{question: string, userAnswer: string, correctAnswer: string}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  // Generera slumpmässiga svarsalternativ för varje fråga
  const [options, setOptions] = useState<string[][]>([]);
  
  useEffect(() => {
    if (!program || !program.hasExam) {
      navigate(`/study/${programId}`);
    }
    
    // Generera svarsalternativ för varje fråga (det korrekta svaret + 3 slumpmässiga från andra kort)
    const generateOptions = () => {
      return flashcards.map((card) => {
        const correctAnswer = card.answer;
        
        // Hitta 3 slumpmässiga svar från andra kort som inte är det nuvarande kortet
        const otherAnswers = flashcards
          .filter(c => c.id !== card.id)
          .map(c => c.answer)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        // Kombinera det korrekta svaret med de slumpmässiga och blanda dem
        return [...otherAnswers, correctAnswer].sort(() => 0.5 - Math.random());
      });
    };
    
    setOptions(generateOptions());
  }, [program, programId, navigate, flashcards]);
  
  if (!program || flashcards.length === 0) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <p className="text-xl text-gray-600 dark:text-gray-300">Provet kunde inte laddas.</p>
        <Button asChild className="mt-4">
          <Link to="/">Tillbaka till startsidan</Link>
        </Button>
      </div>
    );
  }
  
  const currentQuestion = flashcards[currentQuestionIndex];
  const currentOptions = options[currentQuestionIndex] || [];
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleNextQuestion = () => {
    if (selectedOption) {
      // Spara användarens svar
      setUserAnswers(prev => [
        ...prev, 
        {
          question: currentQuestion.question,
          userAnswer: selectedOption,
          correctAnswer: currentQuestion.answer
        }
      ]);
      
      // Kontrollera om svaret är korrekt
      if (selectedOption === currentQuestion.answer) {
        setScore(prev => prev + 1);
      }
      
      // Återställ val och gå till nästa fråga eller visa resultat
      setSelectedOption(null);
      
      if (currentQuestionIndex < flashcards.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowResults(true);
        
        // Markera programmet som slutfört om användaren får minst 70%
        const passingScore = Math.ceil(flashcards.length * 0.7);
        if (score + (selectedOption === currentQuestion.answer ? 1 : 0) >= passingScore) {
          markProgramCompleted(program.id);
          addAchievement({
            name: `Klarat provet: ${program.name}`,
            description: `Du har klarat provet för ${program.name}!`,
            icon: 'trophy',
          });
          toast({
            title: "Grattis!",
            description: `Du har klarat provet för ${program.name}!`,
          });
        }
      }
    }
  };
  
  const progress = ((currentQuestionIndex) / flashcards.length) * 100;
  
  const getScorePercentage = () => {
    return Math.round((score / flashcards.length) * 100);
  };
  
  const isPassed = getScorePercentage() >= 70;
  
  return (
    <div>
      <Link to={`/study/${programId}`} className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-learny-purple dark:hover:text-learny-purple-dark mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Tillbaka till programmet
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">{program.name} - Prov</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Testa dina kunskaper med detta prov.</p>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium dark:text-gray-300">
                  Fråga {currentQuestionIndex + 1} av {flashcards.length}
                </div>
                <div className="text-sm font-medium dark:text-gray-300">
                  {score} poäng
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 dark:text-white">{currentQuestion.question}</h3>
              
              <div className="space-y-3">
                {currentOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors min-h-[60px] flex items-center ${
                      selectedOption === option 
                        ? 'border-learny-purple bg-learny-purple/10 dark:border-learny-purple-dark dark:bg-learny-purple-dark/10' 
                        : 'border-gray-200 hover:border-learny-purple/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-learny-purple-dark/50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <p className="dark:text-white w-full">{option}</p>
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleNextQuestion} 
                disabled={!selectedOption}
                size="lg"
              >
                {currentQuestionIndex < flashcards.length - 1 ? 'Nästa fråga' : 'Se resultat'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
              <div className="inline-flex items-center justify-center rounded-full bg-learny-purple/10 dark:bg-learny-purple-dark/10 p-4 mb-4">
                <Trophy className={`h-10 w-10 ${isPassed ? 'text-learny-purple dark:text-learny-purple-dark' : 'text-gray-400 dark:text-gray-500'}`} />
              </div>
              
              <h2 className="text-2xl font-bold mb-2 dark:text-white">
                {isPassed ? 'Grattis! Du har klarat provet!' : 'Försök igen!'}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {isPassed 
                  ? 'Du har visat att du behärskar detta ämne.' 
                  : 'Du behöver studera mer för att klara detta prov.'}
              </p>
              
              <div className="mb-6">
                <div className="text-3xl font-bold mb-1 dark:text-white">
                  {score} / {flashcards.length} poäng
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {getScorePercentage()}% rätt
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-4 text-left dark:text-white">Dina svar:</h3>
                <div className="space-y-4">
                  {userAnswers.map((answer, index) => (
                    <div key={index} className="border rounded-lg p-4 text-left dark:border-gray-700">
                      <p className="font-medium mb-2 dark:text-white">Fråga {index + 1}: {answer.question}</p>
                      <div className="flex items-start gap-2">
                        {answer.userAnswer === answer.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-learny-green dark:text-learny-green-dark mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-learny-red dark:text-learny-red-dark mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ditt svar: {answer.userAnswer}</p>
                          {answer.userAnswer !== answer.correctAnswer && (
                            <p className="text-sm text-learny-green dark:text-learny-green-dark mt-1">Rätt svar: {answer.correctAnswer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedOption(null);
                    setUserAnswers([]);
                    setShowResults(false);
                    setScore(0);
                  }}
                >
                  Försök igen
                </Button>
                
                <Button asChild>
                  <Link to={`/study/${programId}`}>Tillbaka till programmet</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamPage;
