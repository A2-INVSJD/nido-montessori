'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Key, ArrowLeft, Users, Loader2, Heart, Sparkles } from 'lucide-react';

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
        {/* Custom playful decorative SVGs */}
        <svg className="absolute top-1/4 left-1/6 w-24 h-24 opacity-10 animate-float" viewBox="0 0 100 100">
          <circle cx="50" cy="40" r="25" fill="#FFB6C1"/>
          <ellipse cx="50" cy="70" rx="30" ry="20" fill="#FFB6C1"/>
          <circle cx="42" cy="35" r="4" fill="#333"/>
          <circle cx="58" cy="35" r="4" fill="#333"/>
          <ellipse cx="50" cy="45" rx="3" ry="2" fill="#FF69B4"/>
        </svg>
        <svg className="absolute bottom-1/4 right-1/6 w-20 h-20 opacity-10 animate-float-slow" viewBox="0 0 80 80">
          <polygon points="40,5 50,30 75,35 55,50 60,75 40,60 20,75 25,50 5,35 30,30" fill="#FFD700"/>
        </svg>
        <svg className="absolute top-1/2 right-1/4 w-16 h-16 opacity-10 animate-float" viewBox="0 0 64 64">
          <path d="M32 6C18 6 10 20 10 28c0 16 22 30 22 30s22-14 22-30c0-8-8-22-22-22z" fill="#FF6B6B"/>
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        {/* Floating decorative elements */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl flex items-center justify-center animate-float shadow-lg">
            <Heart size={28} className="text-pink-400" fill="currentColor" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 animate-bounce-in mt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full blur-xl opacity-50" />
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
                <Users size={16} /> Portal de Padres
              </span>
            </div>
            <p className="text-gray-500 mt-3">Ingrese el código de acceso de su hijo(a)</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <label htmlFor="accessCode" className="block text-sm font-semibold text-gray-700 text-center">
                Código de Acceso
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Key size={24} className="text-orange-500" />
                </div>
                <input
                  type="text"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full pl-20 pr-4 py-5 bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-2xl focus:border-orange-400 transition-all text-center font-mono text-2xl tracking-[0.3em] text-gray-800 placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-base"
                  placeholder="XXXX0000"
                  required
                  maxLength={12}
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                El código fue proporcionado por el director
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Heart size={20} />
                  Ver a mi hijo(a)
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
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <p className="text-xs text-amber-700 font-semibold">Códigos de Demo</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1.5 bg-white rounded-xl text-xs font-mono text-amber-700 shadow-sm border border-amber-100">MARIA2024</span>
              <span className="px-3 py-1.5 bg-white rounded-xl text-xs font-mono text-amber-700 shadow-sm border border-amber-100">CARLOS2024</span>
              <span className="px-3 py-1.5 bg-white rounded-xl text-xs font-mono text-amber-700 shadow-sm border border-amber-100">SOFIA2024</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
