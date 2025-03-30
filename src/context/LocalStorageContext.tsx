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
  {
    id: 'geography',
    name: 'Geografi',
    icon: 'globe',
    description: 'Utforska världen, länder, kulturer och landformer',
    color: 'bg-learny-blue',
  },
  {
    id: 'vehicles',
    name: 'Fordon',
    icon: 'car',
    description: 'Lär dig om bilar, motorcyklar, båtar och flygplan',
    color: 'bg-learny-red',
  },
  {
    id: 'economics',
    name: 'Ekonomi',
    icon: 'banknote',
    description: 'Förstå grundläggande och avancerade ekonomiska koncept',
    color: 'bg-learny-green',
  },
  {
    id: 'history',
    name: 'Historia',
    icon: 'book',
    description: 'Utforska viktiga historiska händelser och perioder',
    color: 'bg-learny-purple',
  },
];

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
  {
    id: 'geography-basics',
    name: 'Geografiska grundbegrepp',
    description: 'Lär dig grundläggande geografiska termer och landformer',
    category: 'geography',
    difficulty: 'beginner',
    flashcards: ['geo1', 'geo2', 'geo3', 'geo4', 'geo5'],
    hasExam: true,
  },
  {
    id: 'europe-geography',
    name: 'Europas geografi',
    description: 'Lär dig om Europas länder, huvudstäder och landformer',
    category: 'geography',
    difficulty: 'intermediate',
    flashcards: ['geo6', 'geo7', 'geo8', 'geo9', 'geo10'],
    hasExam: true,
  },
  {
    id: 'world-geography',
    name: 'Världens geografi',
    description: 'Utforska världens kontinenter, oceaner och kulturer',
    category: 'geography',
    difficulty: 'advanced',
    flashcards: ['geo11', 'geo12', 'geo13', 'geo14', 'geo15'],
    hasExam: true,
  },
  {
    id: 'climate-zones',
    name: 'Klimatzoner och ekosystem',
    description: 'Fördjupa dig i jordens klimatzoner och ekosystem',
    category: 'geography',
    difficulty: 'expert',
    flashcards: ['geo16', 'geo17', 'geo18', 'geo19', 'geo20'],
    hasExam: true,
  },
  {
    id: 'car-basics',
    name: 'Bilens grundläggande delar',
    description: 'Lär dig om bilens grundläggande komponenter och funktion',
    category: 'vehicles',
    difficulty: 'beginner',
    flashcards: ['veh1', 'veh2', 'veh3', 'veh4', 'veh5'],
    hasExam: true,
  },
  {
    id: 'motorcycle-mechanics',
    name: 'Motorcykelmekanik',
    description: 'Förstå motorcykelns uppbyggnad och mekanik',
    category: 'vehicles',
    difficulty: 'intermediate',
    flashcards: ['veh6', 'veh7', 'veh8', 'veh9', 'veh10'],
    hasExam: true,
  },
  {
    id: 'airplane-systems',
    name: 'Flygplansystem',
    description: 'Lär dig om flygplanets olika system och komponenter',
    category: 'vehicles',
    difficulty: 'advanced',
    flashcards: ['veh11', 'veh12', 'veh13', 'veh14', 'veh15'],
    hasExam: true,
  },
  {
    id: 'ship-navigation',
    name: 'Fartygsnavigation',
    description: 'Utforska maritima navigationssystem och tekniker',
    category: 'vehicles',
    difficulty: 'expert',
    flashcards: ['veh16', 'veh17', 'veh18', 'veh19', 'veh20'],
    hasExam: true,
  },
  {
    id: 'econ-basics',
    name: 'Ekonomiska grundbegrepp',
    description: 'Lär dig grundläggande ekonomiska koncept och termer',
    category: 'economics',
    difficulty: 'beginner',
    flashcards: ['econ1', 'econ2', 'econ3', 'econ4', 'econ5'],
    hasExam: true,
  },
  {
    id: 'personal-finance',
    name: 'Privatekonomi',
    description: 'Förstå hur du bäst hanterar din personliga ekonomi',
    category: 'economics',
    difficulty: 'intermediate',
    flashcards: ['econ6', 'econ7', 'econ8', 'econ9', 'econ10'],
    hasExam: true,
  },
  {
    id: 'investment-strategies',
    name: 'Investeringsstrategier',
    description: 'Lär dig om olika metoder för att investera och spara',
    category: 'economics',
    difficulty: 'advanced',
    flashcards: ['econ11', 'econ12', 'econ13', 'econ14', 'econ15'],
    hasExam: true,
  },
  {
    id: 'global-finance',
    name: 'Global finansekonomi',
    description: 'Utforska komplexa globala finansiella system och marknader',
    category: 'economics',
    difficulty: 'expert',
    flashcards: ['econ16', 'econ17', 'econ18', 'econ19', 'econ20'],
    hasExam: true,
  },
  {
    id: 'ancient-history',
    name: 'Antikens historia',
    description: 'Utforska de gamla civilisationerna och deras arv',
    category: 'history',
    difficulty: 'beginner',
    flashcards: ['hist1', 'hist2', 'hist3', 'hist4', 'hist5'],
    hasExam: true,
  },
  {
    id: 'medieval-history',
    name: 'Medeltiden',
    description: 'Lär dig om livet och samhället under medeltiden',
    category: 'history',
    difficulty: 'intermediate',
    flashcards: ['hist6', 'hist7', 'hist8', 'hist9', 'hist10'],
    hasExam: true,
  },
  {
    id: 'modern-history',
    name: 'Modern historia',
    description: 'Utforska viktiga händelser från 1900-talet till idag',
    category: 'history',
    difficulty: 'advanced',
    flashcards: ['hist11', 'hist12', 'hist13', 'hist14', 'hist15'],
    hasExam: true,
  },
  {
    id: 'war-history',
    name: 'Krigshistoria',
    description: 'Djupdykning i världens största konflikter och deras effekter',
    category: 'history',
    difficulty: 'expert',
    flashcards: ['hist16', 'hist17', 'hist18', 'hist19', 'hist20'],
    hasExam: true,
  },
  {
    id: 'med-surgery',
    name: 'Kirurgiska tekniker',
    description: 'Avancerade kirurgiska procedurer och tekniker',
    category: 'medicine',
    difficulty: 'expert',
    flashcards: ['med-ex1', 'med-ex2', 'med-ex3', 'med-ex4', 'med-ex5'],
    hasExam: true,
  },
  {
    id: 'js-advanced',
    name: 'Avancerad JavaScript',
    description: 'Djupdyk i JavaScript-mönster och prestationsoptimering',
    category: 'coding',
    difficulty: 'expert',
    flashcards: ['code-ex1', 'code-ex2', 'code-ex3', 'code-ex4', 'code-ex5'],
    hasExam: true,
  },
  {
    id: 'math-topology',
    name: 'Topologi',
    description: 'Utforska matematikens abstrakta områden inom topologi',
    category: 'math',
    difficulty: 'expert',
    flashcards: ['math-ex1', 'math-ex2', 'math-ex3', 'math-ex4', 'math-ex5'],
    hasExam: true,
  },
];

