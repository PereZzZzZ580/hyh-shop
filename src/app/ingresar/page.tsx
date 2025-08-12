"use client";

import { apiFetch } from "@/lib/api";
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
  const { setToken } = useAuth();
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await apiFetch<{ accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setToken(res.accessToken);
    router.push("/");
  };

  return (
    <section>
      <h1 className="text-3xl font-bold">Ingresar</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4 max-w-sm"
      >
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
          Ingresar
        </button>
        {formState.errors.email && (
          <p className="text-red-500 text-sm">Email inválido</p>
        )}
        {formState.errors.password && (
          <p className="text-red-500 text-sm">Contraseña requerida</p>
        )}
      </form>
    </section>
  );
}