"use client";

import { useAuth } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";


const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function Ingresar() {
  const router = useRouter();
  const { setAutenticado } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setAutenticado(true);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Ingresar</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            Ingresar
          </button>
        </form>
        <button
          type="button"
          className="w-full rounded-md border border-gray-300 p-3 hover:bg-gray-100"
        >
          Ingresar con google
        </button>
      </div>
    </div>
  );
}