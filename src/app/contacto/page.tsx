"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  mensaje: z.string().min(1, "Mensaje requerido"),
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
    await fetch("/api/contact", { method: "POST", body: JSON.stringify(data) });
    reset();
    alert("Mensaje enviado");
  };

  return (
    <section>
      <h1 className="text-3xl font-bold text-center">Contacto</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 max-w-md mx-auto space-y-4"
        role="form"
      >
        <input
          {...register("nombre")}
          placeholder="Nombre"
          className={`w-full h-10 rounded-lg bg-transparent border px-3 ${
            errors.nombre ? "border-red-500" : "border-white/20"
          }`}
          aria-invalid={errors.nombre ? "true" : "false"}
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm">{errors.nombre.message}</p>
        )}
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className={`w-full h-10 rounded-lg bg-transparent border px-3 ${
            errors.email ? "border-red-500" : "border-white/20"
          }`}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-4 rounded-lg border border-white/20"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
