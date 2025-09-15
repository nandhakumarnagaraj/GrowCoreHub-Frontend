export interface UserProfile {
  id?: number;
  userId: number;
  aadhaarNumber?: string;
  education?: string;
  skills?: string;
  experienceYears?: number;
  profileCompleted: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationDocuments?: string;
}