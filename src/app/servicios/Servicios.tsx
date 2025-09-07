"use client";

import { Clock, Shield, MapPin, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function Servicios() {
  const { autenticado } = useAuth();
  const router = useRouter();
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
  const [showAuthModal, setShowAuthModal] = useState(false);

  const enviarWhatsApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!autenticado) {
      setShowAuthModal(true);
      return;
    }
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
      {/* Héroe con imagen de fondo */}
      <section className="relative overflow-hidden rounded-2xl border border-yellow-400/20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[url('/barber-hero.jpg')] bg-cover bg-center opacity-40 md:opacity-50"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24 text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-yellow-200">
            Barbería a Domicilio
          </h1>
          <p className="text-neutral-200/90 md:text-lg">
            Puntualidad, higiene y bioseguridad en cada visita.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href="#servicios"
              onClick={(e) => {
                // Verificar auth: si no está autenticado, mostrar modal
                if (!autenticado) {
                  e.preventDefault();
                  setShowAuthModal(true);
                  return;
                }
                // Si está autenticado, hacer scroll suave a servicios
                e.preventDefault();
                document
                  .getElementById("servicios")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="rounded-xl border border-yellow-400/70 px-5 py-2.5 text-yellow-200 hover:bg-yellow-400 hover:text-black"
            >
              Ver servicios
            </a>
            <a
              href="https://wa.me/573138907119"
              onClick={(e) => {
                if (!autenticado) {
                  e.preventDefault();
                  setShowAuthModal(true);
                }
              }}
              className="rounded-xl bg-yellow-400 px-5 py-2.5 text-black hover:brightness-110"
            >
              Agendar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Cuadrícula de servicios */}
      <div id="servicios" className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <p className="mt-1 flex items-center gap-2 text-sm opacity-80">
                <Clock className="h-4 w-4 text-yellow-300/80" /> {s.duracion}
              </p>
              <p className="text-lg font-semibold">
                ${s.precio.toLocaleString("es-CO")}
              </p>
              <button
                onClick={() => {
                  if (!autenticado) {
                    setShowAuthModal(true);
                    return;
                  }
                  setServicioSeleccionado(s);
                }}
                className="mt-2 w-full rounded-xl border border-gold px-4 py-2 hover:bg-gold hover:text-black transition-colors cursor-pointer"
              >
                Agendar
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Bloque informativo con íconos */}
      <section className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-yellow-400/15 bg-black/40 p-6">
            <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-yellow-300" />
            </div>
            <h3 className="mt-4 font-semibold text-yellow-100">Higiene y bioseguridad</h3>
            <p className="mt-2 text-sm text-neutral-300">
              Herramientas esterilizadas, desinfección constante y protocolos vigentes.
            </p>
          </div>
          <div className="rounded-2xl border border-yellow-400/15 bg-black/40 p-6">
            <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-yellow-300" />
            </div>
            <h3 className="mt-4 font-semibold text-yellow-100">Cobertura y horarios</h3>
            <p className="mt-2 text-sm text-neutral-300">
              Armenia y Calarcá. Agenda disponible de 8:00 a 20:00.
            </p>
          </div>
          <div className="rounded-2xl border border-yellow-400/15 bg-black/40 p-6">
            <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-yellow-300" />
            </div>
            <h3 className="mt-4 font-semibold text-yellow-100">Métodos de pago</h3>
            <p className="mt-2 text-sm text-neutral-300">
              Efectivo o transferencia. Factura digital disponible.
            </p>
          </div>
        </div>
      </section>

      {servicioSeleccionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Fondo semitransparente */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setServicioSeleccionado(null)}
          />
          {/* Contenedor modal */}
          <div className="relative w-[92vw] max-w-md rounded-2xl border border-yellow-400/60 bg-neutral-900 p-6 text-white shadow-2xl">
            <h3 className="text-xl font-semibold">
              Agendar {servicioSeleccionado.nombre}
            </h3>
            <p className="mt-2 text-sm opacity-80">
              Si deseas puedes contactarte directamente por WhatsApp con el
              barbero o agendar la cita desde aquí.
            </p>
            <div className="mt-4">
              <a
                href={`https://wa.me/573138907119?text=${encodeURIComponent(
                  `Hola, deseo agendar ${servicioSeleccionado.nombre}${
                    fecha ? ` el ${fecha}` : ""
                  }${hora ? ` a las ${hora}` : ""}${
                    direccion ? ` en ${direccion}` : ""
                  }.${notas ? ` Notas: ${notas}` : ""}`
                )}`}
                onClick={(e) => {
                  if (!autenticado) {
                    e.preventDefault();
                    setShowAuthModal(true);
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-green-500/60 px-4 text-green-400 hover:bg-green-500/10"
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
                  className="w-full rounded-lg border border-white/15 bg-neutral-800 p-2"
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
                  className="w-full rounded-lg border border-white/15 bg-neutral-800 p-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block">Hora</span>
                <div className="relative">
                  {!hora && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                      Selecciona la hora presionando el reloj
                    </span>
                  )}
                  <input
                    type="time"
                    required
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className={`w-full rounded-lg border border-white/15 bg-neutral-800 p-2 pr-10 ${
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
                  className="w-full rounded-lg border border-white/15 bg-neutral-800 p-2"
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
                  className="rounded-lg border border-white/15 px-4 py-2 transition-colors hover:bg-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg border border-yellow-400 px-4 py-2 text-yellow-200 hover:bg-yellow-400/10 cursor-pointer"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante móvil */}
      <button
        onClick={() => {
          if (!autenticado) {
            setShowAuthModal(true);
            return;
          }
          document
            .getElementById("servicios")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="fixed bottom-4 right-4 z-50 bg-gold text-black rounded-xl px-4 py-2 md:hidden transition-colors hover:bg-gold/80 cursor-pointer"
      >
        Agendar ahora
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] opacity-0 animate-[fadeIn_.18s_ease-out_forwards]">
          <div className="bg-[#181818] border border-yellow-400/70 rounded-2xl p-6 sm:p-7 text-center shadow-[var(--shadow-base)] w-[92vw] max-w-md animate-[pop_.22s_ease-out]">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">¡Regístrate o inicia sesión!</h2>
            <p className="text-white mb-6">Para poder agendar debes registrarte o iniciar sesión.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  router.push("/ingresar");
                }}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500 shadow-sm"
              >
                Ingresar
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  router.push("/registrarse");
                }}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-yellow-400 text-yellow-400 text-sm font-medium hover:bg-yellow-400 hover:text-black"
              >
                Registrarse
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-white/20 text-white text-sm hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

