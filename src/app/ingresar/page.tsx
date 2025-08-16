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
          Ingresar
        </button>
      </form>
    </section>
  );
}