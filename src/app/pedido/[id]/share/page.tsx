"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Item = { name: string; qty: number; unitPrice: number };
type OrderSummary = {
  id: string;
  totals: {
    subtotal: number;
    discountTotal: number;
    shippingTotal: number;
    grandTotal: number;
  };
  items: Item[];
  whatsapp?: { number: string; waLink: string } | null;
};

const money = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export default function PedidoShare() {
  const routeParams = useParams<{ id: string }>();
  const id = (routeParams?.id as string) || "";
  const [resumen, setResumen] = useState<OrderSummary | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiFetch<OrderSummary>(`/orders/${id}/summary`).then(setResumen).catch(() => {});
  }, [id]);

  const texto = useMemo(() => {
    if (!resumen) return "";
    const items = resumen.items
      .map((it) => `- ${it.name} x${it.qty} — $${money(it.unitPrice * it.qty)}`)
      .join("\n");
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return [
      "HYH SHOP — Recibo de pedido",
      `N.º: ${id}`,
      "",
      "Productos:",
      items || "- (vacío)",
      "",
      `Subtotal: $${money(resumen.totals.subtotal)}`,
      `Envío: $${money(resumen.totals.shippingTotal)}`,
      resumen.totals.discountTotal ? `Descuento: -$${money(resumen.totals.discountTotal)}` : null,
      `Total: $${money(resumen.totals.grandTotal)}`,
      "",
      `Ver en web: ${baseUrl}/pedido/${id}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [resumen, id]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {}
  };

  const compartir = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `Pedido ${id} — HYH SHOP`, text: texto });
      } else {
        await copiar();
      }
    } catch {}
  };

  return (
    <section className="max-w-3xl">
      <h1 className="text-3xl font-bold">Compartir pedido</h1>
      {!resumen ? (
        <p className="mt-3 opacity-80">No encontramos el recibo.</p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-3">
            {resumen.whatsapp?.waLink && (
              <a
                href={resumen.whatsapp.waLink}
                target="_blank"
                className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30 inline-flex items-center"
              >
                WhatsApp
              </a>
            )}
            <button onClick={compartir} className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30">
              Compartir…
            </button>
            <button onClick={copiar} className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30">
              {copiado ? "¡Copiado!" : "Copiar resumen"}
            </button>
            <button onClick={() => window.print()} className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30">
              Imprimir/PDF
            </button>
            <Link href={`/pedido/${id}`} className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30 inline-flex items-center">
              Volver al pedido
            </Link>
          </div>

          <textarea
            readOnly
            value={texto}
            className="mt-4 w-full min-h-64 rounded-xl bg-transparent border border-white/10 p-3 text-sm"
          />
        </>
      )}
    </section>
  );
}

