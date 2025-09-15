export interface Assessment {
  id: number;
  projectId: number;
  name: string;
  description: string;
  questions: string; // JSON string
  maxScore: number;
  timeLimitMinutes: number;
}
