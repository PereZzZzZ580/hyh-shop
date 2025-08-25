"use client";

import { apiFetch, useApi } from "@/lib/api";
import { useCart } from "@/store/cart";
import type { Address } from "@/types/address";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Preview = {
  totals: {
    subtotal: number;
    discountTotal: number;
    shippingTotal: number;
    taxTotal: number;
    grandTotal: number;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear, id: cartId } = useCart();

  const { data: direcciones } = useApi<Address[]>("/me/addresses");
  const [direccionId, setDireccionId] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [linea1, setLinea1] = useState("");
  const [cupon, setCupon] = useState("");
  const [metodoPago, setMetodoPago] = useState<"WHATSAPP" | "COD">("WHATSAPP");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [enviando, setEnviando] = useState(false);


  useEffect(() => {
    if (!cartId) return;
    const obtener = async () => {
      try {
        const p = await apiFetch<Preview>("/checkout/preview", {
          method: "POST",
          body: JSON.stringify({
            cartId,
            city: ciudad || undefined,
            coupon: cupon || undefined,
            paymentMethod: metodoPago,
          }),
        });
        setPreview(p);
      } catch {}
    };
    obtener();
  }, [cartId, ciudad, cupon, metodoPago]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) return;
    if ((direcciones?.length || 0) > 0 && direccionId === "") {
      alert("seleciona una direccion");
      return;
    }
    if (
      (direccionId === "" || direccionId === "nueva") &&
      (!ciudad.trim() || !linea1.trim())
    ){
      alert("ingresa ciudad y telefono");
      return;
    }
    if (!nombre.trim() || !telefono.trim()) {
      alert("ingresa nombre y telefono");
      return;
    }
    setEnviando(true);
    try {
      type OrderBody = {
        cartId: string;
        paymentMethod: "WHATSAPP" | "COD";
        contactName: string;
        contactPhone: string;
        addressId?: string;
        addressRaw?: { country: string; city: string; line1: string };
      };
      const body: OrderBody = {
        cartId,
        paymentMethod: metodoPago,
        contactName: nombre,
        contactPhone: telefono,
      };
      if (direccionId && direccionId !== "nueva") {
        body.addressId = direccionId;
      } else {
        body.addressRaw = { country: "Colombia", city: ciudad, line1: linea1 };
      }
      const res = await apiFetch<{ orderId: string }>("/orders", {
        method: "POST",
        body: JSON.stringify(body),
      });
      clear();
      router.push(`/pedido/${res.orderId}`);
    } catch {}
    setEnviando(false);
  };

  const seleccionarDireccion = (id: string) => {
    setDireccionId(id);
    const encontrada = direcciones?.find((d) => d.id === id);
    if (encontrada) {
      setCiudad(encontrada.city);
      setLinea1(encontrada.line1);
    }
  };

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {(direcciones?.length || 0) > 0 && (
          <div>
            <label className="block mb-1 text-sm opacity-80">Dirección</label>
            <select
              value={direccionId}
              onChange={(e) => seleccionarDireccion(e.target.value)}
              required={(direcciones?.length ?? 0) > 0}
              className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3"
            >
              <option value="">Selecciona</option>
              {direcciones?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.line1} - {d.city}
                </option>
              ))}
              <option value="nueva">Nueva dirección</option>
            </select>
          </div>
        )}

        {(direccionId === "" || direccionId === "nueva") && (
          <>
            <div>
              <label className="block mb-1 text-sm opacity-80">Ciudad</label>
              <input
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                required={direccionId === "" || direccionId === "nueva"}
                className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm opacity-80">Dirección</label>
              <input
                value={linea1}
                onChange={(e) => setLinea1(e.target.value)}
                required={direccionId === "" || direccionId === "nueva"}
                className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3"
              />
            </div>
          </>
        )}

        <div>
          <label className="block mb-1 text-sm opacity-80">Cupón</label>
          <input
            value={cupon}
            onChange={(e) => setCupon(e.target.value)}
            className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm opacity-80">Método de pago</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value as "WHATSAPP" | "COD")}
            className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3"
          >
            <option value="WHATSAPP">WhatsApp</option>
            <option value="COD">Contraentrega</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm opacity-80">Nombre de contacto</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm opacity-80">Teléfono de contacto</label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            type ="tel"
            required
            className="w-full h-10 rounded-lg bg-transparent border border-white/20 px-3"
          />
        </div>

        <button
          type="submit"
          disabled={enviando || items.length === 0}
          className="h-11 rounded-lg px-5 border border-white/20 hover:border-white/40 disabled:opacity-50"
        >
          {enviando ? "Procesando..." : "Confirmar pedido"}
        </button>
      </form>

      <aside className="border border-white/10 rounded-2xl p-4 h-fit">
        <h2 className="text-xl font-semibold">Resumen</h2>
        <div className="mt-3 space-y-2 text-sm">
          {items.map(({ product, qty }) => (
            <div key={`${product.id}-${product.variant.id}`} className="flex justify-between">
              <span className="opacity-80">{product.variant.product.name} × {qty}</span>
              <span>${(product.price * qty).toLocaleString("es-CO")}</span>
            </div>
          ))}
          <hr className="my-2 border-white/10" />
          <div className="flex justify-between"><span>Subtotal</span><span>${(preview?.totals.subtotal || 0).toLocaleString("es-CO")}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>${(preview?.totals.shippingTotal || 0).toLocaleString("es-CO")}</span></div>
          {preview?.totals.discountTotal ? (
            <div className="flex justify-between"><span>Descuento</span><span>-${preview.totals.discountTotal.toLocaleString("es-CO")}</span></div>
          ) : null}
          <div className="flex justify-between text-lg font-semibold mt-1">
            <span>Total</span><span>${(preview?.totals.grandTotal || 0).toLocaleString("es-CO")}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}

