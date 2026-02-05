// Types for Nido Montessori App

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  program: 'montessori' | 'daycare' | 'tutoring';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies?: string;
  notes?: string;
  photoUrl?: string;
  accessCode: string; // For parent login
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  entryTime: string | null; // HH:MM
  exitTime: string | null; // HH:MM
  entrySignature?: string; // Base64 image
  exitSignature?: string; // Base64 image
  signedBy?: string;
  notes?: string;
}

export interface ProgressNote {
  id: string;
  studentId: string;
  date: string;
  category: 'academic' | 'social' | 'motor' | 'language' | 'general';
  content: string;
  createdBy: string;
  createdAt: Date;
}

export interface Director {
  id: string;
  email: string;
  name: string;
  role: 'director' | 'teacher';
}
