'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function DirectorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const db = await import('@/lib/db');
      await db.initializeDefaultData();
      const isValid = await db.verifyDirectorLogin(email, password);
      
      if (isValid) {
        localStorage.setItem('directorAuth', 'true');
        localStorage.setItem('directorEmail', email);
        router.push('/director/dashboard');
      } else {
        setError('Credenciales incorrectas. Intente de nuevo.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al conectar. Por favor intente de nuevo.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-[#FFF8F0] to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/4 text-6xl animate-float opacity-20">👶</div>
        <div className="absolute top-1/3 right-1/4 text-5xl animate-float-slow opacity-20">📚</div>
        <div className="absolute bottom-1/3 left-1/3 text-4xl animate-float opacity-20">🎨</div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 animate-bounce-in">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-orange-200 rounded-full blur-xl opacity-50" />
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
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                <span>👩‍💼</span> Portal del Director
              </span>
            </div>
            <p className="text-gray-500 mt-3">Ingrese sus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl text-sm animate-slide-up border border-red-100">
                <span className="text-xl">⚠️</span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📧</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-400 focus:bg-white transition-all text-gray-800"
                  placeholder="director@nidomontessori.hn"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔒</span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-400 focus:bg-white transition-all text-gray-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-secondary text-white py-4 rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Ingresar
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
            <p className="text-xs text-yellow-700 font-semibold mb-1">🔑 Credenciales de Demo:</p>
            <p className="text-xs text-yellow-600 font-mono">director@nidomontessori.hn</p>
            <p className="text-xs text-yellow-600 font-mono">nido2024</p>
          </div>
        </div>
      </div>
    </main>
  );
}
