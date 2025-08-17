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
    <div className="flex min-h-screen justify-center bg-neutral-50 px-4 py-24">
      <div className="w-full max-w-[400px] space-y-6 rounded-lg bg-white p-8 text-gray-900 shadow">
        <h1 className="text-3xl font-bold">Ingresar</h1>
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
            className="w-full rounded-md bg-black p-3 text-gold hover:bg-gold hover:text-black disabled:opacity-50"
          >
            Ingresar
          </button>
        </form>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white p-3 text-gray-700 hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              fill="#EA4335"
              d="M12 10.2v3.8h5.4c-.2 1.2-.8 2.1-1.6 2.8l2.5 1.9c1.5-1.4 2.4-3.5 2.4-6.1 0-.6-.1-1.2-.2-1.8H12z"
            />
            <path
              fill="#34A853"
              d="M6.5 14.3l-.8.6-2 1.5C5.4 19 8.5 21 12 21c2.1 0 3.9-.7 5.2-1.9l-2.5-1.9c-.7.5-1.7.8-2.7.8-2.1 0-3.9-1.4-4.5-3.3z"
            />
            <path
              fill="#4A90E2"
              d="M3.7 9.8c-.2.6-.3 1.2-.3 1.9s.1 1.3.3 1.9l2.8-2.2c-.1-.3-.2-.7-.2-1.1 0-.4.1-.8.2-1.1L3.7 9.8z"
            />
            <path
              fill="#FBBC05"
              d="M12 5.5c1.2 0 2.2.4 3 1.1l2.3-2.3C15.9 3 14.1 2.2 12 2.2 8.5 2.2 5.4 4.2 3.7 7.1l2.8 2.2c.6-1.9 2.4-3.3 4.5-3.3z"
            />
          </svg>
          Iniciar con Google
        </button>
      </div>
    </div>
  );
}