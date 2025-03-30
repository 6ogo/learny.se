
// GROQ API service för att generera flashcards
import { toast } from '@/components/ui/use-toast';

export interface AIFlashcardRequest {
  topic: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  count?: number;
}

export interface AIFlashcardResponse {
  flashcards: {
    question: string;
    answer: string;
  }[];
}

// Mock implementation tills vi har en riktig API-nyckel
export const generateFlashcards = async (request: AIFlashcardRequest): Promise<AIFlashcardResponse> => {
  // Simulera API-anrop för demo
  try {
    console.log('Generating flashcards with GROQ API...', request);
    
    // Simulera nätverksfördröjning
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Detta skulle vara ett riktigt API-anrop i produktion
    // const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'llama-3-70b-8192',
    //     messages: [
    //       {
    //         role: 'system',
    //         content: `Du är en expert på att skapa flashcards för utbildning. 
    //           Skapa ${request.count || 5} flashcards om ${request.topic} inom kategorin ${request.category} 
    //           på ${request.difficulty} nivå. Svara endast med JSON.`
    //       }
    //     ],
    //     temperature: 0.7,
    //   }),
    // });
    // const data = await response.json();
    
    // Exempel på genererade flashcards baserat på ämne
    const sampleFlashcards = getSampleFlashcards(request.topic, request.difficulty);
    
    return {
      flashcards: sampleFlashcards.slice(0, request.count || 5)
    };
  } catch (error) {
    console.error('Failed to generate flashcards:', error);
    toast({
      title: "Kunde inte generera flashcards",
      description: "Ett fel uppstod när vi försökte generera flashcards med AI. Försök igen senare.",
      variant: "destructive",
    });
    return { flashcards: [] };
  }
};

// Några exempel-flashcards för demosyfte
const getSampleFlashcards = (topic: string, difficulty: string) => {
  const topicLower = topic.toLowerCase();

  if (topicLower.includes('medicin') || topicLower.includes('läkar') || topicLower.includes('sjuk')) {
    return [
      { question: "Vad är skillnaden mellan systoliskt och diastoliskt blodtryck?", 
        answer: "Systoliskt blodtryck mäter trycket när hjärtat kontraherar. Diastoliskt blodtryck mäter trycket när hjärtat är avslappnat mellan hjärtslag." },
      { question: "Vad är funktionen hos mitokondrier i en cell?", 
        answer: "Mitokondrier producerar energi i form av ATP genom cellandning, vilket gör dem till cellens 'kraftverk'." },
      { question: "Vilka är de fyra blodgrupperna i ABO-systemet?", 
        answer: "Blodgrupperna är A, B, AB och O." },
      { question: "Vad är hypoglykemi?", 
        answer: "Hypoglykemi är ett tillstånd med onormalt lågt blodsocker (glukos)." },
      { question: "Vad mäter EKG?", 
        answer: "EKG (elektrokardiogram) mäter hjärtats elektriska aktivitet över tid." },
      { question: "Vilken är den vanligaste typen av leukemi hos barn?", 
        answer: "Akut lymfatisk leukemi (ALL) är den vanligaste typen av leukemi hos barn." },
      { question: "Vilken är skillnaden mellan virus och bakterier?", 
        answer: "Virus är mycket mindre än bakterier, kan inte reproducera sig själva utan en värdcell, och påverkas inte av antibiotika." }
    ];
  } else if (topicLower.includes('programmering') || topicLower.includes('kod') || topicLower.includes('utveckling')) {
    return [
      { question: "Vad är skillnaden mellan '==' och '===' i JavaScript?", 
        answer: "'==' kontrollerar likhet med typkonvertering, medan '===' kontrollerar både värde och typ utan konvertering." },
      { question: "Vad är en 'callback' funktion?", 
        answer: "En callback-funktion är en funktion som skickas som ett argument till en annan funktion och exekveras efter att den andra funktionen har slutförts." },
      { question: "Vad är skillnaden mellan let och var i JavaScript?", 
        answer: "let har blockscope medan var har funktionsscope. let introducerades i ES6 och är generellt att föredra." },
      { question: "Vad är ett 'Pure Component' i React?", 
        answer: "En Pure Component i React utför en ytlig jämförelse på props och state och renderar om endast om det finns en skillnad." },
      { question: "Vad är en 'Promise' i JavaScript?", 
        answer: "En Promise representerar ett asynkront värde som kan hanteras i framtiden. Den kan vara i tillstånden pending, fulfilled eller rejected." },
      { question: "Vad är skillnaden mellan SQL och NoSQL databaser?", 
        answer: "SQL databaser är relationella och använder strukturerade tabeller. NoSQL databaser är icke-relationella och kan lagra data i olika format som dokument, key-value eller grafer." }
    ];
  } else if (topicLower.includes('matematik') || topicLower.includes('matte')) {
    return [
      { question: "Vad är Pythagoras sats?", 
        answer: "I en rätvinklig triangel är kvadraten på hypotenusan lika med summan av kvadraterna på kateterna: a² + b² = c²." },
      { question: "Vad är definitionen av derivata?", 
        answer: "Derivatan av en funktion f(x) är gränsvärdet av kvoten mellan förändringen i funktionsvärdet och förändringen i x när förändringen i x närmar sig noll." },
      { question: "Vad är skillnaden mellan permutation och kombination?", 
        answer: "Permutationer tar hänsyn till ordningen av elementen, medan kombinationer inte gör det." },
      { question: "Vad är en primtalsfaktorisering?", 
        answer: "Primtalsfaktorisering är att uttrycka ett tal som en produkt av primtal." },
      { question: "Vad är Eulers identitet?", 
        answer: "Eulers identitet är e^(iπ) + 1 = 0, där e är Eulers tal, i är den imaginära enheten och π är pi." }
    ];
  } else {
    // Generella flashcards för alla ämnen
    return [
      { question: `Vad kännetecknar ${topic}?`, 
        answer: `${topic} kännetecknas av dess unika egenskaper och betydelse inom ${difficulty} nivå.` },
      { question: `Vilken är den viktigaste aspekten av ${topic}?`, 
        answer: `Den viktigaste aspekten av ${topic} är dess påverkan och tillämpning inom relevanta områden.` },
      { question: `Hur har ${topic} utvecklats genom historien?`, 
        answer: `${topic} har utvecklats gradvis genom historiska innovationer och framsteg.` },
      { question: `Vilka är de främsta utmaningarna inom ${topic}?`, 
        answer: `De främsta utmaningarna inom ${topic} inkluderar komplexitet, tillämpning och framtida utveckling.` },
      { question: `Hur relaterar ${topic} till andra ämnen inom samma fält?`, 
        answer: `${topic} är nära kopplat till andra ämnen genom gemensamma principer och tillämpningar.` }
    ];
  }
};
