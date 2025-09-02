"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Clock, Mail, MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  email: z
    .string()
    .email("Email inválido")
    .or(z.literal("").transform(() => undefined))
    .optional(),
  telefono: z
    .string()
    .min(7, "Número inválido")
    .max(20, "Número inválido")
    .or(z.literal("").transform(() => undefined))
    .optional(),
  motivo: z.enum(["GENERAL", "PEDIDO", "MAYORISTA", "SOPORTE"]).default("GENERAL"),
  numeroPedido: z
    .string()
    .max(30)
    .or(z.literal("").transform(() => undefined))
    .optional(),
  mensaje: z.string().min(1, "Mensaje requerido"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Acepta la política de privacidad" }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function Contacto() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: "contacto-web" }),
    });
    reset();
    alert("Mensaje enviado");
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573138907119";
  const waText = encodeURIComponent("Hola HYH Shop, necesito ayuda.");

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-center">Contacto</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 max-w-2xl mx-auto grid gap-4"
        role="form"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <input
              {...register("nombre")}
              placeholder="Nombre"
              className={`w-full h-10 rounded-lg bg-transparent border px-3 ${
                errors.nombre ? "border-red-500" : "border-white/20"
              }`}
              aria-invalid={errors.nombre ? "true" : "false"}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>
          <div className="sm:col-span-1">
            <input
              type="tel"
              {...register("telefono")}
              placeholder="Teléfono o WhatsApp (opcional)"
              className={`w-full h-10 rounded-lg bg-transparent border px-3 ${
                errors.telefono ? "border-red-500" : "border-white/20"
              }`}
              aria-invalid={errors.telefono ? "true" : "false"}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <input
              type="email"
              {...register("email")}
              placeholder="Email (opcional)"
              className={`w-full h-10 rounded-lg bg-transparent border px-3 ${
                errors.email ? "border-red-500" : "border-white/20"
              }`}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="sm:col-span-1">
            <select
              {...register("motivo")}
              className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3"
              aria-label="Motivo"
            >
              <option value="GENERAL">Consulta general</option>
              <option value="PEDIDO">Pedido existente</option>
              <option value="MAYORISTA">Ventas mayoristas</option>
              <option value="SOPORTE">Soporte técnico</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <input
              {...register("numeroPedido")}
              placeholder="Número de pedido (opcional)"
              className={`w-full h-10 rounded-lg bg-transparent border px-3 ${
                errors.numeroPedido ? "border-red-500" : "border-white/20"
              }`}
              aria-invalid={errors.numeroPedido ? "true" : "false"}
            />
            {errors.numeroPedido && (
              <p className="text-red-500 text-sm mt-1">{errors.numeroPedido.message}</p>
            )}
          </div>
        </div>

        <textarea
          {...register("mensaje")}
          placeholder="Mensaje"
          className={`w-full rounded-lg bg-transparent border px-3 py-2 ${
            errors.mensaje ? "border-red-500" : "border-white/20"
          }`}
          aria-invalid={errors.mensaje ? "true" : "false"}
        />
        {errors.mensaje && (
          <p className="text-red-500 text-sm">{errors.mensaje.message}</p>
        )}

        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" {...register("consent")}/> Acepto la {" "}
          <Link href="/privacidad" className="underline">política de privacidad</Link>
        </label>
        {errors.consent && (
          <p className="text-red-500 text-sm">{errors.consent.message as string}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-4 rounded-lg border border-white/20 inline-flex items-center gap-2"
          >
            <Send size={16}/> Enviar
          </button>
          <a
            href={`https://wa.me/${waNumber}?text=${waText}`}
            className="h-10 px-4 rounded-lg border border-yellow-400/40 text-yellow-200 inline-flex items-center gap-2"
          >
            <MessageCircle size={16}/> WhatsApp
          </a>
        </div>
      </form>

      {/* Canales directos */}
      <div className="max-w-2xl mx-auto mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/15 p-4">
          <div className="flex items-center gap-2 text-yellow-100">
            <Phone size={18}/> Teléfono / WhatsApp
          </div>
          <a
            href={`https://wa.me/${waNumber}?text=${waText}`}
            className="block mt-2 text-sm text-white/80 hover:underline"
          >
            +{waNumber}
          </a>
        </div>
        <div className="rounded-lg border border-white/15 p-4">
          <div className="flex items-center gap-2 text-yellow-100">
            <Mail size={18}/> Email
          </div>
          <a href="mailto:contacto@hyhshop.co?subject=Consulta%20desde%20la%20web" className="block mt-2 text-sm text-white/80 hover:underline">
            contacto@hyhshop.co
          </a>
        </div>
        <div className="rounded-lg border border-white/15 p-4">
          <div className="flex items-center gap-2 text-yellow-100">
            <Clock size={18}/> Horario
          </div>
          <p className="mt-2 text-sm text-white/80">Lun–Sáb  9:00 a.m–9:00 p.m</p>        </div>
      </div>
    </section>
  );
}

