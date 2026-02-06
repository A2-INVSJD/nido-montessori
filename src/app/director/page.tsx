'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowLeft, Shield, Loader2 } from 'lucide-react';

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
        {/* Custom decorative SVGs */}
        <svg className="absolute top-1/4 left-1/4 w-20 h-20 opacity-10 animate-float" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#4A90D9"/>
          <circle cx="35" cy="40" r="8" fill="white"/>
          <circle cx="65" cy="40" r="8" fill="white"/>
          <path d="M35 60 Q50 75 65 60" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <svg className="absolute bottom-1/3 right-1/4 w-16 h-16 opacity-10 animate-float-slow" viewBox="0 0 80 80">
          <rect x="10" y="10" width="60" height="60" rx="10" fill="#E86835"/>
          <text x="40" y="52" textAnchor="middle" fill="white" fontSize="30" fontWeight="bold">A+</text>
        </svg>
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
                <Shield size={16} /> Portal del Director
              </span>
            </div>
            <p className="text-gray-500 mt-3">Ingrese sus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl text-sm animate-slide-up border border-red-100">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 7v6M12 16v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-blue-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-400 focus:bg-white transition-all text-gray-800"
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Lock size={20} className="text-blue-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-400 focus:bg-white transition-all text-gray-800"
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
                  <Loader2 size={20} className="animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Ingresar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft size={16} />
              Volver al inicio
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-xs text-amber-700 font-semibold">Credenciales de Demo</p>
            </div>
            <p className="text-xs text-amber-600 font-mono">director@nidomontessori.hn</p>
            <p className="text-xs text-amber-600 font-mono">nido2024</p>
          </div>
        </div>
      </div>
    </main>
  );
}
