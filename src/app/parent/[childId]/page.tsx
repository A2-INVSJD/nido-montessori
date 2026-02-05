'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Student, AttendanceRecord } from '@/lib/types';

export default function ParentChildView() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureType, setSignatureType] = useState<'entry' | 'exit'>('entry');

  useEffect(() => {
    // Check auth
    const auth = localStorage.getItem('parentAuth');
    if (auth !== childId) {
      router.push('/parent');
      return;
    }

    // Load student data
    const savedStudents = localStorage.getItem('nido_students');
    if (savedStudents) {
      const students: Student[] = JSON.parse(savedStudents);
      const found = students.find(s => s.id === childId);
      if (found) {
        setStudent(found);
      }
    }

    // Load attendance data
    const savedAttendance = localStorage.getItem('nido_attendance');
    if (savedAttendance) {
      const allAttendance = JSON.parse(savedAttendance);
      const studentAttendance = Object.values(allAttendance).filter(
        (a) => (a as AttendanceRecord).studentId === childId
      ) as AttendanceRecord[];
      setAttendance(studentAttendance.sort((a, b) => b.date.localeCompare(a.date)));
    }
  }, [childId, router]);

  const handleLogout = () => {
    localStorage.removeItem('parentAuth');
    localStorage.removeItem('parentStudentName');
    router.push('/parent');
  };

  const handleSignature = (signatureData: string) => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const key = `${childId}_${today}`;
    
    const savedAttendance = localStorage.getItem('nido_attendance');
    const allAttendance = savedAttendance ? JSON.parse(savedAttendance) : {};
    
    if (signatureType === 'entry') {
      allAttendance[key] = {
        id: key,
        studentId: childId,
        date: today,
        entryTime: currentTime,
        exitTime: null,
        entrySignature: signatureData,
        signedBy: student?.parentName,
      };
    } else if (allAttendance[key]) {
      allAttendance[key].exitTime = currentTime;
      allAttendance[key].exitSignature = signatureData;
    }
    
    localStorage.setItem('nido_attendance', JSON.stringify(allAttendance));
    
    // Update local state
    const studentAttendance = Object.values(allAttendance).filter(
      (a) => (a as AttendanceRecord).studentId === childId
    ) as AttendanceRecord[];
    setAttendance(studentAttendance.sort((a, b) => b.date.localeCompare(a.date)));
    
    setShowSignaturePad(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => a.date === today);

  const getProgramLabel = (program: string) => {
    switch (program) {
      case 'montessori': return 'Montessori';
      case 'daycare': return 'Daycare';
      case 'tutoring': return 'Tutorías';
      default: return program;
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/images/logo.png" alt="Nido Montessori" width={120} height={50} />
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Student Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-lg text-gray-600">{student.age} años • {getProgramLabel(student.program)}</p>
              <p className="text-sm text-gray-500 mt-1">Padre/Madre: {student.parentName}</p>
            </div>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            📋 Asistencia de Hoy - {new Date().toLocaleDateString('es-HN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Entry */}
            <div className={`p-6 rounded-xl ${todayRecord?.entryTime ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <h3 className="font-medium text-gray-700 mb-2">Entrada</h3>
              {todayRecord?.entryTime ? (
                <div>
                  <p className="text-2xl font-mono font-bold text-green-600">{todayRecord.entryTime}</p>
                  {todayRecord.entrySignature && (
                    <p className="text-xs text-green-600 mt-2">✓ Firmado por {todayRecord.signedBy}</p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 mb-3">Sin registrar</p>
                  <button
                    onClick={() => {
                      setSignatureType('entry');
                      setShowSignaturePad(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Registrar Entrada con Firma
                  </button>
                </div>
              )}
            </div>

            {/* Exit */}
            <div className={`p-6 rounded-xl ${todayRecord?.exitTime ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
              <h3 className="font-medium text-gray-700 mb-2">Salida</h3>
              {todayRecord?.exitTime ? (
                <div>
                  <p className="text-2xl font-mono font-bold text-red-600">{todayRecord.exitTime}</p>
                  {todayRecord.exitSignature && (
                    <p className="text-xs text-red-600 mt-2">✓ Firmado</p>
                  )}
                </div>
              ) : todayRecord?.entryTime ? (
                <div>
                  <p className="text-gray-400 mb-3">Sin registrar</p>
                  <button
                    onClick={() => {
                      setSignatureType('exit');
                      setShowSignaturePad(true);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Registrar Salida con Firma
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">Registre la entrada primero</p>
              )}
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Historial de Asistencia</h2>
          
          {attendance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay registros de asistencia</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Fecha</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-500">Entrada</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-500">Salida</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-500">Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 10).map((record) => {
                    let hours = '-';
                    if (record.entryTime && record.exitTime) {
                      const [entryH, entryM] = record.entryTime.split(':').map(Number);
                      const [exitH, exitM] = record.exitTime.split(':').map(Number);
                      const totalMinutes = (exitH * 60 + exitM) - (entryH * 60 + entryM);
                      const h = Math.floor(totalMinutes / 60);
                      const m = totalMinutes % 60;
                      hours = `${h}h ${m}m`;
                    }

                    return (
                      <tr key={record.id} className="border-b border-gray-50">
                        <td className="py-3 text-gray-800">
                          {new Date(record.date).toLocaleDateString('es-HN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-mono text-green-600">{record.entryTime || '-'}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-mono text-red-600">{record.exitTime || '-'}</span>
                        </td>
                        <td className="py-3 text-center font-mono text-gray-600">{hours}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <SignaturePadModal
          type={signatureType}
          studentName={`${student.firstName} ${student.lastName}`}
          onClose={() => setShowSignaturePad(false)}
          onSave={handleSignature}
        />
      )}
    </main>
  );
}

function SignaturePadModal({ 
  type, 
  studentName, 
  onClose, 
  onSave 
}: { 
  type: 'entry' | 'exit'; 
  studentName: string;
  onClose: () => void; 
  onSave: (signature: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const currentTime = new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {type === 'entry' ? '✅ Registro de Entrada' : '👋 Registro de Salida'}
              </h2>
              <p className="text-sm text-gray-500">{studentName} • {currentTime}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Firme en el recuadro para confirmar la {type === 'entry' ? 'entrada' : 'salida'} del niño(a).
          </p>
          
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
            <canvas
              ref={canvasRef}
              width={350}
              height={150}
              className="w-full touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={clearSignature}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Limpiar
            </button>
            <button
              onClick={saveSignature}
              disabled={!hasSignature}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirmar {type === 'entry' ? 'Entrada' : 'Salida'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
