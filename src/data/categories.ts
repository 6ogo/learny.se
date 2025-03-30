
import { Category } from '@/types/category';

export const initialCategories: Category[] = [
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
