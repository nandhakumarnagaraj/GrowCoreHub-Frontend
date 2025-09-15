import { Project } from "./project";
import { User } from "./user";

export interface ProjectApplication {
  id: number;
  user: User;
  project: Project;
  applicationStatus: 'APPLIED' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';
  assessmentScore?: number;
  appliedAt: string;
  agreementSigned: boolean;
  agreementSignedAt?: string;
}