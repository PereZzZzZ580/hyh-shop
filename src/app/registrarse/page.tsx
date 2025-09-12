"use client";

import { apiFetchAuth } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


const schema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    phone: z
      .string()
      .regex(/^[0-9]{7,15}$/, { message: "Teléfono inválido" }),
    city: z.string().min(1),
    address: z.string().min(1),
    birthdate: z.string().optional(),
    terms: z
      .boolean()
      .refine((value) => value === true, {
        message: "Debes aceptar los términos y condiciones",
      }),
    newsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function Registrarse() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState : { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const termsAccepted = watch("terms", false);

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await apiFetchAuth("/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      router.push("/ingresar");
    } catch (e: any) {
      const msg = e?.message || "No se pudo completar el registro";
      setError(
        msg.includes("Failed to fetch")
          ? "No se puede contactar con el servidor. Intentalo de nuevo."
          : msg
      );
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-neutral-50 px-4 py-24">
      <div className="w-full max-w-[400px] space-y-6 rounded-lg bg-white p-8 text-gray-900 shadow">
        <h1 className="text-3xl font-bold">Registrarse</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              {...register("name")}
              className={`w-full rounded-md border border-gray-300 p-3 placeholder-gray-400 focus:border-gold focus:ring-1 focus:ring-gold ${ errors.name ? "border-red-600" : ""
              }`}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full rounded-md border border-gray-300 p-3 placeholder-gray-400 focus:border-gold focus:ring-1 focus:ring-gold ${
                errors.email ? "border-red-600" : ""
              }`}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Teléfono"
              {...register("phone")}
              className={`w-full rounded-md border border-gray-300 p-3 placeholder-gray-400 focus:border-gold focus:ring-1 focus:ring-gold ${
                errors.phone ? "border-red-600" : ""
              }`}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Ciudad"
              {...register("city")}
              className={`w-full rounded-md border border-gray-300 p-3 placeholder-gray-400 focus:border-gold focus:ring-1 focus:ring-gold ${
                errors.city ? "border-red-600" : ""
              }`}
              aria-invalid={errors.city ? "true" : "false"}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Dirección"
              {...register("address")}
              className={`w-full rounded-md border border-gray-300 p-3 placeholder-gray-400 focus:border-gold focus:ring-1 focus:ring-gold ${
                errors.address ? "border-red-600" : ""
              }`}
              aria-invalid={errors.address ? "true" : "false"}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>
          <div>
            <input
              type="date"
              placeholder="Fecha de nacimiento"
              {...register("birthdate")}
              className={`w-full rounded-md border border-gray-300 p-3 placeholder-gray-400 focus:border-gold focus:ring-1 focus:ring-gold ${
                errors.birthdate ? "border-red-600" : ""
              }`}
              aria-invalid={errors.birthdate ? "true" : "false"}
            />
            {errors.birthdate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthdate.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password")}
              className={`w-full rounded-md border border-gray-300 p-3 placeholder-gray-400 focus:border-gold focus:ring-1 focus:ring-gold ${
                errors.password ? "border-red-600" : ""
              }`}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              {...register("confirmPassword")}
              className={`w-full rounded-md border border-gray-300 p-3 placeholder-gray-400 focus:border-gold focus:ring-1 focus:ring-gold ${
                errors.confirmPassword ? "border-red-600" : ""
              }`}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("terms")}/>
            <span className="text-sm">
              Acepto los términos y condiciones y la política de privacidad
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Leer <Link href="/terminos" target="_blank" className="underline text-black hover:text-gold/80">términos y condiciones</Link> y {" "}
            <Link href="/privacidad" target="_blank" className="underline text-black hover:text-gold/80">política de privacidad</Link>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("newsletter")}/>
            <span className="text-sm">Deseo recibir noticias y promociones</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !termsAccepted}
            className="w-full rounded-md bg-black p-3 text-gold hover:bg-gold text-white disabled:opacity-50"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
