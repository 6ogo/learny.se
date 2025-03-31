import { Flashcard } from '@/types/flashcard';

// Import arrays from category-specific files
import { medicineFlashcards } from './medicine';
import { codingFlashcards } from './coding';
import { mathFlashcards } from './math';
import { languagesFlashcards } from './languages';
import { scienceFlashcards } from './science';
import { geographyFlashcards } from './geography';
import { vehiclesFlashcards } from './vehicles';
import { economicsFlashcards } from './economics';
import { historyFlashcards } from './history';
import { Program } from '@/types/program';

// Combine all flashcards into one array
export const allFlashcards: Flashcard[] = [
  ...medicineFlashcards,
  ...codingFlashcards,
  ...mathFlashcards,
  ...languagesFlashcards,
  ...scienceFlashcards,
  ...geographyFlashcards,
  ...vehiclesFlashcards,
  ...economicsFlashcards,
  ...historyFlashcards,
];

// Optional: Export individual category arrays if they are needed directly elsewhere
export {
  medicineFlashcards,
  codingFlashcards,
  mathFlashcards,
  languagesFlashcards,
  scienceFlashcards,
  geographyFlashcards,
  vehiclesFlashcards,
  economicsFlashcards,
  historyFlashcards,
};

export const initialPrograms: Program[] = [
  // --- Medicine ---
  {
    id: 'med-basics',
    name: 'Medicinska grundbegrepp',
    description: 'Grundläggande medicinska termer och koncept för nybörjare.',
    category: 'medicine',
    difficulty: 'beginner',
    // Using existing and new beginner cards
    flashcards: ['med1', 'med2', 'med3', 'med4', 'med5', 'med_beg6', 'med_beg7', 'med_beg8', 'med_beg9', 'med_beg10', 'med_beg11', 'med_beg12', 'med_beg13', 'med_beg14', 'med_beg15'],
    hasExam: true,
  },
  {
    id: 'med-anatomy',
    name: 'Grundläggande Anatomi',
    description: 'Lär dig om kroppens struktur, organsystem och viktiga ben.',
    category: 'medicine',
    difficulty: 'intermediate',
    // Using existing and new intermediate cards
    flashcards: ['med6', 'med7', 'med10', 'med_int6', 'med_int12', 'med_int17'],
    hasExam: true,
  },
   {
    id: 'med-physiology',
    name: 'Fysiologi Bas',
    description: 'Förstå grundläggande kroppsfunktioner som andning, cirkulation och nervsystemet.',
    category: 'medicine',
    difficulty: 'intermediate',
    flashcards: ['med9', 'med_int7', 'med_int13', 'med_int14', 'med_int16', 'med_int18'],
    hasExam: true,
  },
  {
    id: 'med-diseases',
    name: 'Vanliga sjukdomar - Introduktion',
    description: 'Förståelse för patofysiologin bakom vanliga sjukdomstillstånd.',
    category: 'medicine',
    difficulty: 'advanced',
    flashcards: ['med-adv1', 'med-adv2', 'med_adv3', 'med_adv4', 'med_adv6', 'med_adv7', 'med_adv8', 'med_adv11', 'med_adv13', 'med_adv14', 'med_adv15', 'med_adv17'],
    hasExam: true,
  },
  {
    id: 'med-pharma',
    name: 'Farmakologi - Grunder',
    description: 'Grundläggande principer för läkemedelsverkan och vanliga läkemedelsgrupper.',
    category: 'medicine',
    difficulty: 'expert', // Kept as expert, could be advanced
    flashcards: ['med-ex1', 'med_adv5', 'med_adv12', 'med_ex7', 'med_ex11', 'med_ex16'],
    hasExam: true,
  },

  // --- Coding ---
  // Subcategory: JavaScript
  {
    id: 'js-basics',
    name: 'JavaScript Grunder',
    description: 'Grundläggande JavaScript-koncept: variabler, funktioner, loopar, DOM.',
    category: 'coding',
    difficulty: 'beginner',
    flashcards: ['code1', 'code2', 'code3', 'code4', 'code5', 'js_beg6', 'js_beg7', 'js_beg8', 'js_beg9', 'js_beg10'],
    hasExam: true,
  },
  {
    id: 'js-intermediate',
    name: 'JavaScript Fortsättning',
    description: 'Callbacks, Promises, scope, array-metoder, `this`.',
    category: 'coding',
    difficulty: 'intermediate',
    flashcards: ['js_int6', 'js_int7', 'js_int8', 'js_int10', 'js_int11', 'js_int12', 'js_int13', 'js_int14', 'js_int15'],
    hasExam: true,
  },
  {
    id: 'js-advanced',
    name: 'Avancerad JavaScript',
    description: 'Async/await, closures, prototyparv, event loop, hoisting.',
    category: 'coding',
    difficulty: 'advanced',
    flashcards: ['js_adv1', 'js_adv2', 'js_adv3', 'js_adv4', 'js_adv5', 'js_adv6', 'js_adv7', 'js_adv8', 'js_adv9', 'js_adv10'],
    hasExam: true,
  },
   {
    id: 'js-expert',
    name: 'JavaScript Expert',
    description: 'Generators, Proxies, WeakMap/Set, minneshantering, micro/macro tasks.',
    category: 'coding',
    difficulty: 'expert',
    flashcards: ['code-ex1', 'code-ex2', 'js_ex3', 'js_ex4', 'js_ex5', 'js_ex6', 'js_ex7', 'js_ex8', 'js_ex9', 'js_ex10'],
    hasExam: true,
  },
  // Subcategory: HTML
   {
    id: 'html-basics',
    name: 'HTML Grunder',
    description: 'Lär dig grundläggande HTML-taggar och struktur.',
    category: 'coding',
    difficulty: 'beginner',
    flashcards: ['code_beg6', 'html_beg2', 'html_beg3', 'html_beg4', 'html_beg5', 'html_beg6', 'html_beg7', 'html_beg8', 'html_beg9', 'html_beg10'],
    hasExam: true,
  },
   {
    id: 'html-intermediate',
    name: 'HTML Fortsättning',
    description: 'Semantiska element, formulär, tabeller, inbäddat innehåll.',
    category: 'coding',
    difficulty: 'intermediate',
    flashcards: ['html_int1', 'html_int2', 'html_int3', 'html_int4', 'html_int5', 'html_int6', 'html_int7', 'html_int8', 'html_int9', 'html_int10'],
    hasExam: true,
  },
  {
    id: 'html-advanced',
    name: 'Avancerad HTML',
    description: 'ARIA, Canvas, SVG, Web Components.',
    category: 'coding',
    difficulty: 'advanced',
    flashcards: ['html_adv1', 'html_adv2', 'html_adv3', 'html_adv4', 'html_adv5'],
    hasExam: true,
  },
  // Subcategory: Python
  {
    id: 'python-basics',
    name: 'Python Grundkurs',
    description: 'Grundläggande Python-syntax, datatyper och kontrollstrukturer.',
    category: 'coding',
    difficulty: 'beginner',
    flashcards: ['py1', 'py2', 'py3', 'py4', 'py5', 'py_beg6', 'py_beg7', 'py_beg8', 'py_beg9', 'py_beg10'],
    hasExam: true,
  },
   {
    id: 'python-intermediate',
    name: 'Python - Fortsättning',
    description: 'List comprehensions, funktioner, klasser, moduler, filhantering.',
    category: 'coding',
    difficulty: 'intermediate',
    flashcards: ['py-int1', 'py-int2', 'py_int3', 'py_int4', 'py_int5', 'py_int6', 'py_int7', 'py_int8', 'py_int9', 'py_int10'],
    hasExam: true,
  },
  {
    id: 'python-advanced',
    name: 'Avancerad Python',
    description: 'Decorators, generators, context managers, asyncio, GIL.',
    category: 'coding',
    difficulty: 'advanced',
    flashcards: ['py-adv1', 'py-adv2', 'py_adv3', 'py_adv4', 'py_adv5', 'py_adv6', 'py_adv7', 'py_adv9', 'py_adv10'], // Removed py_adv8 (metaclasses) for expert
    hasExam: true,
  },
   {
    id: 'python-expert',
    name: 'Python Expert',
    description: 'Metaclasses, datamodellen, minneshantering, ABCs, WSGI.',
    category: 'coding',
    difficulty: 'expert',
    flashcards: ['py-ex1', 'py_ex2', 'py_ex3', 'py_ex4', 'py_ex5', 'py_ex6', 'py_ex7', 'py_ex8', 'py_ex9', 'py_ex10', 'py_adv8'], // Added py_adv8 here
    hasExam: true,
  },
  // Subcategory: AI/General Advanced
  {
    id: 'ai-fundamentals',
    name: 'AI Grunder',
    description: 'Grundläggande AI-koncept och maskinlärning.',
    category: 'coding',
    difficulty: 'advanced',
    flashcards: ['ai1', 'ai2', 'ai3', 'ai4', 'ai5'],
    hasExam: true,
  },
  {
    id: 'web-concepts-advanced',
    name: 'Avancerade Webbkoncept',
    description: 'REST, WebSockets, CI/CD, Microservices, Docker.',
    category: 'coding',
    difficulty: 'advanced',
    flashcards: ['code_adv7', 'code_adv8', 'code_adv11', 'code_adv12', 'code_adv20'],
    hasExam: true,
  },
  {
    id: 'cs-theory-advanced',
    name: 'Datalogisk Teori Avancerad',
    description: 'Big O, TDD, SOLID, ORM, Stack/Heap, Hash-tabeller.',
    category: 'coding',
    difficulty: 'advanced',
    flashcards: ['code_adv13', 'code_adv14', 'code_adv15', 'code_adv16', 'code_adv17', 'code_adv18', 'code_adv19'],
    hasExam: true,
  },

  // --- Math ---
  // Subcategory: Algebra
  {
    id: 'math-algebra-basics',
    name: 'Algebra Grunder',
    description: 'Grundläggande algebraiska koncept och ekvationer.',
    category: 'math',
    difficulty: 'beginner',
    flashcards: ['math1', 'math2', 'math3', 'math_alg_beg4', 'math_alg_beg5'],
    hasExam: true,
  },
  {
    id: 'math-algebra-intermediate',
    name: 'Algebra Fortsättning',
    description: 'Andragradsekvationer, faktorisering, ekvationssystem, funktioner, logaritmer.',
    category: 'math',
    difficulty: 'intermediate',
    flashcards: ['math_alg_int1', 'math_alg_int2', 'math_alg_int3', 'math_alg_int4', 'math_alg_int5'],
    hasExam: true,
  },
  // Subcategory: Geometry & Trigonometry
  {
    id: 'math-geometry-basics',
    name: 'Geometri Grunder',
    description: 'Pythagoras sats, area, omkrets, vinklar.',
    category: 'math',
    difficulty: 'beginner',
    flashcards: ['math_geo_beg1', 'math_geo_beg2', 'math_geo_beg3', 'math_geo_beg4', 'math5'],
    hasExam: true,
  },
   {
    id: 'math-geometry-intermediate',
    name: 'Geometri & Trigonometri Fortsättning',
    description: 'Sin/Cos/Tan, Sinussatsen, volymer, vektorer.',
    category: 'math',
    difficulty: 'intermediate',
    flashcards: ['math_geo_int1', 'math_geo_int2', 'math_geo_int3', 'math_geo_int4', 'math_geo_int5'],
    hasExam: true,
  },
  // Subcategory: Calculus
  {
    id: 'calculus-intro',
    name: 'Introduktion till Kalkyl',
    description: 'Grundläggande begrepp inom differential- och integralkalkyl.',
    category: 'math',
    difficulty: 'advanced',
    flashcards: ['calc1', 'calc2', 'calc3', 'calc4', 'calc5', 'math_calc_adv6', 'math_calc_adv7', 'math_calc_adv8', 'math_calc_adv9', 'math_calc_adv10'],
    hasExam: true,
  },
  // Subcategory: Statistics & Probability
  {
    id: 'math-stats-basics',
    name: 'Statistik Grunder',
    description: 'Grundläggande statistiska mått och sannolikhet.',
    category: 'math',
    difficulty: 'intermediate', // Changed from 'math-stats' which was intermediate
    flashcards: ['math-int1', 'math-int2', 'math_prob_int3', 'math_prob_int4', 'math_prob_int5', 'math_adv19', 'math_adv20'], // Added advanced stats cards here
    hasExam: true,
  },
  // Subcategory: Advanced/Expert Theory
  {
    id: 'math-theory-advanced',
    name: 'Avancerad Matematisk Teori',
    description: 'Utforska linjär algebra, diskret matematik och avancerad analys.',
    category: 'math',
    difficulty: 'advanced',
    flashcards: ['math_linalg_adv1', 'math_linalg_adv2', 'math_linalg_adv3', 'math_linalg_adv4', 'math_linalg_adv5', 'math_disc_adv1', 'math_disc_adv2', 'math_disc_adv4', 'math_disc_adv5'],
    hasExam: true,
  },
  {
    id: 'math-theory-expert',
    name: 'Matematisk Teori - Expert',
    description: 'Utforska kända satser, olösta problem och abstrakta koncept.',
    category: 'math',
    difficulty: 'expert',
    flashcards: ['math-ex1', 'math-ex2', 'math_ex3', 'math_ex4', 'math_ex5', 'math_ex6', 'math_ex7', 'math_ex8', 'math_ex9', 'math_ex10', 'math_ex11', 'math_ex12', 'math_ex13', 'math_ex14', 'math_ex15', 'math_ex16', 'math_ex17', 'math_ex18', 'math_ex19', 'math_ex20', 'math_disc_adv3'], // Added group theory
    hasExam: true,
  },

  // --- Languages ---
  // Subcategory: Swedish
  {
    id: 'swedish-basics',
    name: 'Svenska för Nybörjare',
    description: 'Grundläggande svenska ord och fraser.',
    category: 'languages',
    difficulty: 'beginner',
    flashcards: ['swe1', 'swe2', 'swe3', 'swe4', 'swe5', 'swe_beg6', 'swe_beg7', 'swe_beg8', 'swe_beg9', 'swe_beg10', 'swe_beg11', 'swe_beg12', 'swe_beg13', 'swe_beg14', 'swe_beg15', 'swe_beg16', 'swe_beg17', 'swe_beg18', 'swe_beg19', 'swe_beg20'],
    hasExam: true,
  },
  {
    id: 'swedish-grammar',
    name: 'Svensk Grammatik - Grunder',
    description: 'Förståelse för svensk meningsbyggnad och böjningar.',
    category: 'languages',
    difficulty: 'intermediate',
    flashcards: ['swe-int1', 'swe-int2', 'swe_int3', 'swe_int4', 'swe_int5', 'swe_int6', 'swe_int7', 'swe_int8', 'swe_int9', 'swe_int10', 'swe_int11', 'swe_int12', 'swe_int13', 'swe_int14', 'swe_int15', 'swe_int16', 'swe_int17', 'swe_int18', 'swe_int19', 'swe_int20'],
    hasExam: true,
  },
   {
    id: 'swedish-advanced',
    name: 'Avancerad Svenska',
    description: 'Nyanser i språket, konjunktiv, ordföljd, particip.',
    category: 'languages',
    difficulty: 'advanced',
    flashcards: ['swe-adv1', 'swe_adv2', 'swe_adv3', 'swe_adv4', 'swe_adv5', 'swe_adv6', 'swe_adv7', 'swe_adv8', 'swe_adv9', 'swe_adv10', 'swe_adv11', 'swe_adv12', 'swe_adv13', 'swe_adv14', 'swe_adv15', 'swe_adv16', 'swe_adv17', 'swe_adv18', 'swe_adv19', 'swe_adv20'],
    hasExam: true,
  },
  {
    id: 'swedish-expert',
    name: 'Svensk Grammatik - Expert',
    description: 'Aspekt, satsadverbial, partikelverb, fundament, bisatstyper.',
    category: 'languages',
    difficulty: 'expert',
    flashcards: ['swe_ex1', 'swe_ex2', 'swe_ex3', 'swe_ex4', 'swe_ex5', 'swe_ex6', 'swe_ex7', 'swe_ex8', 'swe_ex11', 'swe_ex12', 'swe_ex13', 'swe_ex14', 'swe_ex15', 'swe_ex16', 'swe_ex17', 'swe_ex18', 'swe_ex19', 'swe_ex20'], // Skipped dialect/språkvård cards
    hasExam: true,
  },
  // Subcategory: English
  {
    id: 'english-basics',
    name: 'Engelska för Nybörjare',
    description: 'Grundläggande engelska ord och fraser.',
    category: 'languages',
    difficulty: 'beginner',
    flashcards: ['eng_beg1', 'eng_beg2', 'eng_beg3', 'eng_beg4', 'eng_beg5'],
    hasExam: true,
  },
  {
    id: 'english-grammar-intermediate',
    name: 'Engelsk Grammatik - Grunder',
    description: 'Tempus, modala verb, possessiva pronomen, much/many.',
    category: 'languages',
    difficulty: 'intermediate',
    flashcards: ['eng_int1', 'eng_int2', 'eng_int3', 'eng_int4', 'eng_int5'],
    hasExam: true,
  },
  {
    id: 'english-grammar-advanced',
    name: 'Avancerad Engelsk Grammatik',
    description: 'Present perfect, phrasal verbs, conditionals, subjunctive.',
    category: 'languages',
    difficulty: 'advanced',
    flashcards: ['eng_adv1', 'eng_adv2', 'eng_adv3', 'eng_adv4', 'eng_adv5'],
    hasExam: true,
  },
   {
    id: 'english-grammar-expert',
    name: 'Engelsk Grammatik - Expert',
    description: 'Inversion, relative clauses, modal nuances, cleft sentences.',
    category: 'languages',
    difficulty: 'expert',
    flashcards: ['eng_ex1', 'eng_ex2', 'eng_ex3', 'eng_ex4', 'eng_ex5'],
    hasExam: true,
  },
  // Subcategory: General Linguistics
  {
    id: 'linguistics-basics',
    name: 'Lingvistik Grunder',
    description: 'Grundläggande lingvistiska termer: substantiv, verb, adjektiv etc.',
    category: 'languages',
    difficulty: 'beginner',
    flashcards: ['lang_beg21', 'lang_beg22', 'lang_beg23', 'lang_beg24', 'lang_beg25'],
    hasExam: true,
  },
  {
    id: 'linguistics-intermediate',
    name: 'Lingvistik Fortsättning',
    description: 'Fonetik, fonologi, morfologi, syntax, semantik.',
    category: 'languages',
    difficulty: 'intermediate',
    flashcards: ['lang_int21', 'lang_int22', 'lang_int23', 'lang_int24', 'lang_int25'],
    hasExam: true,
  },
  {
    id: 'linguistics-advanced',
    name: 'Avancerad Lingvistik',
    description: 'Språkfamiljer, dialekt vs språk, pragmatik, sociolingvistik, historisk lingvistik.',
    category: 'languages',
    difficulty: 'advanced',
    flashcards: ['lang_adv21', 'lang_adv22', 'lang_adv23', 'lang_adv24', 'lang_adv25'],
    hasExam: true,
  },
   {
    id: 'linguistics-expert',
    name: 'Lingvistisk Teori - Expert',
    description: 'Universell grammatik, Sapir-Whorf, kognitiv lingvistik, språkinlärningsteorier, korpuslingvistik.',
    category: 'languages',
    difficulty: 'expert',
    flashcards: ['lang_ex21', 'lang_ex22', 'lang_ex23', 'lang_ex24', 'lang_ex25'],
    hasExam: true,
  },


  // --- Science ---
  // Subcategory: Biology
  {
    id: 'biology-basics',
    name: 'Biologi Grunder',
    description: 'Grundläggande koncept: cellen, fotosyntes, DNA, ekosystem.',
    category: 'science',
    difficulty: 'beginner',
    flashcards: ['sci-beg1', 'sci_bio_beg2', 'sci_bio_beg3', 'sci_bio_beg4', 'sci_bio_beg5'],
    hasExam: true,
  },
  {
    id: 'biology-intermediate',
    name: 'Biologi Fortsättning',
    description: 'Cellandning, evolution, celldelning, enzymer.',
    category: 'science',
    difficulty: 'intermediate',
    flashcards: ['sci_bio_int1', 'sci_bio_int2', 'sci_bio_int3', 'sci_bio_int4', 'bio-adv1'],
    hasExam: true,
  },
  {
    id: 'biology-advanced',
    name: 'Avancerad Biologi',
    description: 'Centrala dogmen, PCR, apoptos, neurotransmittorer, immunologi.',
    category: 'science',
    difficulty: 'advanced',
    flashcards: ['sci_bio_adv1', 'sci_bio_adv2', 'sci_bio_adv3', 'sci_bio_adv4', 'sci_bio_adv5'],
    hasExam: true,
  },
  {
    id: 'biology-expert',
    name: 'Biologi Expert',
    description: 'CRISPR, epigenetik, LTP/LTD, HPA-axeln, mikrobiom.',
    category: 'science',
    difficulty: 'expert',
    flashcards: ['sci_bio_ex1', 'sci_bio_ex2', 'sci_bio_ex3', 'sci_bio_ex4', 'sci_bio_ex5'],
    hasExam: true,
  },
  // Subcategory: Chemistry
  {
    id: 'chemistry-basics',
    name: 'Kemi Grunder',
    description: 'Aggregationstillstånd, atomer, molekyler, vatten, reaktioner.',
    category: 'science',
    difficulty: 'beginner',
    flashcards: ['sci-beg2', 'sci_chem_beg2', 'sci_chem_beg3', 'sci_chem_beg4', 'sci_chem_beg5'],
    hasExam: true,
  },
  {
    id: 'chemistry-intermediate',
    name: 'Kemi Fortsättning',
    description: 'pH, bindningar, periodiska systemet, katalysatorer, isotoper.',
    category: 'science',
    difficulty: 'intermediate',
    flashcards: ['sci_int6', 'sci_int9', 'sci_int10', 'sci_int16', 'sci_chem_int5'],
    hasExam: true,
  },
  {
    id: 'chemistry-advanced',
    name: 'Avancerad Kemi',
    description: 'Entalpi, redox, entropi, isomerer, aktiveringsenergi.',
    category: 'science',
    difficulty: 'advanced',
    flashcards: ['chem-adv1', 'sci_adv8', 'sci_chem_adv3', 'sci_chem_adv4', 'sci_chem_adv5'],
    hasExam: true,
  },
  {
    id: 'chemistry-expert',
    name: 'Kemi Expert',
    description: 'Schrödinger, QFT, kiralitet, Ficks lagar, NMR.',
    category: 'science',
    difficulty: 'expert',
    flashcards: ['sci_chem_ex1', 'sci_chem_ex2', 'sci_chem_ex3', 'sci_chem_ex4', 'sci_chem_ex5'],
    hasExam: true,
  },
  // Subcategory: Physics
  {
    id: 'physics-basics',
    name: 'Fysik Grunder',
    description: 'Gravitation, energi, ljud, ljus, magnetism.',
    category: 'science',
    difficulty: 'beginner',
    flashcards: ['sci_phy_beg1', 'sci_phy_beg2', 'sci_phy_beg3', 'sci_phy_beg4', 'sci_phy_beg5'],
    hasExam: true,
  },
  {
    id: 'physics-mechanics', // Renamed slightly
    name: 'Klassisk Mekanik',
    description: 'Newtons lagar, kraft, massa/tyngd, Pascals/Arkimedes princip.',
    category: 'science',
    difficulty: 'intermediate',
    flashcards: ['phys1', 'phys2', 'phys4', 'phys5', 'sci_phy_int6'],
    hasExam: true,
  },
   {
    id: 'physics-waves-optics',
    name: 'Vågor & Optik',
    description: 'Våglängd/frekvens, elektromagnetiska spektrumet, Dopplereffekten.',
    category: 'science',
    difficulty: 'intermediate',
    flashcards: ['sci_phy_int8', 'sci_phy_int9', 'sci_phy_int10'],
    hasExam: true,
  },
  {
    id: 'physics-modern',
    name: 'Modern Fysik - Intro',
    description: 'Relativitetsteori, kvantmekanik, osäkerhetsprincipen, Big Bang, radioaktivitet.',
    category: 'science',
    difficulty: 'advanced',
    flashcards: ['sci_adv5', 'sci_adv6', 'sci_adv7', 'sci_phy_adv4', 'sci_phy_adv5'],
    hasExam: true,
  },
   {
    id: 'physics-expert',
    name: 'Fysik Expert',
    description: 'Maxwells ekvationer, allmän relativitet, Standardmodellen, kvantsammanflätning, Hawkingstrålning.',
    category: 'science',
    difficulty: 'expert',
    flashcards: ['sci_ex2', 'sci_ex3', 'sci_ex4', 'sci_ex6', 'sci_ex10'],
    hasExam: true,
  },

  // --- Geography ---
  // Existing programs seem ok, covers different regions/themes

  // --- Vehicles ---
  // Subcategory: Cars
  {
    id: 'car-basics',
    name: 'Bilens Grunder',
    description: 'Lär dig om bilens grundläggande komponenter och funktion.',
    category: 'vehicles',
    difficulty: 'beginner',
    flashcards: ['veh1', 'veh2', 'veh3', 'veh4', 'veh5', 'car_beg6', 'car_beg7', 'car_beg8', 'car_beg9', 'car_beg10'],
    hasExam: true,
  },
  {
    id: 'engine-tech',
    name: 'Motorteknik (Bil)',
    description: 'Förståelse för förbränningsmotorer, turbo och assisterande system.',
    category: 'vehicles',
    difficulty: 'intermediate',
    flashcards: ['veh6', 'veh7', 'car_int6', 'car_int7', 'car_int8', 'car_int9', 'car_int10'],
    hasExam: true,
  },
   {
    id: 'car-tech-advanced',
    name: 'Avancerad Bilteknik',
    description: 'CVT, HEV/PHEV/BEV, Atkinson, aktiv fjädring, LiDAR.',
    category: 'vehicles',
    difficulty: 'advanced',
    flashcards: ['car_adv1', 'car_adv2', 'car_adv3', 'car_adv4', 'car_adv5'],
    hasExam: true,
  },
   {
    id: 'car-tech-expert',
    name: 'Bilteknik Expert',
    description: 'Regenerativ bromsning, elmotorer, HCCI, AdBlue, material.',
    category: 'vehicles',
    difficulty: 'expert',
    flashcards: ['car_ex1', 'car_ex2', 'car_ex3', 'car_ex4', 'car_ex5'],
    hasExam: true,
  },
  // Subcategory: Boats
   {
    id: 'boating-basics',
    name: 'Båtens Grunder',
    description: 'Grundläggande termer och komponenter för båtar.',
    category: 'vehicles',
    difficulty: 'beginner',
    flashcards: ['boat_beg1', 'boat_beg2', 'boat_beg3', 'boat_beg4', 'boat_beg5'],
    hasExam: true,
  },
   {
    id: 'boating-intermediate',
    name: 'Sjöfart Fortsättning',
    description: 'Deplacement, roder, köl, knop.',
    category: 'vehicles',
    difficulty: 'intermediate',
    flashcards: ['boat_int1', 'boat_int2', 'boat_int3', 'boat_int4', 'boat_int5'],
    hasExam: true,
  },
  {
    id: 'boating-advanced',
    name: 'Avancerad Sjöfart',
    description: 'Planing, barlast, lovart/lä, bogpropeller, AIS.',
    category: 'vehicles',
    difficulty: 'advanced',
    flashcards: ['boat_adv1', 'boat_adv2', 'boat_adv3', 'boat_adv4', 'boat_adv5'],
    hasExam: true,
  },
  {
    id: 'naval-architecture',
    name: 'Fartygsteknik',
    description: 'Utforska principerna bakom fartygs stabilitet, motstånd och framdrivning.',
    category: 'vehicles',
    difficulty: 'expert',
    flashcards: ['veh16', 'veh17', 'veh18', 'veh19', 'veh20'],
    hasExam: true,
  },
  // Subcategory: Airplanes
  {
    id: 'airplane-basics',
    name: 'Flygplan Grunder',
    description: 'Grundläggande delar och termer för flygplan.',
    category: 'vehicles',
    difficulty: 'beginner',
    flashcards: ['plane_beg1', 'plane_beg2', 'plane_beg3', 'plane_beg4', 'plane_beg5'],
    hasExam: true,
  },
  {
    id: 'flight-principles-intermediate',
    name: 'Flygningens Principer',
    description: 'De fyra krafterna, kontrollytor (roder).',
    category: 'vehicles',
    difficulty: 'intermediate',
    flashcards: ['plane_int1', 'plane_int2', 'plane_int3', 'plane_int4', 'plane_int5'],
    hasExam: true,
  },
  {
    id: 'aeronautics-basics',
    name: 'Flygteknik Grunder',
    description: 'Jetmotorer, tryckkabin, flaps/spoilers, stall.',
    category: 'vehicles',
    difficulty: 'advanced',
    flashcards: ['veh11', 'veh12', 'veh13', 'veh14', 'veh15'],
    hasExam: true,
  },
   {
    id: 'aeronautics-expert',
    name: 'Avancerad Aerodynamik & Flygteknik',
    description: 'Bernoulli, L/D, Mach, Fly-by-wire, Area rule.',
    category: 'vehicles',
    difficulty: 'expert',
    flashcards: ['plane_ex1', 'plane_ex2', 'plane_ex3', 'plane_ex4', 'plane_ex5'],
    hasExam: true,
  },
];
