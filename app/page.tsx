'use client';

import dynamic from 'next/dynamic';

// Carga el mapa dinámicamente desactivando Server Side Rendering
const MapScreen = dynamic(() => import('../components/Map/MapScreen'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Cargando mapa UGB...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-screen bg-black flex justify-center overflow-hidden">
      {/* El max-w-md dentro de MapScreen y este contenedor centrado le darán 
          un aspecto de aplicación móvil incluso si se abre en una computadora de escritorio */}
      <MapScreen />
    </main>
  );
}