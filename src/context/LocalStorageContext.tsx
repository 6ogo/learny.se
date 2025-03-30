import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastReviewed?: number;
  nextReview?: number;
  correctCount?: number;
  incorrectCount?: number;
  learned?: boolean;
  reviewLater?: boolean;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

export type Program = {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  flashcards: string[]; // Array of flashcard IDs
  completedByUser?: boolean;
  progress?: number;
  hasExam?: boolean; // Indicates if the program has an exam at the end
};

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

type LocalStorageContextType = {
  flashcards: Flashcard[];
  programs: Program[];
  categories: Category[];
  userStats: UserStats;
  addFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  getFlashcard: (id: string) => Flashcard | undefined;
  getFlashcardsByCategory: (category: string) => Flashcard[];
  getFlashcardsByProgram: (programId: string) => Flashcard[];
  updateUserStats: (updates: Partial<UserStats>) => void;
  addAchievement: (achievement: Omit<UserAchievement, 'id' | 'dateEarned'>) => void;
  markProgramCompleted: (programId: string) => void;
  getProgram: (programId: string) => Program | undefined;
  getProgramsByCategory: (category: string) => Program[];
  getCategory: (categoryId: string) => Category | undefined;
};

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

// Initial data
const initialCategories: Category[] = [
  {
    id: 'medicine',
    name: 'Medicin',
    icon: 'stethoscope',
    description: 'Lär dig medicinska termer, procedurer och koncept',
    color: 'bg-learny-red',
  },
  {
    id: 'coding',
    name: 'Kodning',
    icon: 'code',
    description: 'Utforska programmeringsgrunder och avancerade koncept',
    color: 'bg-learny-blue',
  },
  {
    id: 'math',
    name: 'Matematik',
    icon: 'plus',
    description: 'Från grundläggande aritmetik till avancerad kalkyl',
    color: 'bg-learny-purple',
  },
  {
    id: 'languages',
    name: 'Språk',
    icon: 'languages',
    description: 'Lär dig nya språk och förbättra ditt ordförråd',
    color: 'bg-learny-green',
  },
  {
    id: 'science',
    name: 'Vetenskap',
    icon: 'flask',
    description: 'Utforska vetenskapliga principer inom olika områden',
    color: 'bg-learny-yellow',
  },
];

// Lägger till fler träningsprogram, inklusive några med prov
const initialPrograms: Program[] = [
  {
    id: 'med-basics',
    name: 'Medicinska grundbegrepp',
    description: 'Grundläggande medicinska termer och koncept för nybörjare',
    category: 'medicine',
    difficulty: 'beginner',
    flashcards: ['med1', 'med2', 'med3', 'med4', 'med5'],
    hasExam: true,
  },
  {
    id: 'med-anatomy',
    name: 'Anatomi - överkropp',
    description: 'Lär dig om människans överkroppsanatomi',
    category: 'medicine',
    difficulty: 'intermediate',
    flashcards: ['med6', 'med7', 'med8', 'med9', 'med10'],
  },
  {
    id: 'js-basics',
    name: 'JavaScript grunder',
    description: 'Grundläggande JavaScript-koncept för nybörjare',
    category: 'coding',
    difficulty: 'beginner',
    flashcards: ['code1', 'code2', 'code3', 'code4', 'code5'],
    hasExam: true,
  },
  {
    id: 'react-fundamentals',
    name: 'React grundkoncept',
    description: 'Viktiga koncept inom React-utveckling',
    category: 'coding',
    difficulty: 'intermediate',
    flashcards: ['code6', 'code7', 'code8', 'code9', 'code10'],
  },
  {
    id: 'math-algebra',
    name: 'Algebra grunder',
    description: 'Grundläggande algebraiska koncept och ekvationer',
    category: 'math',
    difficulty: 'beginner',
    flashcards: ['math1', 'math2', 'math3', 'math4', 'math5'],
    hasExam: true,
  },
  // Nya program med prov
  {
    id: 'python-basics',
    name: 'Python grundkurs',
    description: 'Grundläggande Python-programmering för nybörjare',
    category: 'coding',
    difficulty: 'beginner',
    flashcards: ['py1', 'py2', 'py3', 'py4', 'py5'],
    hasExam: true,
  },
  {
    id: 'swedish-basics',
    name: 'Svenska för nybörjare',
    description: 'Grundläggande svenska ord och fraser',
    category: 'languages',
    difficulty: 'beginner',
    flashcards: ['swe1', 'swe2', 'swe3', 'swe4', 'swe5'],
    hasExam: true,
  },
  {
    id: 'physics-mechanics',
    name: 'Grundläggande mekanik',
    description: 'Viktiga koncept inom klassisk mekanik',
    category: 'science',
    difficulty: 'intermediate',
    flashcards: ['phys1', 'phys2', 'phys3', 'phys4', 'phys5'],
    hasExam: true,
  },
  {
    id: 'calculus-intro',
    name: 'Introduktion till kalkyl',
    description: 'Grundläggande begrepp inom differentialkalkyl',
    category: 'math',
    difficulty: 'advanced',
    flashcards: ['calc1', 'calc2', 'calc3', 'calc4', 'calc5'],
    hasExam: true,
  },
  {
    id: 'ai-fundamentals',
    name: 'AI fundamentals',
    description: 'Grundläggande AI-koncept och maskinlärning',
    category: 'coding',
    difficulty: 'advanced',
    flashcards: ['ai1', 'ai2', 'ai3', 'ai4', 'ai5'],
    hasExam: true,
  },
];

