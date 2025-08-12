"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/lib/api";
import type { Address } from "@/types/address";

const schema = z.object({
  country: z.string().min(2, "País requerido"),
  city: z.string().min(2, "Ciudad requerida"),
  line1: z.string().min(4, "Dirección requerida"),
  line2: z.string().optional(),
  phone: z.string().optional(),
  zip: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState<Address[]>([]);
  const [editando, setEditando] = useState<Address | null>(null);

  const cargar = async () => {
    try {
      const data = await apiFetch<Address[]>("/me/addresses");
      setDirecciones(data);
    } catch {}
  };
  useEffect(() => {
    cargar();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      if (editando) {
        await apiFetch(`/me/addresses/${editando.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        await apiFetch("/me/addresses", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
      reset();
      setEditando(null);
      cargar();
    } catch {}
  };

  const editar = (dir: Address) => {
    setEditando(dir);
    reset({
      country: dir.country,
      city: dir.city,
      line1: dir.line1,
      line2: dir.line2 || "",
      phone: dir.phone || "",
      zip: dir.zip || "",
    });
  };

  const eliminar = async (id: string) => {
    try {
      await apiFetch(`/me/addresses/${id}`, { method: "DELETE" });
      cargar();
    } catch {}
  };

  const porDefecto = async (id: string) => {
    try {
      await apiFetch("/me/addresses/set-default", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      cargar();
    } catch {}
  };

  return (
    <section className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Mis direcciones</h1>
      <div className="space-y-4">
        {direcciones.map((d) => (
          <div key={d.id} className="border border-white/10 rounded-lg p-4">
            <p className="font-medium">{d.line1}</p>
            <p className="opacity-80 text-sm">{d.city}, {d.country}</p>
            <div className="mt-2 flex gap-2 text-sm">
              <button onClick={() => editar(d)} className="px-3 h-8 rounded border border-white/20">Editar</button>
              <button onClick={() => eliminar(d.id)} className="px-3 h-8 rounded border border-white/20">Eliminar</button>
              {d.isDefault ? (
                <span className="px-3 h-8 rounded border border-white/20 inline-flex items-center">Predeterminada</span>
              ) : (
                <button onClick={() => porDefecto(d.id)} className="px-3 h-8 rounded border border-white/20">Por defecto</button>
              )}
            </div>
          </div>
        ))}
        {direcciones.length === 0 && <p className="opacity-80">No tienes direcciones guardadas.</p>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <h2 className="text-lg font-semibold">{editando ? "Editar dirección" : "Agregar dirección"}</h2>
        <input {...register("country")}
          placeholder="País"
          className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
        {errors.country && <p className="text-red-400 text-sm">{errors.country.message}</p>}
        <input {...register("city")}
          placeholder="Ciudad"
          className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
        {errors.city && <p className="text-red-400 text-sm">{errors.city.message}</p>}
        <input {...register("line1")}
          placeholder="Dirección"
          className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
        {errors.line1 && <p className="text-red-400 text-sm">{errors.line1.message}</p>}
        <input {...register("line2")}
          placeholder="Detalle dirección"
          className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
        <input {...register("phone")}
          placeholder="Teléfono"
          className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
        <input {...register("zip")}
          placeholder="Código postal"
          className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
        <button type="submit" disabled={isSubmitting} className="h-10 px-4 rounded-lg border border-white/20">
          {editando ? "Guardar" : "Añadir"}
        </button>
        {editando && (
          <button type="button" onClick={() => { setEditando(null); reset(); }} className="h-10 px-4 rounded-lg border border-white/20 ml-2">
            Cancelar
          </button>
        )}
      </form>
    </section>
  );
}

