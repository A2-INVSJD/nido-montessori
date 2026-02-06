import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0] overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-green-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-orange-200/20 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Header */}
      <header className="relative z-10 glass">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="animate-wiggle">
            <Image src="/images/logo.png" alt="Nido Montessori" width={140} height={60} />
          </div>
          <div className="flex gap-6">
            <Link 
              href="/director" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all hover:scale-105"
            >
              <span className="text-xl">👩‍💼</span>
              Director
            </Link>
            <Link 
              href="/parent" 
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold transition-all hover:scale-105"
            >
              <span className="text-xl">👨‍👩‍👧</span>
              Padres
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          {/* Animated Logo */}
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-200 via-blue-200 to-green-200 rounded-full blur-2xl opacity-50 animate-pulse-soft" />
            <Image 
              src="/images/logo.png" 
              alt="Nido Montessori" 
              width={320} 
              height={200}
              className="relative animate-bounce-in"
            />
          </div>
          
          {/* Animated Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 animate-slide-up">
            Bienvenidos al{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Nido</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8">
                <path d="M0 4 Q25 0 50 4 T100 4" fill="none" stroke="#E86835" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
            {' '}de
            <br />
            <span className="text-blue-500">Crecimiento</span> y{' '}
            <span className="text-green-600">Descubrimiento</span>
            <span className="inline-block animate-wiggle ml-2">🪹</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Donde cada niño florece en un ambiente de 
            <span className="font-semibold text-orange-500"> amor</span>,
            <span className="font-semibold text-blue-500"> respeto</span> y
            <span className="font-semibold text-green-600"> aprendizaje</span>.
          </p>

          {/* Floating decorative emojis */}
          <div className="relative h-20 mb-8">
            <span className="absolute left-1/4 text-4xl animate-float" style={{ animationDelay: '0s' }}>🎨</span>
            <span className="absolute left-1/3 text-3xl animate-float-slow" style={{ animationDelay: '0.5s' }}>📚</span>
            <span className="absolute left-1/2 text-4xl animate-float" style={{ animationDelay: '1s' }}>🧩</span>
            <span className="absolute left-2/3 text-3xl animate-float-slow" style={{ animationDelay: '1.5s' }}>🎵</span>
            <span className="absolute right-1/4 text-4xl animate-float" style={{ animationDelay: '2s' }}>🌱</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
            ✨ Nuestros Programas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Servicios diseñados con <span className="gradient-text">amor</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Montessori Card */}
          <div className="group card-hover bg-white rounded-3xl shadow-lg p-8 border-t-4 border-orange-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">👶🏻</div>
              <h3 className="text-2xl font-bold text-orange-600 mb-3">
                Estimulación Temprana
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Programa Montessori especializado para desarrollar habilidades cognitivas, 
                motoras y sociales en los primeros años de vida.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold">
                  <span>🎂</span> 1-4 años
                </span>
              </div>
            </div>
          </div>

          {/* Daycare Card */}
          <div className="group card-hover bg-white rounded-3xl shadow-lg p-8 border-t-4 border-blue-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">🐣</div>
              <h3 className="text-2xl font-bold text-blue-600 mb-3">
                Daycare
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Cuidado integral con actividades educativas y recreativas 
                en un ambiente seguro, amoroso y estimulante.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                  <span>🎂</span> 1-10 años
                </span>
              </div>
            </div>
          </div>

          {/* Tutoring Card */}
          <div className="group card-hover bg-white rounded-3xl shadow-lg p-8 border-t-4 border-green-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">📚</div>
              <h3 className="text-2xl font-bold text-green-700 mb-3">
                Centro de Tutorías
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Apoyo académico personalizado para reforzar el aprendizaje 
                y desarrollar hábitos de estudio efectivos.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                  <span>📖</span> Todas las edades
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Contact Section */}
      <section className="relative z-10 py-16 pattern-waves">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Hours Card */}
            <div className="card-hover bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-50" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl animate-pulse-soft">🕐</span>
                  <h3 className="text-2xl font-bold text-gray-800">Horario de Atención</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
                    <span className="font-semibold text-gray-700">Lunes - Viernes</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      7:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="font-medium text-gray-500">Sábado - Domingo</span>
                    <span className="text-gray-400 font-medium">Cerrado 😴</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="card-hover bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-50" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl animate-wiggle">💬</span>
                  <h3 className="text-2xl font-bold text-gray-800">¡Contáctanos!</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  ¿Tienes preguntas? Estamos aquí para ayudarte en el camino educativo de tu pequeño.
                </p>
                <div className="space-y-4">
                  <a href="#" className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl hover:scale-[1.02] transition-transform">
                    <span className="text-3xl">📍</span>
                    <span className="font-medium text-gray-700">San Pedro Sula, Honduras</span>
                  </a>
                  <a href="tel:+50493518599" className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl hover:scale-[1.02] transition-transform">
                    <span className="text-3xl">📱</span>
                    <span className="font-bold text-lg text-gray-800">+504 9351-8599</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-blue-500 rounded-3xl p-12 shadow-2xl relative overflow-hidden animate-gradient">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para comenzar? 🚀
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Únete a nuestra familia y dale a tu pequeño el mejor inicio en su camino educativo.
            </p>
            <a 
              href="tel:+50493518599"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span className="text-2xl">📞</span>
              Llámanos Ahora
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-b from-[#FFF8F0] to-orange-100 py-16 border-t border-orange-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="animate-float mb-6">
              <Image 
                src="/images/logo.png" 
                alt="Nido Montessori" 
                width={200} 
                height={100}
              />
            </div>
            <p className="text-xl text-gray-600 mb-2 font-medium">
              🪹 Donde cada niño florece
            </p>
            <div className="flex items-center gap-4 text-gray-500 mb-6">
              <span>📍 San Pedro Sula, Honduras</span>
              <span>•</span>
              <span>📱 +504 9351-8599</span>
            </div>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                📘
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                📸
              </a>
              <a href="https://wa.me/50493518599" className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                💬
              </a>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Nido Montessori. Todos los derechos reservados.
            </p>
            <p className="text-xs text-gray-300 mt-2">
              Hecho con 💜 por A2
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
