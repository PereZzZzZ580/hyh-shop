"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

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

export default function PedidoExito({ params }: { params: Promise<{ id: string }> }) {
  // Desenvuelve params con React.use()
  const { id } = use(params);

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hyh-last-order");
      if (raw) {
        const parsed: Receipt = JSON.parse(raw);
        if (parsed.orderId === id) setReceipt(parsed);
      }
    } catch {}
    setLoading(false);
  }, [id]);

  if (loading) return null;

  return (
    <section className="max-w-3xl">
      <div className="rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">¡Pedido confirmado!</h1>
          <span className="text-sm opacity-80">N.º {id}</span>
        </div>

        {receipt ? (
          <>
            <p className="mt-2 opacity-80">
              Gracias <strong>{receipt.customer.nombre}</strong>. Te enviamos un correo a{" "}
              <strong>{receipt.customer.email}</strong>.
            </p>

            <div className="mt-6 space-y-2 text-sm">
              {receipt.items.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <span className="opacity-80">{it.name} × {it.qty}</span>
                  <span>${(it.price * it.qty).toLocaleString("es-CO")}</span>
                </div>
              ))}
              <hr className="my-2 border-white/10" />
              <div className="flex justify-between"><span>Subtotal</span><span>${receipt.subtotal.toLocaleString("es-CO")}</span></div>
              <div className="flex justify-between"><span>Envío</span><span>${receipt.envio.toLocaleString("es-CO")}</span></div>
              <div className="flex justify-between text-lg font-semibold mt-1">
                <span>Total</span><span>${receipt.total.toLocaleString("es-CO")}</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="opacity-80 text-sm">
                Envío a: {receipt.customer.direccion}, {receipt.customer.ciudad}
              </p>
            </div>
          </>
        ) : (
          <p className="mt-2 opacity-80">
            No encontramos el detalle de este pedido en este dispositivo. Es posible que hayas
            limpiado el almacenamiento o que el pedido se haya hecho desde otro navegador.
          </p>
        )}

        <div className="mt-8 flex gap-3">
          <Link href="/catalogo" className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30 inline-flex items-center">
            Seguir comprando
          </Link>
          <Link href="/" className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30 inline-flex items-center">
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
