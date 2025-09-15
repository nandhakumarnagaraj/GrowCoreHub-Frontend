export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  termsConditions?: string;
  scopeOfWork?: string;
  requiredSkills?: string;
  minimumScore: number;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  createdAt: string;
  clientCrmUrl?: string;
}
