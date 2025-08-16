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
    <section>
      <h1 className="text-3xl font-bold">Registrarse</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4 max-w-sm"
      >
        <input
          type="text"
          placeholder="Nombre"
          {...register("name")}
          className={`h-10 rounded-lg bg-transparent px-3 border ${errors.name ? "border-red-500" : "border-white/20"}`}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className={`h-10 rounded-lg bg-transparent px-3 border ${errors.email ? "border-red-500" : "border-white/20"}`}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        <input
          type="password"
          placeholder="Contraseña"
          {...register("password")}
          className={`h-10 rounded-lg bg-transparent px-3 border ${errors.password ? "border-red-500" : "border-white/20"}`}
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded-lg px-4 border border-white/20"
        >
          Registrarse
        </button>
      </form>
    </section>
  );
}