"use client";

import { useAuth } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function Ingresar() {
  const router = useRouter();
  const { setAutenticado, setUsuario } = useAuth();
  const [error, setError] = useState<string | null >(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      try {
        const meRes = await fetch("/api/me");
        if (meRes.ok) {
          const user = await meRes.json();
          setUsuario(user);
          setAutenticado(true);
          router.push("/");
          return;
        }
      } catch (err) {
        console.error(err);
      }
      setAutenticado(false);
      setUsuario(null);
      setError("Error de autenticación");
    } else {
      const err = await res.json().catch(() => ({}));
      setAutenticado(false);
      setUsuario(null);
      setError(err?.error || "Error de autenticación");
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-neutral-50 px-4 py-24">
      <div className="w-full max-w-[400px] space-y-6 rounded-lg bg-white p-8 text-gray-900 shadow">
        <h1 className="text-3xl font-bold">Ingresar</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-black p-3 text-gold hover:bg-gold text-white hover:bg-gray-900 disabled:opacity-50"
          >
            Ingresar
          </button>
        </form>
        {/* Autenticación social deshabilitada; usar solo email/contraseña */}
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/registrarse" className="text-black underline hover:opacity-80">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
