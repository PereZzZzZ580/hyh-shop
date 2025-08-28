"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Servicios() {
  const servicios = [
    {
      nombre: "Corte clásico",
      precio: 25000,
      duracion: "45 min",
      img: "/corteClasico.png",
    },
    {
      nombre: "Arreglo de barba",
      precio: 20000,
      duracion: "30 min",
      img: "/corteBarba.png",
    },
    {
      nombre: "Corte + Barba",
      precio: 40000,
      duracion: "70 min",
      img: "/Barbar_y_pelo.png",
    },
  ];
  type Servicio = (typeof servicios)[number];
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(
    null,
  );
  const [direccion, setDireccion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");

  const enviarWhatsApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!servicioSeleccionado) return;
    const mensaje = encodeURIComponent(
      `Hola, deseo agendar ${servicioSeleccionado.nombre} el ${fecha} a las ${hora} en ${direccion}. ${
        notas ? `Notas: ${notas}` : ""
      }`
    );
    window.open(`https://wa.me/573138907119?text=${mensaje}`);
    setServicioSeleccionado(null);
    setDireccion("");
    setFecha("");
    setHora("");
    setNotas("");
  };

  return (
    <section>
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Barbería a Domicilio</h1>
        <p className="opacity-80">
          Profesionales a tu puerta, puntuales y con higiene certificada.
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="#servicios"
            className="border border-gold rounded-xl px-4 py-2 hover:bg-gold hover:text-black transition-colors cursor-pointer"
          >
            Ver servicios
          </a>
          <a
            href="https://wa.me/573138907119"
            className="border border-gold rounded px-4 py-2 hover:bg-gold hover:text-black transition-colors cursor-pointer"
          >
            Agendar por WhatsApp
          </a>
        </div>
      </section>

      <div id="servicios" className="mt-10 grid gap-6 md:grid-cols-3">
        {servicios.map((s) => (
          <article
            key={s.nombre}
            className="rounded-2xl overflow-hidden border border-white/10 hover:border-gold/40 transition"
          >
            <div className="relative h-90">
              <Image src={s.img} alt={s.nombre} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{s.nombre}</h3>
              <p className="opacity-80 text-sm">{s.duracion}</p>
              <p className="text-lg font-semibold">
                ${s.precio.toLocaleString("es-CO")}
              </p>
              <button
                onClick={() => setServicioSeleccionado(s)}
                className="mt-2 w-full rounded-xl border border-gold px-4 py-2 hover:bg-gold hover:text-black transition-colors cursor-pointer"
              >
                Agendar
              </button>
            </div>
          </article>
        ))}
      </div>

      <details className="p-4 border-t border-white/10 group">
        <summary className="cursor-pointer font-medium transition-colors flex items-center justify-between">
          <span>Higiene y bioseguridad</span>
          <svg className="summary-chevron h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <div className="accordion-grid mt-2">
          <div className="accordion-content">
            <p className="opacity-80 text-sm py-1">Utensilios esterilizados y desinfección constante.</p>
          </div>
        </div>
      </details>
      <details className="p-4 border-t border-white/10 group">
        <summary className="cursor-pointer font-medium transition-colors flex items-center justify-between">
          <span>Cobertura y horarios</span>
          <svg className="summary-chevron h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <div className="accordion-grid mt-2">
          <div className="accordion-content">
            <p className="opacity-80 text-sm py-1">Armenia y Calarcá de 8am a 8pm.</p>
          </div>
        </div>
      </details>
      <details className="p-4 border-t border-white/10 group">
        <summary className="cursor-pointer font-medium transition-colors flex items-center justify-between">
          <span>Métodos de pago</span>
          <svg className="summary-chevron h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <div className="accordion-grid mt-2">
          <div className="accordion-content">
            <p className="opacity-80 text-sm py-1">Efectivo o transferencia.</p>
          </div>
        </div>
      </details>

      {servicioSeleccionado && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 pt-0">
          <div className="w-full max-w-md rounded-lg bg-neutral-900 p-6 text-white">
            <div className="w-full max-w-md rounded-lg bg-neutral-900 p-6 text-white"></div>
            <h3 className="text-xl font-semibold">
              Agendar {servicioSeleccionado.nombre}
            </h3>
            <p className="mt-2 text-sm opacity-80">
              Si deseas puedes contactarte directamente por WhatsApp con el
              barbero o agendar la cita desde acá.
            </p>
            <div className="mt-4">
              <a
                href="https://wa.me/573138907119"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 underline cursor-pointer"
              >
                Contactar por WhatsApp
              </a>
            </div>
            <form onSubmit={enviarWhatsApp} className="mt-4 space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block">Dirección</span>
                <input
                  type="text"
                  required
                  placeholder="Dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full rounded border border-white/10 bg-neutral-800 p-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block">Fecha</span>
                <input
                  type="date"
                  required
                  placeholder="Selecciona la fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded border border-white/10 bg-neutral-800 p-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block">Hora</span>
                <div className="relative">
                  {!hora && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/50 text-white/60">
                      Selecciona la hora presionando el reloj
                    </span>
                  )}
                  <input
                    type="time"
                    required
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className={`w-full rounded border border-white/10 bg-neutral-800 p-2 pr-10 ${
                      hora ? "text-white" : "text-transparent"
                    }`}
                  />
                  <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                </div>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block">Notas</span>
                <textarea
                  placeholder="Notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full rounded border border-white/10 bg-neutral-800 p-2"
                />
              </label>
              <p className="text-xs opacity-80">
                Atención en Armenia y Calarcá. Cancelaciones con 2h de
                anticipación.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServicioSeleccionado(null)}
                  className="rounded border border-white/10 px-4 py-2 transition-colors hover:bg-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded bg-gold text-black px-4 py-2 transition-colors hover:bg-gold/80 cursor-pointer"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <a
        href="https://wa.me/573138907119"
        className="fixed bottom-4 right-4 z-50 bg-gold text-black rounded-xl px-4 py-2 md:hidden transition-colors hover:bg-gold/80 cursor-pointer"
      >
        Agendar ahora
      </a>
    </section>
  );
}
