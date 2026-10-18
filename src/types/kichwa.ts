export type CategoryId = 
  | 'saludos' 
  | 'colores' 
  | 'numeros' 
  | 'animales' 
  | 'familia' 
  | 'naturaleza' 
  | 'comida' 
  | 'cuerpo';

export interface KichwaWord {
  id: string;
  kichwa: string;
  spanish: string;
  categoryId: CategoryId;
  phonetic: string;
  syllables: string[];
  visualId: string;
  exampleKichwa: string;
  exampleSpanish: string;
  culturalFact?: string;
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  tags?: string[];
}

export interface KichwaCategory {
  id: CategoryId;
  nameKichwa: string;
  nameSpanish: string;
  description: string;
  iconName: string;
  themeColor: string; // Tailwind color name like 'amber', 'emerald', 'rose', 'indigo', etc.
  gradient: string;
  textColor: string;
  borderColor: string;
}

export type QuizMode = 'multiple-choice' | 'listening' | 'memory' | 'spelling';

export interface UserStats {
  xp: number;
  streakDays: number;
  lastPlayedDate: string;
  wordsLearned: string[]; // word IDs marked as mastered
  quizHistoryCount: number;
  correctAnswersTotal: number;
  unlockedBadgeIds: string[];
}

export interface Badge {
  id: string;
  title: string;
  titleKichwa: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredWords?: number;
  requiredQuizzes?: number;
  conditionDescription: string;
}
