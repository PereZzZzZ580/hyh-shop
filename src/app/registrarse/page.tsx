"use client";

import { apiFetch } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";


const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function Registrarse() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState : { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    router.push("/ingresar");
  };

  return (
    <div className="flex min-h-screen justify-center bg-neutral-50 px-4 py-24">
      <div className="w-full max-w-[400px] space-y-6 rounded-lg bg-white p-8 text-gray-900 shadow">
        <h1 className="text-3xl font-bold">Registrarse</h1>
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
            className="w-full rounded-md bg-black p-3 text-gold hover:bg-gold hover:text-black disabled:opacity-50"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}