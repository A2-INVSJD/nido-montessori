import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Image src="/images/logo.png" alt="Nido Montessori" width={150} height={60} />
          <div className="flex gap-4">
            <Link href="/director" className="text-blue-600 hover:text-blue-800 font-medium">
              Director
            </Link>
            <Link href="/parent" className="text-orange-600 hover:text-orange-800 font-medium">
              Padres
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <Image 
            src="/images/logo.png" 
            alt="Nido Montessori" 
            width={300} 
            height={200}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Bienvenidos al <span className="text-orange-500">Nido</span> de{' '}
          <span className="text-blue-500">Crecimiento</span> y{' '}
          <span className="text-green-600">Descubrimiento</span>! 🪹
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Donde cada niño florece en un ambiente de amor, respeto y aprendizaje.
        </p>
      </section>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Nuestros Servicios
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Montessori */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">👶🏻</div>
            <h3 className="text-xl font-bold text-orange-600 mb-2">
              Estimulación Temprana Montessori
            </h3>
            <p className="text-gray-600 mb-4">
              Programa especializado para niños de 1 a 4 años, desarrollando habilidades cognitivas, 
              motoras y sociales a través del método Montessori.
            </p>
            <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              1-4 años
            </span>
          </div>

          {/* Daycare */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🐣</div>
            <h3 className="text-xl font-bold text-blue-600 mb-2">
              Daycare
            </h3>
            <p className="text-gray-600 mb-4">
              Cuidado integral y actividades educativas en un ambiente seguro y amoroso 
              para niños de 1 a 10 años.
            </p>
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              1-10 años
            </span>
          </div>

          {/* Tutoring */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-600 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">
              Centro de Tutorías
            </h3>
            <p className="text-gray-600 mb-4">
              Apoyo académico personalizado para reforzar el aprendizaje escolar 
              y desarrollar hábitos de estudio.
            </p>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Todas las edades
            </span>
          </div>
        </div>
      </section>

      {/* Hours & Contact Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🕐 Horario de Atención
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-700">Lunes - Viernes</span>
                  <span className="text-blue-600 font-bold">7:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-700">Sábado</span>
                  <span className="text-gray-400">Cerrado</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Domingo</span>
                  <span className="text-gray-400">Cerrado</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📞 Contáctanos
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  ¿Tienes preguntas? ¡Estamos aquí para ayudarte!
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span className="text-gray-700">San Pedro Sula, Honduras</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <span className="text-gray-700">+504 9351-8599</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <span className="text-gray-700">info@nidomontessori.hn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-orange-50 to-orange-100 py-12 border-t border-orange-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Image 
            src="/images/logo.png" 
            alt="Nido Montessori" 
            width={180} 
            height={100}
            className="mx-auto mb-6"
          />
          <p className="text-gray-600 mb-2">
            🪹 Donde cada niño florece
          </p>
          <p className="text-sm text-gray-500 mb-4">
            📍 San Pedro Sula, Honduras • 📱 +504 9351-8599
          </p>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Nido Montessori. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
