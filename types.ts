export enum UserRole {
  MASTER_ADMIN = 'Master Admin',
  DISTRICT_ADMIN = 'District Admin',
  CAMPUS_ADMIN = 'Campus Admin',
  VIEWER = 'Viewer',
}

export interface User {
  id: string; // Changed from number to string for Supabase UUID
  username: string;
  role: UserRole;
  campus?: string; // Only applicable for Campus Admin
}

export interface TrespassedIndividual {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // Date of Birth
  status: 'Active' | 'Expired' | 'Warning';
  association: string; // e.g., Parent, Former Student, Stranger
  guardianName: string;
  guardianPhone: string;
  warningExpiresDate: string;
  trespassedFrom: string; // formerly 'campus'
  contactInfo: string;
  currentSchool: string;
  imageUrl: string;
  notes: string;
}