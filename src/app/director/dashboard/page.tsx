'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Student, AttendanceRecord } from '@/lib/types';
import * as db from '@/lib/db';

export default function DirectorDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'attendance'>('students');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize default data if needed
      await db.initializeDefaultData();
      
      // Load students
      const studentsData = await db.getStudents();
      setStudents(studentsData);
      
      // Load today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = await db.getAttendanceByDate(today);
      const attendanceMap: Record<string, AttendanceRecord> = {};
      todayAttendance.forEach(record => {
        attendanceMap[`${record.studentId}_${record.date}`] = record;
      });
      setAttendance(attendanceMap);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if logged in
    const auth = localStorage.getItem('directorAuth');
    if (!auth) {
      router.push('/director');
      return;
    }
    loadData();
  }, [router, loadData]);

  const handleLogout = () => {
    localStorage.removeItem('directorAuth');
    localStorage.removeItem('directorEmail');
    router.push('/director');
  };

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit', hour12: false });

  const recordEntry = async (studentId: string) => {
    const key = `${studentId}_${today}`;
    const record: AttendanceRecord = {
      id: key,
      studentId,
      date: today,
      entryTime: currentTime,
      exitTime: null,
    };
    
    await db.recordAttendance(record);
    setAttendance(prev => ({ ...prev, [key]: record }));
  };

  const recordExit = async (studentId: string) => {
    const key = `${studentId}_${today}`;
    if (attendance[key]) {
      const updated: AttendanceRecord = {
        ...attendance[key],
        exitTime: currentTime,
      };
      await db.recordAttendance(updated);
      setAttendance(prev => ({ ...prev, [key]: updated }));
    }
  };

  const getAttendanceForStudent = (studentId: string) => {
    const key = `${studentId}_${today}`;
    return attendance[key];
  };

  const getProgramColor = (program: string) => {
    switch (program) {
      case 'montessori': return 'bg-orange-100 text-orange-700';
      case 'daycare': return 'bg-blue-100 text-blue-700';
      case 'tutoring': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgramLabel = (program: string) => {
    switch (program) {
      case 'montessori': return 'Montessori';
      case 'daycare': return 'Daycare';
      case 'tutoring': return 'Tutorías';
      default: return program;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadData} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/images/logo.png" alt="Nido Montessori" width={120} height={50} />
            </Link>
            <div className="h-8 w-px bg-gray-300" />
            <span className="text-gray-600 font-medium">Panel de Director</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🔥 Firestore</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('es-HN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-4 px-2 font-medium ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            👶 Estudiantes ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-4 px-2 font-medium ${activeTab === 'attendance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📋 Asistencia de Hoy
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'students' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Lista de Estudiantes</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>+</span> Agregar Estudiante
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div key={student.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{student.age} años</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProgramColor(student.program)}`}>
                      {getProgramLabel(student.program)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>Padre/Madre:</strong> {student.parentName}</p>
                    <p><strong>Teléfono:</strong> {student.parentPhone}</p>
                    <p className="flex items-center gap-2">
                      <strong>Código de Acceso:</strong> 
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                        {student.accessCode}
                      </code>
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver Perfil Completo →
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'attendance' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Asistencia - {new Date().toLocaleDateString('es-HN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>
              <div className="text-lg font-mono text-gray-600">
                🕐 {currentTime}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Estudiante</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Programa</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Entrada</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Salida</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Horas</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => {
                    const record = getAttendanceForStudent(student.id);
                    const entryTime = record?.entryTime;
                    const exitTime = record?.exitTime;
                    
                    let hours = '-';
                    if (entryTime && exitTime) {
                      const [entryH, entryM] = entryTime.split(':').map(Number);
                      const [exitH, exitM] = exitTime.split(':').map(Number);
                      const totalMinutes = (exitH * 60 + exitM) - (entryH * 60 + entryM);
                      const h = Math.floor(totalMinutes / 60);
                      const m = totalMinutes % 60;
                      hours = `${h}h ${m}m`;
                    }

                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.age} años</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProgramColor(student.program)}`}>
                            {getProgramLabel(student.program)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {entryTime ? (
                            <span className="text-green-600 font-mono font-medium">{entryTime}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {exitTime ? (
                            <span className="text-red-600 font-mono font-medium">{exitTime}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-gray-700">
                          {hours}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            {!entryTime && (
                              <button
                                onClick={() => recordEntry(student.id)}
                                className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                              >
                                Entrada
                              </button>
                            )}
                            {entryTime && !exitTime && (
                              <button
                                onClick={() => recordExit(student.id)}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                              >
                                Salida
                              </button>
                            )}
                            {entryTime && exitTime && (
                              <span className="text-gray-400 text-sm">✓ Completo</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h2>
                  <p className="text-gray-500">{selectedStudent.age} años • {getProgramLabel(selectedStudent.program)}</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Nacimiento</h3>
                <p className="text-gray-800">{new Date(selectedStudent.dateOfBirth).toLocaleDateString('es-HN')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Padre/Madre</h3>
                <p className="text-gray-800">{selectedStudent.parentName}</p>
                <p className="text-gray-600 text-sm">{selectedStudent.parentPhone}</p>
                <p className="text-gray-600 text-sm">{selectedStudent.parentEmail}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contacto de Emergencia</h3>
                <p className="text-gray-800">{selectedStudent.emergencyContact}</p>
                <p className="text-gray-600 text-sm">{selectedStudent.emergencyPhone}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-700 mb-1">Código de Acceso para Padres</h3>
                <code className="text-xl font-mono font-bold text-blue-600">{selectedStudent.accessCode}</code>
                <p className="text-xs text-blue-600 mt-1">Comparta este código con los padres para acceder al portal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (studentData) => {
            const id = await db.createStudent(studentData);
            const newStudent = { ...studentData, id } as Student;
            setStudents(prev => [...prev, newStudent]);
            setShowAddModal(false);
          }}
        />
      )}
    </main>
  );
}

function AddStudentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (student: Omit<Student, 'id'>) => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    program: 'montessori' as 'montessori' | 'daycare' | 'tutoring',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const dob = new Date(formData.dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const accessCode = `${formData.firstName.toUpperCase().slice(0, 4)}${Date.now().toString().slice(-4)}`;
    
    await onAdd({
      ...formData,
      age,
      accessCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Agregar Nuevo Estudiante</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value as typeof formData.program })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="montessori">Montessori (1-4 años)</option>
                <option value="daycare">Daycare (1-10 años)</option>
                <option value="tutoring">Tutorías</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Padre/Madre</label>
            <input
              type="text"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.parentEmail}
                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacto de Emergencia</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Emergencia</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Guardando...' : 'Agregar Estudiante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
