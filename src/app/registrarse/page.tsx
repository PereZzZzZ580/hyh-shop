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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Registrarse</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              {...register("name")}
              className={`w-full rounded-md border p-3 focus:border-primary focus:ring-2 focus:ring-primary ${
                errors.name ? "border-red-600" : "border-gray-300"
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
              className={`w-full rounded-md border p-3 focus:border-primary focus:ring-2 focus:ring-primary ${
                errors.email ? "border-red-600" : "border-gray-300"
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
              className={`w-full rounded-md border p-3 focus:border-primary focus:ring-2 focus:ring-primary ${
                errors.password ? "border-red-600" : "border-gray-300"
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
            className="w-full rounded-md bg-primary p-3 text-white hover:bg-primary-dark disabled:opacity-50"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}