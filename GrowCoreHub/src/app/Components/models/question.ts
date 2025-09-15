export interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'text' | 'true_false' | 'numerical';
  options?: string[];
  correctAnswer?: string;
  keywords?: string[];
  points: number;
  tolerance?: number; // for numerical questions
}