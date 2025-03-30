// src/data/programs.ts
import { Program } from '@/types/program';

export const initialPrograms: Program[] = [
  // --- Medicine ---
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
    name: 'Anatomi - grunder', // Updated name slightly
    description: 'Lär dig om kroppens struktur och organsystem',
    category: 'medicine',
    difficulty: 'intermediate',
    flashcards: ['med6', 'med7', 'med8', 'med9', 'med10'],
    hasExam: true,
  },
  {
    id: 'med-diseases',
    name: 'Vanliga sjukdomar',
    description: 'Förståelse för vanliga sjukdomstillstånd',
    category: 'medicine',
    difficulty: 'advanced',
    flashcards: ['med-adv1', 'med-adv2'], // Using new advanced cards
    hasExam: true,
  },
  {
    id: 'med-pharma',
    name: 'Farmakologi introduktion',
    description: 'Grundläggande principer för läkemedelsverkan',
    category: 'medicine',
    difficulty: 'expert',
    flashcards: ['med-ex1', 'med-ex2'], // Using new expert cards
    hasExam: true,
  },

  // --- Coding ---
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
    hasExam: true, // Added exam flag
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
    id: 'python-intermediate',
    name: 'Python - Fortsättning',
    description: 'Mer avancerade Python-koncept och datastrukturer',
    category: 'coding',
    difficulty: 'intermediate',
    flashcards: ['py-int1', 'py-int2'], // Using new intermediate cards
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
    id: 'js-advanced', // Renamed to match program ID
    name: 'Avancerad JavaScript',
    description: 'Djupdyk i JavaScript-mönster och interna mekanismer',
    category: 'coding',
    difficulty: 'expert',
    flashcards: ['code-ex1', 'code-ex2'], // Using new expert cards
    hasExam: true,
  },
  {
    id: 'python-advanced',
    name: 'Avancerad Python',
    description: 'Utforska decorators, GIL och andra avancerade Python-ämnen',
    category: 'coding',
    difficulty: 'advanced', // Reclassified as Advanced (Expert could be Metaclasses)
    flashcards: ['py-adv1', 'py-adv2'],
    hasExam: true,
  },
   {
    id: 'python-expert',
    name: 'Python Expert',
    description: 'Djupgående Python-koncept inklusive metaclasses.',
    category: 'coding',
    difficulty: 'expert',
    flashcards: ['py-ex1'],
    hasExam: true,
  },


  // --- Math ---
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
    id: 'math-stats',
    name: 'Statistik grunder',
    description: 'Grundläggande statistiska mått och begrepp',
    category: 'math',
    difficulty: 'intermediate',
    flashcards: ['math-int1', 'math-int2'], // Using new intermediate cards
    hasExam: true,
  },
  {
    id: 'calculus-intro',
    name: 'Introduktion till kalkyl',
    description: 'Grundläggande begrepp inom differential- och integralkalkyl', // Updated description
    category: 'math',
    difficulty: 'advanced',
    flashcards: ['calc1', 'calc2', 'calc3', 'calc4', 'calc5'],
    hasExam: true,
  },
  {
    id: 'math-theory',
    name: 'Matematisk teori',
    description: 'Utforska kända satser och olösta problem',
    category: 'math',
    difficulty: 'expert',
    flashcards: ['math-ex1', 'math-ex2'], // Using new expert cards
    hasExam: true,
  },

  // --- Languages ---
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
    id: 'swedish-grammar',
    name: 'Svensk grammatik - Grunder',
    description: 'Förståelse för svensk meningsbyggnad och böjningar',
    category: 'languages',
    difficulty: 'intermediate',
    flashcards: ['swe-int1', 'swe-int2'], // Using new intermediate cards
    hasExam: true,
  },
   {
    id: 'swedish-advanced',
    name: 'Avancerad Svenska',
    description: 'Nyanser i språket och ovanligare grammatiska former',
    category: 'languages',
    difficulty: 'advanced',
    flashcards: ['swe-adv1'], // Using new advanced card
    hasExam: true,
  },


  // --- Science ---
   {
    id: 'science-basics',
    name: 'Naturvetenskapliga grunder',
    description: 'Grundläggande koncept inom biologi, kemi och fysik',
    category: 'science',
    difficulty: 'beginner',
    flashcards: ['sci-beg1', 'sci-beg2'], // Using new beginner cards
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
    id: 'science-advanced',
    name: 'Avancerad Naturvetenskap',
    description: 'Djupare koncept inom biokemi och termodynamik',
    category: 'science',
    difficulty: 'advanced',
    flashcards: ['chem-adv1', 'bio-adv1'], // Using new advanced cards
    hasExam: true,
  },
  {
    id: 'science-expert',
    name: 'Teoretisk Vetenskap',
    description: 'Utforska kvantmekanikens fundament',
    category: 'science',
    difficulty: 'expert',
    flashcards: ['sci-ex1'], // Using new expert card
    hasExam: true,
  },

  // --- Geography ---
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
    id: 'physical-geography', // Renamed from climate-zones to reflect content
    name: 'Fysisk geografi och system',
    description: 'Fördjupa dig i jordens klimatsystem och geologiska processer',
    category: 'geography',
    difficulty: 'expert',
    flashcards: ['geo16', 'geo17', 'geo18', 'geo19', 'geo20'],
    hasExam: true,
  },

  // --- Vehicles (NEW Programs) ---
  {
    id: 'car-basics',
    name: 'Bilens grunder', // Updated name
    description: 'Lär dig om bilens grundläggande komponenter och funktion',
    category: 'vehicles',
    difficulty: 'beginner',
    flashcards: ['veh1', 'veh2', 'veh3', 'veh4', 'veh5'],
    hasExam: true,
  },
  {
    id: 'engine-tech', // Updated name
    name: 'Motorteknik',
    description: 'Förståelse för förbränningsmotorer och assisterande system',
    category: 'vehicles',
    difficulty: 'intermediate',
    flashcards: ['veh6', 'veh7', 'veh8', 'veh9', 'veh10'],
    hasExam: true,
  },
  {
    id: 'aeronautics-basics', // Updated name
    name: 'Flygteknik grunder',
    description: 'Lär dig om flygningens principer och flygplansystem',
    category: 'vehicles',
    difficulty: 'advanced',
    flashcards: ['veh11', 'veh12', 'veh13', 'veh14', 'veh15'],
    hasExam: true,
  },
  {
    id: 'naval-architecture', // Updated name
    name: 'Fartygsteknik',
    description: 'Utforska principerna bakom fartygs stabilitet och framdrivning',
    category: 'vehicles',
    difficulty: 'expert',
    flashcards: ['veh16', 'veh17', 'veh18', 'veh19', 'veh20'],
    hasExam: true,
  },

  // --- Economics (NEW Programs) ---
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
    id: 'macro-micro-intro', // Updated name
    name: 'Makro- och Mikroekonomi Intro',
    description: 'Förståelse för ekonomisk politik och marknadsprinciper',
    category: 'economics',
    difficulty: 'intermediate',
    flashcards: ['econ6', 'econ7', 'econ8', 'econ9', 'econ10'],
    hasExam: true,
  },
  {
    id: 'trade-market-theory', // Updated name
    name: 'Handels- och Marknadsteori',
    description: 'Lär dig om internationell handel och marknadsmisslyckanden',
    category: 'economics',
    difficulty: 'advanced',
    flashcards: ['econ11', 'econ12', 'econ13', 'econ14', 'econ15'],
    hasExam: true,
  },
  {
    id: 'global-finance-theory', // Updated name
    name: 'Global Finans och Teori',
    description: 'Utforska komplexa finansiella modeller och institutioner',
    category: 'economics',
    difficulty: 'expert',
    flashcards: ['econ16', 'econ17', 'econ18', 'econ19', 'econ20'],
    hasExam: true,
  },

  // --- History (NEW Programs) ---
  {
    id: 'ancient-civ', // Updated name
    name: 'Antika Civilisationer',
    description: 'Utforska de tidiga högkulturerna och deras arv',
    category: 'history',
    difficulty: 'beginner',
    flashcards: ['hist1', 'hist2', 'hist3', 'hist4', 'hist5'],
    hasExam: true,
  },
  {
    id: 'european-history-eras', // Updated name
    name: 'Europeiska Epoker',
    description: 'Lär dig om medeltiden, renässansen och upplysningen',
    category: 'history',
    difficulty: 'intermediate',
    flashcards: ['hist6', 'hist7', 'hist8', 'hist9', 'hist10'],
    hasExam: true,
  },
  {
    id: 'modern-world-history', // Updated name
    name: 'Modern Världshistoria',
    description: 'Utforska viktiga händelser från 1700-talet till Kalla kriget',
    category: 'history',
    difficulty: 'advanced',
    flashcards: ['hist11', 'hist12', 'hist13', 'hist14', 'hist15'],
    hasExam: true,
  },
  {
    id: 'historiography-analysis', // Updated name
    name: 'Historisk Analys och Teori',
    description: 'Djupdykning i specifika konflikter och historieskrivning',
    category: 'history',
    difficulty: 'expert',
    flashcards: ['hist16', 'hist17', 'hist18', 'hist19', 'hist20'],
    hasExam: true,
  },
];