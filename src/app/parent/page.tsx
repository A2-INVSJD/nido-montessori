'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Student } from '@/lib/types';

export default function ParentLogin() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Import db dynamically to avoid SSR issues
      const db = await import('@/lib/db');
      
      // Find student by access code in Firestore
      const student = await db.getStudentByAccessCode(accessCode);

      if (student) {
        localStorage.setItem('parentAuth', student.id);
        localStorage.setItem('parentStudentName', `${student.firstName} ${student.lastName}`);
        router.push(`/parent/${student.id}`);
      } else {
        setError('Código de acceso inválido. Verifique con el director.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al conectar. Por favor intente de nuevo.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image 
              src="/images/logo.png" 
              alt="Nido Montessori" 
              width={150} 
              height={80}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Portal de Padres</h1>
          <p className="text-gray-600">Ingrese el código de acceso de su hijo(a)</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
              Código de Acceso
            </label>
            <input
              type="text"
              id="accessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center font-mono text-lg tracking-widest"
              placeholder="XXXX0000"
              required
              maxLength={12}
            />
            <p className="mt-2 text-xs text-gray-500 text-center">
              El código fue proporcionado por el director
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:bg-orange-300"
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver al inicio
          </Link>
        </div>

        {/* Demo hint */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-700 font-medium">Códigos de Demo:</p>
          <p className="text-xs text-yellow-600 font-mono">MARIA2024, CARLOS2024, SOFIA2024</p>
        </div>
      </div>
    </main>
  );
}