// Lägg till nya flashcards för de nya programmen
const initialFlashcards: Flashcard[] = [
  // Medicine flashcards
  {
    id: 'med1',
    question: 'Vad menas med "hypertension"?',
    answer: 'Hypertension är det medicinska ordet för högt blodtryck, vilket innebär att blodets tryck mot kärlväggarna är för högt under en längre tid.',
    category: 'medicine',
    difficulty: 'beginner',
  },
  {
    id: 'med2',
    question: 'Vad är ett EKG?',
    answer: 'EKG (elektrokardiogram) är en test som mäter den elektriska aktiviteten i hjärtat för att upptäcka hjärtproblem och övervaka hjärtats tillstånd.',
    category: 'medicine',
    difficulty: 'beginner',
  },
  {
    id: 'med3',
    question: 'Vad är den normala kroppstemperaturen?',
    answer: 'Normal kroppstemperatur är cirka 37°C (98.6°F), men kan variera mellan 36.1°C till 37.2°C (97-99°F) beroende på individ, tid på dagen och mätmetod.',
    category: 'medicine',
    difficulty: 'beginner',
  },
  {
    id: 'med4',
    question: 'Vad är skillnaden mellan virus och bakterier?',
    answer: 'Virus är mycket mindre än bakterier och kan bara föröka sig inuti en värdcell. Bakterier är encelliga organismer som kan föröka sig självständigt. Antibiotika fungerar mot bakterier men inte mot virus.',
    category: 'medicine',
    difficulty: 'beginner',
  },
  {
    id: 'med5',
    question: 'Vad är funktion av röda blodkroppar?',
    answer: 'Röda blodkroppar transporterar syre från lungorna till vävnaderna i kroppen och koldioxid från vävnaderna tillbaka till lungorna med hjälp av hemoglobin.',
    category: 'medicine',
    difficulty: 'beginner',
  },
  {
    id: 'med6',
    question: 'Namnge de fyra hjärtkamrarna',
    answer: 'De fyra hjärtkamrarna är höger förmak, höger kammare, vänster förmak och vänster kammare.',
    category: 'medicine',
    difficulty: 'intermediate',
  },
  {
    id: 'med7',
    question: 'Vilka är de tre huvuddelarna av hjärnan?',
    answer: 'De tre huvuddelarna av hjärnan är storhjärnan (cerebrum), lillhjärnan (cerebellum) och hjärnstammen.',
    category: 'medicine',
    difficulty: 'intermediate',
  },
  {
    id: 'med8',
    question: 'Vad är funktion av levern?',
    answer: 'Levern har över 500 funktioner, inklusive avgiftning av blodet, produktion av proteiner och kolesterol, lagring av vitaminer och mineraler, och bearbetning av läkemedel.',
    category: 'medicine',
    difficulty: 'intermediate',
  },
  {
    id: 'med9',
    question: 'Vad är diafragmans funktion?',
    answer: 'Diafragman är den primära andningsmuskeln som separerar bröstkorgen från bukhålan. Den kontraherar och utvidgar bröstkorgen för att möjliggöra inandning.',
    category: 'medicine',
    difficulty: 'intermediate',
  },
  {
    id: 'med10',
    question: 'Vilka ben utgör skuldergördeln?',
    answer: 'Skuldergördeln består av nyckelbenet (clavicula) och skulderbladet (scapula), som förbinder övre extremiteterna med axialskelettet.',
    category: 'medicine',
    difficulty: 'intermediate',
  },
  
  // Coding flashcards
  {
    id: 'code1',
    question: 'Vad är variablar i JavaScript?',
    answer: 'Variabler i JavaScript är behållare för att lagra data. De kan deklareras med nyckelorden var, let eller const.',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'code2',
    question: 'Vad är skillnaden mellan "==" och "===" i JavaScript?',
    answer: '"==" kontrollerar likhet med typkonvertering, medan "===" kontrollerar både värdet och datatypen utan typkonvertering.',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'code3',
    question: 'Förklara vad en array är i JavaScript',
    answer: 'En array i JavaScript är en ordnad lista av värden som kan innehålla data av olika typer. Arrays deklareras med hakparenteser, t.ex. [1, 2, 3].',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'code4',
    question: 'Vad är en funktion i JavaScript?',
    answer: 'En funktion i JavaScript är ett återanvändbart kodblock som utför en specifik uppgift. Den kan acceptera parametrar, utföra åtgärder och returnera ett värde.',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'code5',
    question: 'Vad är en loop i JavaScript och nämn två typer',
    answer: 'En loop i JavaScript används för att upprepa en kodsektion flera gånger. Två vanliga typer är for-loop och while-loop.',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'code6',
    question: 'Vad är en React-komponent?',
    answer: 'En React-komponent är en självständig, återanvändbar kod som renderar en del av användargränssnittet. Komponenter kan vara funktionella eller klassbaserade.',
    category: 'coding',
    difficulty: 'intermediate',
  },
  {
    id: 'code7',
    question: 'Vad är "props" i React?',
    answer: '"Props" (properties) i React är ett sätt att skicka data från en överordnad komponent till en underordnad komponent. De är skrivskyddade och används för att göra komponenter dynamiska.',
    category: 'coding',
    difficulty: 'intermediate',
  },
  {
    id: 'code8',
    question: 'Förklara React "state"',
    answer: '"State" i React är ett objekt som innehåller data specifik för en komponent och kan ändras över tid. När state uppdateras, renderas komponenten om.',
    category: 'coding',
    difficulty: 'intermediate',
  },
  {
    id: 'code9',
    question: 'Vad är "useEffect" i React?',
    answer: '"useEffect" är en React-hook som används för sidoeffekter i funktionella komponenter, som datahämtning, direkt DOM-manipulation, eller prenumerationer. Den körs efter rendering.',
    category: 'coding',
    difficulty: 'intermediate',
  },
  {
    id: 'code10',
    question: 'Vad är "virtuell DOM" i React?',
    answer: 'Den virtuella DOM i React är en lättviktsrepresentation av den faktiska DOM. React använder den för att beräkna minsta nödvändiga ändringar innan uppdatering av den riktiga DOM, vilket förbättrar prestanda.',
    category: 'coding',
    difficulty: 'intermediate',
  },
  
  // Math flashcards
  {
    id: 'math1',
    question: 'Vad är Pythagoras sats?',
    answer: 'Pythagoras sats säger att i en rätvinklig triangel är kvadraten på hypotenusan lika med summan av kvadraterna på kateterna: a² + b² = c².',
    category: 'math',
    difficulty: 'beginner',
  },
  {
    id: 'math2',
    question: 'Vad är en linjär ekvation?',
    answer: 'En linjär ekvation är en ekvation av första graden, vanligtvis skriven som ax + b = c, där a, b och c är konstanter och a ≠ 0.',
    category: 'math',
    difficulty: 'beginner',
  },
  {
    id: 'math3',
    question: 'Vad är prioriteringsreglerna i matematik?',
    answer: 'Prioriteringsreglerna avgör i vilken ordning operationer ska utföras: 1) Parenteser, 2) Exponenter, 3) Multiplikation och division (från vänster till höger), 4) Addition och subtraktion (från vänster till höger).',
    category: 'math',
    difficulty: 'beginner',
  },
  {
    id: 'math4',
    question: 'Vad är en primtalsfaktorisering?',
    answer: 'Primtalsfaktorisering är att uttrycka ett tal som en produkt av primtal. Till exempel är primtalsfaktoriseringen av 12: 2² × 3.',
    category: 'math',
    difficulty: 'beginner',
  },
  {
    id: 'math5',
    question: 'Vad är arean av en cirkel?',
    answer: 'Arean av en cirkel beräknas med formeln A = πr², där r är cirkelns radie och π (pi) är cirka 3,14159.',
    category: 'math',
    difficulty: 'beginner',
  },
  
  // Python flashcards
  {
    id: 'py1',
    question: 'Vad är Python?',
    answer: 'Python är ett högniåspråk som är känt för sin enkla syntax och läsbarhet. Det är ett av de mest populära programmeringsspråken för datavetenskap, AI och webbutveckling.',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'py2',
    question: 'Vad är skillnaden mellan en lista och en tuple i Python?',
    answer: 'En lista är föränderlig (mutable) medan en tuple är oföränderlig (immutable). Listor skapas med hakparenteser [] och tuples med vanliga parenteser ().',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'py3',
    question: 'Hur skapar man en funktion i Python?',
    answer: 'En funktion i Python definieras med nyckelordet "def" följt av funktionsnamnet och parametrar inom parenteser. Exempel: def greet(name): return f"Hello, {name}!"',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'py4',
    question: 'Vad är list comprehension i Python?',
    answer: 'List comprehension är ett koncist sätt att skapa listor baserat på befintliga listor. Exempel: [x*2 for x in range(10) if x % 2 == 0] skapar en lista med dubbla värden av jämna tal från 0-9.',
    category: 'coding',
    difficulty: 'beginner',
  },
  {
    id: 'py5',
    question: 'Vad är en dictionary i Python?',
    answer: 'En dictionary i Python är en samling av key-value par. De skapas med klammerparenteser {} och kommatecken mellan paren. Exempel: {"name": "John", "age": 30}',
    category: 'coding',
    difficulty: 'beginner',
  },
  
  // Svenska flashcards
  {
    id: 'swe1',
    question: 'Hur säger man "hello" på svenska?',
    answer: '"Hej" är det vanligaste sättet att säga "hello" på svenska. Man kan också säga "God dag" i mer formella situationer.',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'swe2',
    question: 'Hur säger man "thank you" på svenska?',
    answer: '"Tack" betyder "thank you" på svenska. För "thank you very much" säger man "tack så mycket".',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'swe3',
    question: 'Hur säger man "my name is..." på svenska?',
    answer: '"Jag heter..." är det svenska uttrycket för "my name is...". Exempel: "Jag heter Johan" betyder "My name is Johan".',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'swe4',
    question: 'Hur säger man "how are you?" på svenska?',
    answer: '"Hur mår du?" är det svenska uttrycket för "how are you?". Ett mer informellt sätt är "Läget?" som motsvarar "What\'s up?"',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'swe5',
    question: 'Hur räknar man från 1 till 5 på svenska?',
    answer: 'På svenska räknar man från 1 till 5: "ett, två, tre, fyra, fem".',
    category: 'languages',
    difficulty: 'beginner',
  },
  
  // Physics flashcards
  {
    id: 'phys1',
    question: 'Vad är Newtons första lag?',
    answer: 'Newtons första lag (tröghetslagen) säger att ett föremål i vila förblir i vila och ett föremål i rörelse förblir i rörelse med konstant hastighet såvida ingen yttre kraft påverkar det.',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'phys2',
    question: 'Vad mäter enheten Newton?',
    answer: 'Newton (N) är SI-enheten för kraft. 1 Newton är den kraft som behövs för att accelerera 1 kg med 1 meter per sekund i kvadrat (1 N = 1 kg·m/s²).',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'phys3',
    question: 'Vad är energibevarandeprincipen?',
    answer: 'Energibevarandeprincipen säger att den totala energin i ett isolerat system förblir konstant över tid. Energi kan varken skapas eller förstöras, bara omvandlas från en form till en annan.',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'phys4',
    question: 'Vad är skillnaden mellan massa och vikt?',
    answer: 'Massa är ett mått på mängden materia i ett objekt och förblir konstant oavsett plats. Vikt är den gravitationskraft som verkar på ett objekt och varierar beroende på gravitationsfältet (t.ex. är mindre på månen än på jorden).',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'phys5',
    question: 'Vad är Pascals princip?',
    answer: 'Pascals princip säger att tryck som appliceras på en innesluten vätska överförs oförändrat till alla delar av vätskan och till behållarens väggar. Detta är grunden för hydrauliska system.',
    category: 'science',
    difficulty: 'intermediate',
  },
  
  // Calculus flashcards
  {
    id: 'calc1',
    question: 'Vad är en derivata?',
    answer: 'En derivata är ett mått på hur snabbt en funktion förändras vid en specifik punkt. Geometriskt representerar derivatan lutningen på tangentlinjen till funktionen vid den punkten.',
    category: 'math',
    difficulty: 'advanced',
  },
  {
    id: 'calc2',
    question: 'Vad är kedjeregeln inom derivering?',
    answer: 'Kedjeregeln används för att derivera sammansatta funktioner. Om y = f(g(x)), då är y\' = f\'(g(x)) · g\'(x), där f\' och g\' är derivatorna av funktionerna f och g.',
    category: 'math',
    difficulty: 'advanced',
  },
  {
    id: 'calc3',
    question: 'Vad är en obestämd integral?',
    answer: 'En obestämd integral, ∫f(x)dx, är en familj av funktioner vars derivata är f(x). Den representerar antiderivatan till f(x) och inkluderar en godtycklig konstant C.',
    category: 'math',
    difficulty: 'advanced',
  },
  {
    id: 'calc4',
    question: 'Vad är Fundamentalsatsen för kalkyl?',
    answer: 'Fundamentalsatsen för kalkyl etablerar sambandet mellan derivering och integrering som inversa operationer. Den säger att om F är en antiderivata till f, då är den bestämda integralen av f från a till b lika med F(b) - F(a).',
    category: 'math',
    difficulty: 'advanced',
  },
  {
    id: 'calc5',
    question: 'Vad är en partiell derivata?',
    answer: 'En partiell derivata är derivatan av en funktion med flera variabler med avseende på en variabel, medan övriga variabler hålls konstanta. Den noteras ofta som ∂f/∂x för partiell derivata av f med avseende på x.',
    category: 'math',
    difficulty: 'advanced',
  },
  
  // AI flashcards
  {
    id: 'ai1',
    question: 'Vad är maskininlärning?',
    answer: 'Maskininlärning är en del av AI där system automatiskt lär sig och förbättras från erfarenhet utan att vara explicit programmerade. Det innefattar algoritmer som kan lära sig mönster från data.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'ai2',
    question: 'Vad är skillnaden mellan övervakad och oövervakad inlärning?',
    answer: 'Övervakad inlärning använder märkta data där algoritmen lär sig att förutsäga utdata från indata. Oövervakad inlärning använder omärkta data för att hitta mönster eller strukturer utan förutbestämda etiketter.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'ai3',
    question: 'Vad är ett neuralt nätverk?',
    answer: 'Ett neuralt nätverk är en maskininlärningsmodell inspirerad av hjärnans struktur. Det består av lager av sammankopplade noder (neuroner) som bearbetar information, lär sig från data och kan identifiera komplexa mönster.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'ai4',
    question: 'Vad är "djupinlärning" (deep learning)?',
    answer: 'Djupinlärning är en underkategori av maskininlärning som använder neurala nätverk med flera dolda lager (djupa neurala nätverk) för att lära sig hierarkiska representationer av data. Det har revolutionerat områden som bildklassificering, språkbehandling och spel.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'ai5',
    question: 'Vad är en "confusion matrix" inom maskininlärning?',
    answer: 'En confusion matrix är en tabell som används för att utvärdera prestandan hos en klassificeringsmodell. Den visar antalet sanna positiva, falska positiva, sanna negativa och falska negativa resultat, vilket hjälper till att beräkna mått som precision, recall och F1-score.',
    category: 'coding',
    difficulty: 'advanced',
  },
];