const initialFlashcards: Flashcard[] = [
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
  {
    id: 'ai1',
    question: 'Vad är maskininlärning?',
    answer: 'Maskininlärning är en delmängd av artificiell intelligens där datorer lär sig från data utan att explicit programmeras. Målet är att automatiskt identifiera mönster och fatta beslut med minimal mänsklig inblandning.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'ai2',
    question: 'Vad är skillnaden mellan övervakad och oövervakad inlärning?',
    answer: 'Övervakad inlärning använder märkta träningsdata med kända resultat. Oövervakad inlärning arbetar med omärkta data och försöker hitta mönster eller grupperingar utan förutbestämda svar.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'ai3',
    question: 'Vad är ett neuralt nätverk?',
    answer: 'Ett neuralt nätverk är en beräkningsmodell inspirerad av hjärnans neuroner. Det består av sammankopplade noder (neuroner) organiserade i lager som bearbetar information sekventiellt för att lösa komplexa problem som bild- och taligenkänning.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'ai4',
    question: 'Vad är djupinlärning (deep learning)?',
    answer: 'Djupinlärning är en underkategori av maskininlärning som använder neurala nätverk med många lager (därav "djup"). Det kan automatiskt extrahera hierarkiska funktioner från data, vilket gör det särskilt effektivt för bild-, ljud- och textanalys.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'ai5',
    question: 'Vad är "overfitting" inom maskininlärning?',
    answer: '"Overfitting" inträffar när en modell lär sig träningsdata för väl, inklusive brus och outliers. Detta gör att modellen presterar bra på träningsdata men dåligt på nya, osedda data eftersom den inte kan generalisera.',
    category: 'coding',
    difficulty: 'advanced',
  },
  {
    id: 'sci1',
    question: 'Vad är skillnaden mellan ett grundämne och en kemisk förening?',
    answer: 'Ett grundämne består av endast en typ av atom och kan inte brytas ner ytterligare genom kemiska reaktioner. En kemisk förening innehåller två eller fler olika typer av atomer (grundämnen) som är kemiskt bundna.',
    category: 'science',
    difficulty: 'beginner',
  },
  {
    id: 'sci2',
    question: 'Vad är fotosyntesens funktion?',
    answer: 'Fotosyntesen är processen där gröna växter och vissa andra organismer omvandlar ljusenergi till kemisk energi. De använder solljus, koldioxid och vatten för att producera glukos och syre.',
    category: 'science',
    difficulty: 'beginner',
  },
  {
    id: 'sci3',
    question: 'Vad är skillnaden mellan atomer och molekyler?',
    answer: 'En atom är den minsta enheten av ett grundämne som behåller dess kemiska egenskaper. En molekyl är en grupp av atomer som är kemiskt bundna tillsammans och fungerar som en enhet.',
    category: 'science',
    difficulty: 'beginner',
  },
  {
    id: 'sci4',
    question: 'Vad är vattnets kretslopp?',
    answer: 'Vattnets kretslopp är den kontinuerliga rörelsen av vatten på, ovan och under jordens yta. Det innefattar avdunstning, kondensation, nederbörd, infiltration, avrinning och grundvattenflöde.',
    category: 'science',
    difficulty: 'beginner',
  },
  {
    id: 'sci5',
    question: 'Vad är en cell?',
    answer: 'En cell är den minsta strukturella och funktionella enheten i alla levande organismer. Den innehåller organeller som utför specifika funktioner för att upprätthålla liv, omgiven av ett cellmembran.',
    category: 'science',
    difficulty: 'beginner',
  },
  {
    id: 'sci6',
    question: 'Vad är epigenetik?',
    answer: 'Epigenetik är studiet av förändringar i genuttryck som inte involverar förändringar i den underliggande DNA-sekvensen. Dessa förändringar kan påverkas av miljö, livsstil och utveckling.',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'sci7',
    question: 'Vad är termodynamikens andra lag?',
    answer: 'Termodynamikens andra lag säger att entropin (oordningen) i ett isolerat system alltid kommer att öka över tid. Det förklarar varför värme flödar från varmare till kallare objekt och inte tvärtom.',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'sci8',
    question: 'Hur fungerar immunsystemet?',
    answer: 'Immunsystemet är kroppens försvarsmekanism mot infektioner och sjukdomar. Det består av vita blodkroppar, antikroppar, komplementsystemet, lymfsystemet, mjälten, thymus och benmärgen, som tillsammans identifierar och eliminerar patogener.',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'sci9',
    question: 'Vad är ett kvanttal?',
    answer: 'Kvanttal är värden som beskriver kvantmekaniska egenskaper hos partiklar, såsom energi, rörelsemängdsmoment, spinn och laddning. De är ofta begränsade till diskreta (kvantiserade) värden snarare än kontinuerliga.',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'sci10',
    question: 'Vad är en kemisk katalysator?',
    answer: 'En katalysator är ett ämne som ökar hastigheten på en kemisk reaktion utan att själv förbrukas i processen. Den fungerar genom att sänka aktiveringsenergin som krävs för att reaktionen ska ske.',
    category: 'science',
    difficulty: 'intermediate',
  },
  {
    id: 'sci11',
    question: 'Vad är Higgs-boson?',
    answer: 'Higgs-boson är en elementarpartikel i standardmodellen för partikelfysik, associerad med Higgs-fältet som ger massa till andra elementarpartiklar. Den upptäcktes experimentellt vid CERN 2012.',
    category: 'science',
    difficulty: 'advanced',
  },
  {
    id: 'sci12',
    question: 'Vad är CRISPR-Cas9?',
    answer: 'CRISPR-Cas9 är en genredigeringsteknik som gör det möjligt att modifiera genomsekvenser med hög precision. Den fungerar som genetiska "saxar" som kan klippa DNA vid specifika platser, vilket möjliggör borttagning eller infogning av genetiskt material.',
    category: 'science',
    difficulty: 'advanced',
  },
  {
    id: 'sci13',
    question: 'Vad är mörk materia?',
    answer: 'Mörk materia är en hypotetisk form av materia som inte interagerar med det elektromagnetiska fältet men påverkar universum gravitationellt. Den utgör cirka 27% av universum men kan inte direkt observeras, endast detekteras genom dess gravitationseffekter.',
    category: 'science',
    difficulty: 'advanced',
  },
  {
    id: 'sci14',
    question: 'Vad är superkonduktivitet?',
    answer: 'Superkonduktivitet är ett fenomen där vissa material får noll elektriskt motstånd och utesluter magnetfält när de kyls under en kritisk temperatur. Detta möjliggör strömflöde utan energiförluster och har viktiga teknologiska tillämpningar.',
    category: 'science',
    difficulty: 'advanced',
  },
  {
    id: 'sci15',
    question: 'Vad är proteinveckning?',
    answer: 'Proteinveckning är processen där en linjär kedja av aminosyror (polypeptid) antar sin tredimensionella struktur. Denna struktur är avgörande för proteinets funktion, och felveckning kan leda till sjukdomar som Alzheimers och Parkinsons.',
    category: 'science',
    difficulty: 'advanced',
  },
  {
    id: 'sci16',
    question: 'Vad är kvantvärmeeffekter i kondenserad materia?',
    answer: 'Kvantvärmeeffekter i kondenserad materia involverar hur kvantmekaniska egenskaper påverkar termiska fenomen i fasta material vid extremt låga temperaturer, där klassisk termodynamik inte längre gäller. Detta inkluderar fenomen som suprafluiditet och Bose-Einstein-kondensat.',
    category: 'science',
    difficulty: 'expert',
  },
  {
    id: 'sci17',
    question: 'Vad är topologiska kvanttillstånd?',
    answer: 'Topologiska kvanttillstånd är exotiska tillstånd av materia som karaktäriseras av topologiska invarianter och kantlägen. De är robusta mot lokala störningar och har potential för feltolerant kvantberäkning.',
    category: 'science',
    difficulty: 'expert',
  },
  {
    id: 'sci18',
    question: 'Vad är enzymkinetik och Michaelis-Menten-ekvationen?',
    answer: 'Enzymkinetik studerar reaktionshastigheten för enzymkatalyserade reaktioner. Michaelis-Menten-ekvationen (v = Vmax[S]/(Km+[S])) beskriver förhållandet mellan substratkoncentration och reaktionshastighet, där Vmax är maximal hastighet och Km är Michaelis-konstanten.',
    category: 'science',
    difficulty: 'expert',
  },
  {
    id: 'sci19',
    question: 'Förklara Standardmodellen för partikelfysik',
    answer: 'Standardmodellen är en teoretisk ram som beskriver tre av naturens fyra grundläggande krafter (elektromagnetism, svag kärnkraft och stark kärnkraft) och klassificerar alla kända elementarpartiklar. Den inkluderar 17 partiklar: 12 fermioner (kvarkar och leptoner), 4 vektorbosoner och Higgs-bosonen.',
    category: 'science',
    difficulty: 'expert',
  },
  {
    id: 'sci20',
    question: 'Vad är kvantinformationsteori?',
    answer: 'Kvantinformationsteori utvidgar klassisk informationsteori till kvantmekaniska system. Den studerar hur kvantinformation kan bearbetas och överföras, och är grunden för kvantdatorer, kvantkryptografi och kvanttelekommunikation. Centrala begrepp inkluderar qubits, kvantsammanflätning och kvantfel-korrigering.',
    category: 'science',
    difficulty: 'expert',
  },
  {
    id: 'lang1',
    question: 'Vad är skillnaden mellan verb och substantiv?',
    answer: 'Verb beskriver handlingar, händelser eller tillstånd (t.ex. springa, äta, vara). Substantiv är namn på personer, platser, saker eller idéer (t.ex. hund, stad, kärlek).',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'lang2',
    question: 'Vad är ett fonem?',
    answer: 'Ett fonem är den minsta betydelseskiljande ljudenheten i ett språk. Det är ett abstrakt koncept som representerar ljud som kan skilja mellan ord (t.ex. skillnaden mellan "p" och "b" i "pil" och "bil").',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'lang3',
    question: 'Vad är skillnaden mellan homofonar och homonymer?',
    answer: 'Homofonar är ord som låter likadant men har olika stavning och betydelse (t.ex. "hjul" och "jul"). Homonymer är ord som stavas och låter likadant men har olika betydelser (t.ex. "får" som djur eller verb).',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'lang4',
    question: 'Vad är ett prefix?',
    answer: 'Ett prefix är en affix som placeras i början av ett ord för att modifiera dess betydelse. Exempel: "o-" i "omöjlig", "miss-" i "missförstånd".',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'lang5',
    question: 'Vad är subjekt och predikat i en mening?',
    answer: 'Subjektet är den del av meningen som utför handlingen eller som meningen handlar om. Predikatet innehåller verbet och beskriver vad subjektet gör eller är. I meningen "Barnet springer", är "barnet" subjekt och "springer" predikat.',
    category: 'languages',
    difficulty: 'beginner',
  },
  {
    id: 'lang6',
    question: 'Vad är en morfem?',
    answer: 'Ett morfem är den minsta meningsbärande enheten i ett språk. Det kan vara ett självständigt ord (t.ex. "hus") eller en del av ett ord som ändrar dess betydelse (t.ex. "o-" i "omöjlig" eller "-het" i "möjlighet").',
    category: 'languages',
    difficulty: 'intermediate',
  },
  {
    id: 'lang7',
    question: 'Vad kännetecknar analytiska språk jämfört med syntetiska språk?',
    answer: 'Analytiska språk (som engelska) uttrycker grammatiska relationer huvudsakligen genom ordföljd och hjälpord. Syntetiska språk (som ryska) använder mer böjning (ändelser, affix) för att uttrycka grammatiska funktioner och relationer.',
    category: 'languages',
    difficulty: 'intermediate',
  },
  {
    id: 'lang8',
    question: 'Vad är Sapir-Whorf-hypotesen?',
    answer: 'Sapir-Whorf-hypotesen föreslår att det språk vi talar formar hur vi tänker och uppfattar världen. Den finns i två versioner: stark (språklig determinism) och svag (språklig relativism), där den senare är mer accepterad idag.',
    category: 'languages',
    difficulty: 'intermediate',
  },
  {
    id: 'lang9',
    question: 'Vad är en diftong?',
    answer: 'En diftong är en kombination av två vokalljud som uttalas i en stavelse, där ljudet gradvis övergår från ett vokalljud till ett annat. Exempel är "eu" i "Europa" eller "au" i "augusti".',
    category: 'languages',
    difficulty: 'intermediate',
  },
  {
    id: 'lang10',
    question: 'Vad är skillnaden mellan direkt och indirekt tal?',
    answer: 'Direkt tal återger exakt vad någon har sagt inom citationstecken ("Jag kommer imorgon," sa hon). Indirekt tal rapporterar vad någon har sagt utan att använda deras exakta ord och ofta med grammatiska justeringar (Hon sa att hon skulle komma nästa dag).',
    category: 'languages',
    difficulty: 'intermediate',
  },
  {
    id: 'lang11',
    question: 'Vad är pragmatik inom lingvistik?',
    answer: 'Pragmatik är studiet av hur kontext och situation bidrar till betydelse. Det undersöker hur språk tolkas i verkliga situationer, inklusive implikationer, förhandling av mening, och hur talare använder språk för att uppnå mål utöver det bokstavliga innehållet.',
    category: 'languages',
    difficulty: 'advanced',
  },
  {
    id: 'lang12',
    question: 'Vad är Chomskys generativa grammatik?',
    answer: 'Chomskys generativa grammatik är en teori som föreslår att människor har en medfödd förmåga att lära sig språk genom en universell grammatik. Den fokuserar på de formella regler som gör det möjligt att generera alla grammatiskt korrekta meningar i ett språk med ett begränsat antal regler.',
    category: 'languages',
    difficulty: 'advanced',
  },
  {
    id: 'lang13',
    question: 'Vad är språkliga universalier?',
    answer: 'Språkliga universalier är egenskaper eller mönster som förekommer i alla eller de flesta mänskliga språk. De kan vara absoluta (finns i alla språk) eller tendentiella (statistiskt vanliga). Exempel inkluderar närvaron av substantiv och verb, eller att alla språk har konsonanter och vokaler.',
    category: 'languages',
    difficulty: 'advanced',
  },
  {
    id: 'lang14',
    question: 'Vad är koartikulering?',
    answer: 'Koartikulering är ett fonetiskt fenomen där artikulationen av ett ljud påverkas av intilliggande ljud. Det resulterar i att samma fonem kan uttalas olika beroende på ljudkontexten. Ett exempel är hur "n" uttalas annorlunda i "inköp" jämfört med "ingång".',
    category: 'languages',
    difficulty: 'advanced',
  },
  {
    id: 'lang15',
    question: 'Vad är lexikal semantik?',
    answer: 'Lexikal semantik är studiet av ordbetydelses natur och struktur. Det undersöker hur ord relaterar till varandra (genom synonymi, antonymi, hyponymi, etc.), hur ordbetydelser förändras över tid, och hur ordets betydelse förhåller sig till koncept och objekt i världen.',
    category: 'languages',
    difficulty: 'advanced',
  },
  {
    id: 'lang16',
    question: 'Vad är optimitetsteori i fonologi?',
    answer: 'Optimitetsteori är en lingvistisk modell som föreslår att observerad språklig output härrör från en balans mellan konkurrerande begränsningar. Istället för att tillämpa sekventiella regler utvärderar den samtidigt alla möjliga outputs mot en hierarki av begränsningar för att välja den optimala kandidaten.',
    category: 'languages',
    difficulty: 'expert',
  },
  {
    id: 'lang17',
    question: 'Förklara minimalistprogrammet inom syntaktisk teori',
    answer: 'Minimalistprogrammet, utvecklat av Noam Chomsky, är en approach till generativ grammatik som söker att reducera syntaktisk teori till minimala och nödvändiga begrepp. Det fokuserar på ekonomi och elegans, med antagandet att språk är en optimal lösning för att koppla ihop tanke och ljud genom operationer som Merge och Move.',
    category: 'languages',
    difficulty: 'expert',
  },
  {
    id: 'lang18',
    question: 'Vad är ergativity i språk?',
    answer: 'Ergativity är ett grammatiskt mönster där subjektet i intransitiva verb behandlas grammatiskt samma som objektet i transitiva verb, medan agenten i transitiva verb markeras annorlunda. Detta står i kontrast till ackusativa språk (som engelska och svenska) där subjekt i både transitiva och intransitiva verb markeras likadant.',
    category: 'languages',
    difficulty: 'expert',
  },
  {
    id: 'lang19',
    question: 'Vad är logoforer i språkvetenskap?',
    answer: 'Logoforer är specialiserade pronomen som används för att referera till den person vars tal, tankar, känslor eller allmänna medvetenhet rapporteras. De hjälper till att upprätthålla referentiell klarhet i komplexa diskurskontexter, särskilt i indirekt tal där flera tredjepersonsreferenser kan förekomma.',
    category: 'languages',
    difficulty: 'expert',
  },
  {
    id: 'lang20',
    question: 'Vad är grammatikaliseringsprocessen?',
    answer: 'Grammatikalisering är den diakroniska process där lexikala element (innehållsord) utvecklas till grammatiska morfem (funktionsord). Det involverar ofta fonetisk reduktion, semantisk blekning, och ökad syntaktisk fixering. Ett exempel är utvecklingen av "kommer att" från ett rörelseverbum till en futurummarkör i svenskan.',
    category: 'languages',
    difficulty: 'expert',
  },
];

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};

export const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation of LocalStorageProvider
};
