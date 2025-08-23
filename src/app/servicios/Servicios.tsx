"use client";

import { useState } from "react";

export default function Servicios() {
  const servicios = [
    { nombre: "Corte de cabello", descripcion: "Estilos modernos y clásicos." },
    { nombre: "Arreglo de barba", descripcion: "Perfilado y afeitado tradicional." },
    { nombre: "Tintura", descripcion: "Color para cabello y barba." },
  ];
  const [servicioSeleccionado, setServicioSeleccionado] = useState<
    (typeof servicios)[number] | null
  >(null);
  const [direccion, setDireccion] = useState("");
  const [hora, setHora] = useState("");

  const enviarWhatsApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!servicioSeleccionado) return;
    const mensaje = encodeURIComponent(
      `Hola, deseo agendar ${servicioSeleccionado.nombre} en ${direccion} a las ${hora}.`
    );
    window.open(`https://wa.me/573138907119?text=${mensaje}`);
    setServicioSeleccionado(null);
    setDireccion("");
    setHora("");
  };

  return (
    <section>
      <h1 className="text-3xl font-bold text-center">Servicios</h1>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {servicios.map((s) => (
          <li key={s.nombre} className="p-4 border border-white/10 rounded-lg">
            <h2 className="text-xl font-semibold">{s.nombre}</h2>
            <p className="mt-2 opacity-80">{s.descripcion}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setServicioSeleccionado(s)}
            >
              Agendar
            </button>
          </li>
        ))}
      </ul>
      {servicioSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-neutral-900 p-6 text-white">
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
                className="text-green-500 underline"
              >
                Contactar por WhatsApp
              </a>
            </div>
            <form onSubmit={enviarWhatsApp} className="mt-4 space-y-4">
              <input
                type="text"
                required
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full rounded border border-white/10 bg-neutral-800 p-2"
              />
              <input
                type="time"
                required
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full rounded border border-white/10 bg-neutral-800 p-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServicioSeleccionado(null)}
                  className="rounded border border-white/10 px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}