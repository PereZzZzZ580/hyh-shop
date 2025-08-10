"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "../../store/cart";
import { useRouter } from "next/navigation";

const schema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(7, "Teléfono inválido"),
  direccion: z.string().min(4, "Dirección requerida"),
  ciudad: z.string().min(2, "Ciudad requerida"),
  departamento: z.string().min(2, "Departamento requerido"),
  codigoPostal: z.string().min(3, "Código postal requerido"),
  metodoEnvio: z.enum(["pickup", "domicilio"]),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { metodoEnvio: "pickup" },
  });

  const envio = watch("metodoEnvio") === "domicilio" ? 7000 : 0;

  if (!mounted) return null; // evita hydration mismatch por persistencia del carrito

    const onSubmit = async (data: FormData) => {
        // simulamos latencia
        await new Promise((r) => setTimeout(r, 600));

        const orderId = "ORD-" + Date.now();
        const envioCost = data.metodoEnvio === "domicilio" ? 7000 : 0;
        const subtotal = total();
        const grandTotal = subtotal + envioCost;

        // snapshot de items para el recibo
        const receipt = {
            orderId,
            createdAt: new Date().toISOString(),
            customer: {
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            ciudad: data.ciudad,
            direccion: data.direccion,
            },
            items: items.map(({ product, qty }) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            qty,
            image: product.image,
            })),
            subtotal,
            envio: envioCost,
            total: grandTotal,
        };

        // guardamos el recibo para leerlo en /pedido/[id]
        if (typeof window !== "undefined") {
            localStorage.setItem("hyh-last-order", JSON.stringify(receipt));
        }

        clear(); // vaciamos carrito
        router.push(`/pedido/${orderId}`); // redirigimos a la página de éxito
    };


  const subtotal = total();
  const granTotal = subtotal + envio;

  return (
    <section className="grid gap-8 md:grid-cols-2">
      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm opacity-80">Nombre completo</label>
            <input {...register("nombre")} className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
            {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm opacity-80">Email</label>
            <input type="email" {...register("email")} className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm opacity-80">Teléfono</label>
            <input {...register("telefono")} className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
            {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm opacity-80">Ciudad</label>
            <input {...register("ciudad")} className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
            {errors.ciudad && <p className="text-red-400 text-sm mt-1">{errors.ciudad.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm opacity-80">Dirección</label>
            <input {...register("direccion")} className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
            {errors.direccion && <p className="text-red-400 text-sm mt-1">{errors.direccion.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm opacity-80">Departamento</label>
            <input {...register("departamento")} className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
            {errors.departamento && <p className="text-red-400 text-sm mt-1">{errors.departamento.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm opacity-80">Código Postal</label>
            <input {...register("codigoPostal")} className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3" />
            {errors.codigoPostal && <p className="text-red-400 text-sm mt-1">{errors.codigoPostal.message}</p>}
          </div>
        </div>

        <fieldset className="mt-2">
          <legend className="opacity-80 text-sm mb-2">Envío</legend>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="pickup" {...register("metodoEnvio")} />
              Recoger en tienda (gratis)
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="domicilio" {...register("metodoEnvio")} />
              Domicilio ($7.000)
            </label>
          </div>
          {errors.metodoEnvio && <p className="text-red-400 text-sm mt-1">{errors.metodoEnvio.message}</p>}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="h-11 rounded-lg px-5 border border-white/20 hover:border-white/40 disabled:opacity-50"
        >
          {isSubmitting ? "Procesando..." : "Confirmar pedido"}
        </button>
      </form>

      {/* Resumen */}
      <aside className="border border-white/10 rounded-2xl p-4 h-fit">
        <h2 className="text-xl font-semibold">Resumen</h2>
        <div className="mt-3 space-y-2 text-sm">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex justify-between">
              <span className="opacity-80">{product.name} × {qty}</span>
              <span>${(product.price * qty).toLocaleString("es-CO")}</span>
            </div>
          ))}
          <hr className="my-2 border-white/10" />
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toLocaleString("es-CO")}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>${envio.toLocaleString("es-CO")}</span></div>
          <div className="flex justify-between text-lg font-semibold mt-1">
            <span>Total</span><span>${granTotal.toLocaleString("es-CO")}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
