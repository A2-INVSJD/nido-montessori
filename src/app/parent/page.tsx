'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
      const db = await import('@/lib/db');
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
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-[#FFF8F0] to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/4 left-1/4 text-6xl animate-float opacity-20">🧸</div>
        <div className="absolute top-1/2 right-1/3 text-5xl animate-float-slow opacity-20">🎈</div>
        <div className="absolute bottom-1/4 right-1/4 text-4xl animate-float opacity-20">⭐</div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 animate-bounce-in">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-200 to-blue-200 rounded-full blur-xl opacity-50" />
                <Image 
                  src="/images/logo.png" 
                  alt="Nido Montessori" 
                  width={160} 
                  height={80}
                  className="relative animate-wiggle"
                />
              </div>
            </Link>
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                <span>👨‍👩‍👧</span> Portal de Padres
              </span>
            </div>
            <p className="text-gray-500 mt-3">Ingrese el código de acceso de su hijo(a)</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl text-sm animate-slide-up border border-red-100">
                <span className="text-xl">⚠️</span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="accessCode" className="block text-sm font-semibold text-gray-700 text-center">
                Código de Acceso
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔑</span>
                <input
                  type="text"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full pl-14 pr-4 py-5 bg-gradient-to-r from-orange-50 to-blue-50 border-2 border-orange-200 rounded-2xl focus:border-orange-400 transition-all text-center font-mono text-2xl tracking-[0.3em] text-gray-800 placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-base"
                  placeholder="XXXX0000"
                  required
                  maxLength={12}
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                💡 El código fue proporcionado por el director
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <span>👶</span>
                  Ver a mi hijo(a)
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
              <span>←</span>
              Volver al inicio
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <p className="text-xs text-yellow-700 font-semibold mb-1">🎮 Códigos de Demo:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-mono text-yellow-700 shadow-sm">MARIA2024</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-mono text-yellow-700 shadow-sm">CARLOS2024</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-mono text-yellow-700 shadow-sm">SOFIA2024</span>
            </div>
          </div>
        </div>

        {/* Floating hearts */}
        <div className="absolute -top-10 left-1/2 text-3xl animate-float">💕</div>
        <div className="absolute -bottom-5 left-1/4 text-2xl animate-float-slow">🌟</div>
        <div className="absolute -bottom-5 right-1/4 text-2xl animate-float">✨</div>
      </div>
    </main>
  );
}
