"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";

type ReceiptItem = { id: string; name: string; price: number; qty: number; image: string };
type Receipt = {
  orderId: string;
  createdAt: string;
  customer: { nombre: string; email: string; telefono: string; ciudad: string; direccion: string };
  items: ReceiptItem[];
  subtotal: number;
  envio: number;
  total: number;
};

const money = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export default function PedidoShare({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hyh-last-order");
      if (raw) {
        const parsed: Receipt = JSON.parse(raw);
        if (parsed.orderId === id) setReceipt(parsed);
      }
    } catch {}
  }, [id]);

  const texto = useMemo(() => {
    if (!receipt) return "";
    const fecha = new Date(receipt.createdAt).toLocaleString("es-CO");
    const items = receipt.items
      .map((it) => `- ${it.name} x${it.qty} — $${money(it.price * it.qty)}`)
      .join("\n");

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    return [
      "HYH SHOP — Recibo de pedido",
      `N.º: ${receipt.orderId}`,
      `Fecha: ${fecha}`,
      "",
      `Cliente: ${receipt.customer.nombre} (${receipt.customer.telefono})`,
      `Email: ${receipt.customer.email}`,
      `Envío a: ${receipt.customer.direccion}, ${receipt.customer.ciudad}`,
      "",
      "Productos:",
      items || "- (vacío)",
      "",
      `Subtotal: $${money(receipt.subtotal)}`,
      `Envío: $${money(receipt.envio)}`,
      `Total: $${money(receipt.total)}`,
      "",
      `Ver en web: ${baseUrl}/pedido/${receipt.orderId}`,
    ].join("\n");
  }, [receipt]);

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
        await navigator.share({
          title: `Pedido ${id} — HYH SHOP`,
          text: texto,
        });
      } else {
        await copiar();
      }
    } catch {}
  };

  return (
    <section className="max-w-3xl">
      <h1 className="text-3xl font-bold">Compartir pedido</h1>
      {!receipt ? (
        <p className="mt-3 opacity-80">
          No encontramos el recibo en este dispositivo. Abre primero la página de éxito del pedido,
          o genera un pedido nuevo.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-3">
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
