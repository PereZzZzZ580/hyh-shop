'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const imagenes = [
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500914927997-31c2b952dd39?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=crop&w=800&q=80',
];

export default function Galeria() {
  const [indice, setIndice] = useState<number | null>(null);

  const abrir = (i: number) => setIndice(i);
  const cerrar = () => setIndice(null);
  const anterior = () =>
    setIndice((indice! - 1 + imagenes.length) % imagenes.length);
  const siguiente = () =>
    setIndice((indice! + 1) % imagenes.length);

  return (
    <section className="bg-surface-2">
      <h1 className="text-3xl font-bold text-center">Galería</h1>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {imagenes.map((src, i) => (
          <button
            key={src}
            onClick={() => abrir(i)}
            className="group relative overflow-hidden rounded-radius border border-gold/20 hover:shadow-hover-gold"
          >
            <Image
              src={src}
              alt={`Imagen ${i + 1}`}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {indice !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={cerrar}
            aria-label="Cerrar"
          >
            <X size={32} />
          </button>
          <button
            className="absolute left-4 text-gold"
            onClick={anterior}
            aria-label="Anterior"
          >
            <ChevronLeft size={40} />
          </button>
          <Image
            src={imagenes[indice]}
            alt={`Imagen ${indice + 1}`}
            width={1000}
            height={800}
            className="max-h-[80vh] w-auto rounded-radius"
          />
          <button
            className="absolute right-4 text-gold"
            onClick={siguiente}
            aria-label="Siguiente"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </section>
  );
}