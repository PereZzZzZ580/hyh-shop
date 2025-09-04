"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Item = { name: string; qty: number; unitPrice: number };
type OrderSummary = {
  id: string;
  totals: {
    subtotal: number;
    discountTotal: number;
    shippingTotal: number;
    taxTotal: number;
    grandTotal: number;
  };
  items: Item[];
  address: { line1?: string | null; city?: string | null } | null;
};

export default function PedidoExito() {
  const routeParams = useParams<{ id: string }>();
  const id = (routeParams?.id as string) || "";
  const [resumen, setResumen] = useState<OrderSummary | null>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch<OrderSummary>(`/orders/${id}/summary`).then(setResumen).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // Verificación de Wompi al regresar del checkout
    try {
      const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
      if (!url) return;
      const tx = url.searchParams.get("transactionId") || url.searchParams.get("id");
      if (!tx) return;
      apiFetch<any>(`/payments/wompi/verify?transactionId=${encodeURIComponent(tx)}&reference=${encodeURIComponent(id)}`)
        .then(() => apiFetch<OrderSummary>(`/orders/${id}/summary`).then(setResumen).catch(() => {}))
        .catch(() => {});
    } catch {}
  }, [id]);

  if (!resumen) return null;

  return (
    <section className="max-w-3xl">
      <div className="rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">¡Pedido confirmado!</h1>
          <span className="text-sm opacity-80">N.º {id}</span>
        </div>

        <div className="mt-6 space-y-2 text-sm">
          {resumen.items.map((it, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="opacity-80">{it.name} × {it.qty}</span>
              <span>${(it.unitPrice * it.qty).toLocaleString("es-CO")}</span>
            </div>
          ))}
          <hr className="my-2 border-white/10" />
          <div className="flex justify-between"><span>Subtotal</span><span>${resumen.totals.subtotal.toLocaleString("es-CO")}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>${resumen.totals.shippingTotal.toLocaleString("es-CO")}</span></div>
          {resumen.totals.discountTotal > 0 && (
            <div className="flex justify-between"><span>Descuento</span><span>-${resumen.totals.discountTotal.toLocaleString("es-CO")}</span></div>
          )}
          <div className="flex justify-between text-lg font-semibold mt-1">
            <span>Total</span><span>${resumen.totals.grandTotal.toLocaleString("es-CO")}</span>
          </div>
        </div>

        {resumen.address && (
          <div className="mt-6">
            <p className="opacity-80 text-sm">
              Envío a: {resumen.address.line1}, {resumen.address.city}
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Link href="/catalogo" className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30 inline-flex items-center">
            Seguir comprando
          </Link>
          <Link href="/" className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30 inline-flex items-center">
            Ir al inicio
          </Link>
          <Link href={`/pedido/${id}/share`} className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30 inline-flex items-center">
            Compartir recibo
          </Link>
        </div>
      </div>
    </section>
  );
}

