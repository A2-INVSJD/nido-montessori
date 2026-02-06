'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Firestore,
  DocumentData
} from 'firebase/firestore';
import type { Student, AttendanceRecord } from './types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;

function getDb(): Firestore {
  if (!db) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  }
  return db;
}

// Students
export async function getStudents(): Promise<Student[]> {
  const firestore = getDb();
  const snapshot = await getDocs(collection(firestore, 'students'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
}

export async function getStudent(id: string): Promise<Student | null> {
  const firestore = getDb();
  const docRef = doc(firestore, 'students', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Student;
}

export async function getStudentByAccessCode(accessCode: string): Promise<Student | null> {
  const firestore = getDb();
  const q = query(collection(firestore, 'students'), where('accessCode', '==', accessCode.toUpperCase()));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Student;
}

export async function createStudent(data: Omit<Student, 'id'>): Promise<string> {
  const firestore = getDb();
  const docRef = await addDoc(collection(firestore, 'students'), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<void> {
  const firestore = getDb();
  const docRef = doc(firestore, 'students', id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteStudent(id: string): Promise<void> {
  const firestore = getDb();
  const docRef = doc(firestore, 'students', id);
  await deleteDoc(docRef);
}

// Attendance
export async function getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]> {
  const firestore = getDb();
  const q = query(collection(firestore, 'attendance'), where('studentId', '==', studentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
}

export async function getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
  const firestore = getDb();
  const q = query(collection(firestore, 'attendance'), where('date', '==', date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
}

export async function getTodayAttendance(studentId: string): Promise<AttendanceRecord | null> {
  const today = new Date().toISOString().split('T')[0];
  const firestore = getDb();
  const docId = `${studentId}_${today}`;
  const docRef = doc(firestore, 'attendance', docId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as AttendanceRecord;
}

export async function recordAttendance(data: AttendanceRecord): Promise<void> {
  const firestore = getDb();
  const docId = `${data.studentId}_${data.date}`;
  await setDoc(doc(firestore, 'attendance', docId), data);
}

// Director Auth
export async function verifyDirectorLogin(email: string, password: string): Promise<boolean> {
  const firestore = getDb();
  const q = query(
    collection(firestore, 'directors'), 
    where('email', '==', email.toLowerCase()),
    where('password', '==', password)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function createDirector(email: string, password: string, name: string): Promise<void> {
  const firestore = getDb();
  await addDoc(collection(firestore, 'directors'), {
    email: email.toLowerCase(),
    password, // In production, hash this!
    name,
    role: 'director',
    createdAt: new Date().toISOString(),
  });
}

// Initialize default data if needed
export async function initializeDefaultData(): Promise<void> {
  const firestore = getDb();
  
  // Check if director exists
  const directors = await getDocs(collection(firestore, 'directors'));
  if (directors.empty) {
    // Create default director
    await createDirector('director@nidomontessori.hn', 'nido2024', 'Director');
    
    // Create demo students
    const demoStudents = [
      {
        firstName: 'María',
        lastName: 'López',
        dateOfBirth: '2022-03-15',
        age: 3,
        program: 'montessori' as const,
        parentName: 'Ana López',
        parentPhone: '+504 9999-1111',
        parentEmail: 'ana.lopez@email.com',
        emergencyContact: 'Pedro López',
        emergencyPhone: '+504 9999-2222',
        accessCode: 'MARIA2024',
      },
      {
        firstName: 'Carlos',
        lastName: 'Martínez',
        dateOfBirth: '2020-08-22',
        age: 5,
        program: 'daycare' as const,
        parentName: 'Rosa Martínez',
        parentPhone: '+504 9999-3333',
        parentEmail: 'rosa.martinez@email.com',
        emergencyContact: 'Juan Martínez',
        emergencyPhone: '+504 9999-4444',
        accessCode: 'CARLOS2024',
      },
      {
        firstName: 'Sofía',
        lastName: 'Hernández',
        dateOfBirth: '2021-11-08',
        age: 4,
        program: 'montessori' as const,
        parentName: 'Carmen Hernández',
        parentPhone: '+504 9999-5555',
        parentEmail: 'carmen.h@email.com',
        emergencyContact: 'Miguel Hernández',
        emergencyPhone: '+504 9999-6666',
        accessCode: 'SOFIA2024',
      },
    ];

    for (const student of demoStudents) {
      await createStudent(student as Omit<Student, 'id'>);
    }
  }
}
