import { Assessment } from "./assessment";
import { User } from "./user";

export interface UserAssessment {
  id: number;
  user: User;
  assessment: Assessment;
  score: number;
  answers: string; // JSON string
  completedAt: string;
}