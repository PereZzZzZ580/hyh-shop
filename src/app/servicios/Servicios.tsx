"use client";

import { Clock, Shield, MapPin, CreditCard } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, memo } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function Servicios() {
  const { autenticado } = useAuth();
  const router = useRouter();

  const servicios = [
    { nombre: "Barba sola", precio: 15000, duracion: "25 min", img: "/.png" },
    { nombre: "Barba + Corte", precio: 30000, duracion: "60 min", img: "/corteYbarba.png" },
    { nombre: "Cejas", precio: 5000, duracion: "10 min", img: "/.png" },
    { nombre: "Corte + Barba + Cejas", precio: 35000, duracion: "75 min", img: "/.png" },
    { nombre: "Corte solo", precio: 28000, duracion: "45 min", img: "/soloCorte.png" },
  ] as const;
  type Servicio = (typeof servicios)[number];

  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Bloquear scroll cuando hay modal
  useEffect(() => {
    const anyOpen = !!servicioSeleccionado || showJoinModal;
    if (anyOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [servicioSeleccionado, showJoinModal]);

  // Portal helper
  function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return createPortal(children, document.body);
  }

  const abrirWA = (texto: string) => {
    const url = `https://wa.me/573138907119?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener");
  };

  // Modal de reserva aislado para evitar re-render del fondo al escribir
  const ReservaModal = memo(function ReservaModal({
    servicio,
    onClose,
  }: {
    servicio: Servicio;
    onClose: () => void;
  }) {
    const [direccion, setDireccion] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [notas, setNotas] = useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const texto = `Hola, deseo agendar ${servicio.nombre}${
        fecha ? ` el ${fecha}` : ""
      }${hora ? ` a las ${hora}` : ""}${direccion ? ` en ${direccion}` : ""}.${
        notas ? ` Notas: ${notas}` : ""
      }`;
      abrirWA(texto);
      if (!autenticado) setShowJoinModal(true);
      onClose();
    };

    return (
      <Portal>
        <div className="fixed inset-0 z-[70] flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <div className="relative w-[92vw] max-w-md rounded-2xl border border-yellow-400/60 bg-neutral-900 p-6 text-white shadow-2xl">
            <h3 className="text-xl font-semibold">Agendar {servicio.nombre}</h3>
            <p className="mt-2 text-sm opacity-80">Si deseas puedes contactarte directamente por WhatsApp con el barbero o agendar la cita desde aquí.</p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  const texto = `Hola, deseo agendar ${servicio.nombre}${
                    fecha ? ` el ${fecha}` : ""
                  }${hora ? ` a las ${hora}` : ""}${direccion ? ` en ${direccion}` : ""}.${
                    notas ? ` Notas: ${notas}` : ""
                  }`;
                  abrirWA(texto);
                  if (!autenticado) setShowJoinModal(true);
                }}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-green-500/60 px-4 text-green-400 hover:bg-green-500/10"
              >
                Contactar por WhatsApp
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 space-y-4">
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
                    className={`w-full rounded-lg border border-white/15 bg-neutral-800 p-2 pr-10 ${hora ? "text-white" : "text-transparent"}`}
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

              <p className="text-xs opacity-80">Atención en Armenia y Calarcá. Cancelaciones con 2h de anticipación.</p>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
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
      </Portal>
    );
  });

  return (
    <section>
      {/* Héroe */}
      <section className="relative overflow-hidden rounded-2xl border border-yellow-400/20">
        <div aria-hidden className="absolute inset-0 bg-[url('/barber-hero.jpg')] bg-cover bg-center opacity-40 md:opacity-50" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24 text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-yellow-200">Barbería a Domicilio</h1>
          <p className="text-neutral-200/90 md:text-lg">Puntualidad, higiene y bioseguridad en cada visita.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href="#servicios"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="rounded-xl border border-yellow-400/70 px-5 py-2.5 text-yellow-200 hover:bg-yellow-400 hover:text-black"
            >
              Ver servicios
            </a>
            <a
              href={`https://wa.me/573138907119?text=${encodeURIComponent("Hola, quiero solicitar uno de tus servicios")}`}
              target="_blank"
              rel="noopener noreferrer"
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
          <article key={s.nombre} className="rounded-2xl overflow-hidden border border-white/10 hover:border-gold/40 transition">
            <div className="relative h-90">
              <Image src={s.img} alt={s.nombre} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{s.nombre}</h3>
              <p className="mt-1 flex items-center gap-2 text-sm opacity-80">
                <Clock className="h-4 w-4 text-yellow-300/80" /> {s.duracion}
              </p>
              <p className="text-lg font-semibold">${s.precio.toLocaleString("es-CO")}</p>
              <button
                onClick={() => setServicioSeleccionado(s)}
                className="mt-2 w-full rounded-xl border border-gold px-4 py-2 hover:bg-gold hover:text-black transition-colors cursor-pointer"
              >
                Reservar
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Bloque informativo */}
      <section className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-yellow-400/15 bg-black/40 p-6">
            <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-yellow-300" />
            </div>
            <h3 className="mt-4 font-semibold text-yellow-100">Higiene y bioseguridad</h3>
            <p className="mt-2 text-sm text-neutral-300">Herramientas esterilizadas, desinfección constante y protocolos vigentes.</p>
          </div>
          <div className="rounded-2xl border border-yellow-400/15 bg-black/40 p-6">
            <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-yellow-300" />
            </div>
            <h3 className="mt-4 font-semibold text-yellow-100">Cobertura y horarios</h3>
            <p className="mt-2 text-sm text-neutral-300">Armenia y Calarcá. Agenda disponible de 8:00 a 20:00.</p>
          </div>
          <div className="rounded-2xl border border-yellow-400/15 bg-black/40 p-6">
            <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-yellow-300" />
            </div>
            <h3 className="mt-4 font-semibold text-yellow-100">Métodos de pago</h3>
            <p className="mt-2 text-sm text-neutral-300">Efectivo o transferencia. Factura digital disponible.</p>
          </div>
        </div>
      </section>

      {/* Modal de reserva */}
      {/*
        <Portal>
          <div className="fixed inset-0 z-[70] flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/70" onClick={() => setServicioSeleccionado(null)} />
            <div className="relative w-[92vw] max-w-md rounded-2xl border border-yellow-400/60 bg-neutral-900 p-6 text-white shadow-2xl">
              <h3 className="text-xl font-semibold">Agendar {servicioSeleccionado.nombre}</h3>
              <p className="mt-2 text-sm opacity-80">Si deseas puedes contactarte directamente por WhatsApp con el barbero o agendar la cita desde aquí.</p>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    const texto = `Hola, deseo agendar ${servicioSeleccionado.nombre}${
                      fecha ? ` el ${fecha}` : ""
                    }${hora ? ` a las ${hora}` : ""}${direccion ? ` en ${direccion}` : ""}.${
                      notas ? ` Notas: ${notas}` : ""
                    }`;
                    abrirWA(texto);
                    if (!autenticado) setShowJoinModal(true);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-green-500/60 px-4 text-green-400 hover:bg-green-500/10"
                >
                  Contactar por WhatsApp
                </button>
              </div>

              <form onSubmit={enviarWhatsApp} onKeyDown={(e) => e.stopPropagation()} className="mt-4 space-y-4">
                <label className="block text-sm">
                  <span className="mb-1 block">Dirección</span>
                  <input
                    type="text"
                    required
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onInput={(e) => e.stopPropagation()}
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
                    onKeyDown={(e) => e.stopPropagation()}
                    onInput={(e) => e.stopPropagation()}
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
                      onKeyDown={(e) => e.stopPropagation()}
                      onInput={(e) => e.stopPropagation()}
                      className={`w-full rounded-lg border border-white/15 bg-neutral-800 p-2 pr-10 ${hora ? "text-white" : "text-transparent"}`}
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
                    onKeyDown={(e) => e.stopPropagation()}
                    onInput={(e) => e.stopPropagation()}
                    className="w-full rounded-lg border border-white/15 bg-neutral-800 p-2"
                  />
                </label>

                <p className="text-xs opacity-80">Atención en Armenia y Calarcá. Cancelaciones con 2h de anticipación.</p>

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
        </Portal>
      */}

      {servicioSeleccionado && (
        <ReservaModal servicio={servicioSeleccionado} onClose={() => setServicioSeleccionado(null)} />
      )}

      {/* Botón flotante móvil */}
      <button
        onClick={() => {
          document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="fixed bottom-4 right-4 z-50 bg-gold text-black rounded-xl px-4 py-2 md:hidden transition-colors hover:bg-gold/80 cursor-pointer"
      >
        Agendar ahora
      </button>

      {/* Modal para invitar a registrarse */}
      {showJoinModal && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] opacity-0 animate-[fadeIn_.18s_ease-out_forwards]" role="dialog" aria-modal="true">
            <div className="bg-[#181818] border border-yellow-400/70 rounded-2xl p-6 sm:p-7 text-center shadow-[var(--shadow-base)] w-[92vw] max-w-md animate-[pop_.22s_ease-out]">
              <h2 className="text-xl font-bold text-yellow-400 mb-3">¡Únete a la familia H&H!</h2>
              <p className="text-white/90 mb-5">Crea tu cuenta para guardar tus datos y recibir descuentos y promociones.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    router.push("/registrarse");
                  }}
                  className="inline-flex h-10 px-4 items-center justify-center rounded-lg bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500 shadow-sm"
                >
                  Registrarme
                </button>
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    router.push("/ingresar");
                  }}
                  className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-yellow-400 text-yellow-400 text-sm font-medium hover:bg-yellow-400 hover:text-black"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-white/20 text-white text-sm hover:bg-white/10"
                >
                  Más tarde
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </section>
  );
}