const initialUserStats: UserStats = {
  streak: 0,
  lastActivity: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  cardsLearned: 0,
  achievements: [],
  completedPrograms: [],
};

export const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedFlashcards = localStorage.getItem('flashcards');
    const loadedPrograms = localStorage.getItem('programs');
    const loadedCategories = localStorage.getItem('categories');
    const loadedUserStats = localStorage.getItem('userStats');

    if (loadedFlashcards) {
      setFlashcards(JSON.parse(loadedFlashcards));
    } else {
      setFlashcards(initialFlashcards);
    }

    if (loadedPrograms) {
      setPrograms(JSON.parse(loadedPrograms));
    } else {
      setPrograms(initialPrograms);
    }

    if (loadedCategories) {
      setCategories(JSON.parse(loadedCategories));
    } else {
      setCategories(initialCategories);
    }

    if (loadedUserStats) {
      setUserStats(JSON.parse(loadedUserStats));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  const addFlashcard = (flashcard: Omit<Flashcard, 'id'>) => {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: `flashcard-${Date.now()}`,
      correctCount: 0,
      incorrectCount: 0,
      learned: false,
      reviewLater: false,
    };

    setFlashcards((prev) => [...prev, newFlashcard]);
    toast({
      title: "Nytt flashcard skapat",
      description: "Ditt flashcard har lagts till i din samling.",
    });
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
    );
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id));
    toast({
      title: "Flashcard borttaget",
      description: "Ditt flashcard har tagits bort från din samling.",
    });
  };

  const getFlashcard = (id: string) => {
    return flashcards.find((card) => card.id === id);
  };

  const getFlashcardsByCategory = (category: string) => {
    return flashcards.filter((card) => card.category === category);
  };

  const getFlashcardsByProgram = (programId: string) => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return [];
    
    return program.flashcards
      .map((id) => flashcards.find((card) => card.id === id))
      .filter((card): card is Flashcard => card !== undefined);
  };

  const updateUserStats = (updates: Partial<UserStats>) => {
    setUserStats((prev) => {
      const newStats = { ...prev, ...updates };
      
      // Check streak
      const today = new Date().setHours(0, 0, 0, 0);
      const lastDay = prev.lastActivity ? new Date(prev.lastActivity).setHours(0, 0, 0, 0) : 0;
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      if (today - lastDay > oneDayMs) {
        if (today - lastDay <= oneDayMs * 2) {
          // User was active yesterday, maintain or increase streak
          newStats.streak = prev.streak + 1;
          
          // Check for streak achievements
          if (newStats.streak === 3) {
            addAchievement({
              name: "3 dagars streak",
              description: "Du har studerat 3 dagar i rad!",
              icon: "flame",
            });
          } else if (newStats.streak === 7) {
            addAchievement({
              name: "7 dagars streak",
              description: "Du har studerat en hel vecka i rad!",
              icon: "flame",
            });
          } else if (newStats.streak === 30) {
            addAchievement({
              name: "30 dagars streak",
              description: "Du har studerat en hel månad i rad!",
              icon: "flame",
            });
          }
        } else {
          // User was not active yesterday, reset streak
          newStats.streak = 1;
        }
      }
      
      newStats.lastActivity = today;
      
      return newStats;
    });
  };

  const addAchievement = (achievement: Omit<UserAchievement, 'id' | 'dateEarned'>) => {
    const newAchievement: UserAchievement = {
      ...achievement,
      id: `achievement-${Date.now()}`,
      dateEarned: Date.now(),
      displayed: false,
    };

    setUserStats((prev) => {
      // Check if achievement already exists
      const exists = prev.achievements.some((a) => a.name === achievement.name);
      if (exists) return prev;
      
      return {
        ...prev,
        achievements: [...prev.achievements, newAchievement],
      };
    });

    toast({
      title: "Ny prestation upplåst!",
      description: achievement.name,
    });
  };

  const markProgramCompleted = (programId: string) => {
    setUserStats((prev) => {
      // Check if already completed
      if (prev.completedPrograms.includes(programId)) {
        return prev;
      }
      
      return {
        ...prev,
        completedPrograms: [...prev.completedPrograms, programId],
      };
    });

    setPrograms((prev) =>
      prev.map((program) =>
        program.id === programId ? { ...program, completedByUser: true } : program
      )
    );

    const program = programs.find((p) => p.id === programId);
    if (program) {
      toast({
        title: "Träningsprogram klart!",
        description: `Du har slutfört träningsprogrammet: ${program.name}`,
      });

      addAchievement({
        name: `Slutfört: ${program.name}`,
        description: `Du har slutfört ${program.name} programmet!`,
        icon: "trophy",
      });
    }
  };

  const getProgram = (programId: string) => {
    return programs.find((program) => program.id === programId);
  };

  const getProgramsByCategory = (category: string) => {
    return programs.filter((program) => program.category === category);
  };

  const getCategory = (categoryId: string) => {
    return categories.find((category) => category.id === categoryId);
  };

  const contextValue: LocalStorageContextType = {
    flashcards,
    programs,
    categories,
    userStats,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcard,
    getFlashcardsByCategory,
    getFlashcardsByProgram,
    updateUserStats,
    addAchievement,
    markProgramCompleted,
    getProgram,
    getProgramsByCategory,
    getCategory,
  };

  return (
    <LocalStorageContext.Provider value={contextValue}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};
