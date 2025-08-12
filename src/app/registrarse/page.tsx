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
  const { register, handleSubmit, formState } = useForm<FormData>({
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
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        />
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        />
        <input
          type="password"
          placeholder="Contraseña"
          {...register("password")}
          className="h-10 rounded-lg bg-transparent border border-white/20 px-3"
        />
        <button
          type="submit"
          className="h-10 rounded-lg px-4 border border-white/20"
        >
          Registrarse
        </button>
        {(formState.errors.name || formState.errors.email || formState.errors.password) && (
          <p className="text-red-500 text-sm">Revisa los campos</p>
        )}
      </form>
    </section>
  );
}