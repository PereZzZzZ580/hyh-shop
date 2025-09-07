"use client";

import { useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useAuth } from "@/store/auth";

type OrderItem = {
  qty: number;
  unitPrice: number;
  name: string;
};

type AddressBrief = {
  city?: string | null;
  line1?: string | null;
  line2?: string | null;
  phone?: string | null;
} | null;

type OrderListItem = {
  id: string;
  createdAt: string;
  paymentMethod: "COD" | "WHATSAPP" | "WOMPI";
  status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "INITIATED" | "APPROVED" | "DECLINED" | "REFUNDED";
  shipmentStatus: "NONE" | "READY" | "SHIPPED" | "DELIVERED" | "RETURNED";
  grandTotal: number;
  contactName?: string | null;
  contactPhone?: string | null;
  address: AddressBrief;
  items: OrderItem[];
};

function fetcher(url: string) {
  return fetch(url, { credentials: "include" }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      const err = new Error(text || `Error ${res.status}`) as any;
      err.status = res.status;
      throw err;
    }
    return res.json();
  });
}

function pmLabel(pm: OrderListItem["paymentMethod"]) {
  switch (pm) {
    case "COD":
      return "Contraentrega";
    case "WHATSAPP":
      return "WhatsApp";
    case "WOMPI":
      return "Wompi";
  }
}

function humanStatus(o: OrderListItem) {
  // Map backend statuses to user-facing Spanish labels
  if (o.status === "CANCELLED" || o.paymentStatus === "DECLINED") return { label: "Cancelado", tone: "text-red-400 border-red-400/40" };
  if (o.status === "REFUNDED" || o.paymentStatus === "REFUNDED") return { label: "Reembolsado", tone: "text-red-300 border-red-400/40" };
  if (o.status === "FULFILLED" || o.shipmentStatus === "DELIVERED") return { label: "Completado", tone: "text-emerald-300 border-emerald-400/40" };
  if (o.status === "PAID" || o.paymentStatus === "APPROVED" || o.shipmentStatus === "READY" || o.shipmentStatus === "SHIPPED") return { label: "En proceso", tone: "text-yellow-200 border-yellow-300/40" };
  // Wompi specifics: when not caught by the previous branch, it means not aprobado aún
  if (o.paymentMethod === "WOMPI") return { label: "Pendiente de pago", tone: "text-yellow-200 border-yellow-300/40" };
  return { label: "Pendiente de pago", tone: "text-yellow-200 border-yellow-300/40" };
}

export default function PedidosPage() {
  const autenticado = useAuth((s) => s.autenticado);
  const usuario = useAuth((s) => s.usuario);
  const { data, error, isLoading, mutate } = useSWR<OrderListItem[]>("/api/orders", fetcher);

  useEffect(() => {
    // refrescar al montar si ya autenticado
    if (autenticado) mutate();
  }, [autenticado, mutate]);

  if ((error as any)?.status === 401) {
    return (
      <div className="container max-w-4xl pt-24 pb-12 text-yellow-100">
        <h1 className="text-2xl font-semibold mb-4">Mis pedidos</h1>
        <div className="rounded-xl border border-yellow-400/40 bg-black/50 p-6">
          <p className="mb-4">Debes iniciar sesión para ver tus pedidos.</p>
          <Link href="/ingresar" className="border border-gold/80 text-gold px-4 py-2 rounded-lg hover:bg-gold hover:text-black transition-colors">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl pt-24 pb-16 text-yellow-100">
      <h1 className="text-2xl font-semibold mb-6">Mis pedidos</h1>

      {isLoading && (
        <div className="rounded-xl border border-yellow-400/20 bg-black/40 p-6">Cargando pedidos...</div>
      )}

      {!isLoading && !error && (data?.length ?? 0) === 0 && (
        <div className="rounded-xl border border-yellow-400/20 bg-black/40 p-6">No tienes pedidos aún.</div>
      )}

      <div className="space-y-4">
        {data?.map((o) => {
          const st = humanStatus(o);
          const created = new Date(o.createdAt);
          return (
            <div key={o.id} className="rounded-xl border border-yellow-400/20 bg-black/50 p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`text-sm px-2.5 py-1 rounded-full border ${st.tone}`}>{st.label}</span>
                  <span className="text-sm text-yellow-300/80">{pmLabel(o.paymentMethod)}</span>
                </div>
                <div className="text-sm text-yellow-300/70">{created.toLocaleDateString("es-CO")} · Total ${o.grandTotal.toLocaleString("es-CO")}</div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <ul className="text-sm space-y-1">
                    {o.items.map((it, idx) => (
                      <li key={idx} className="flex justify-between gap-3">
                        <span className="text-yellow-200/90">{it.name} × {it.qty}</span>
                        <span className="text-yellow-300/70">${(it.unitPrice * it.qty).toLocaleString("es-CO")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-yellow-300/80">
                  {o.paymentMethod === "COD" && (
                    <div>
                      <div className="font-medium mb-1">Contraentrega</div>
                      <div>Contacto: {o.contactName || "-"}</div>
                      <div>Teléfono: {o.contactPhone || o.address?.phone || "-"}</div>
                      <div>Ciudad: {o.address?.city || "-"}</div>
                    </div>
                  )}
                  {o.paymentMethod === "WHATSAPP" && (
                    <div>
                      <div className="font-medium mb-1">Pedido por WhatsApp</div>
                      <div className="text-yellow-300/70">El estado se actualiza manualmente por el administrador.</div>
                    </div>
                  )}
                  {o.paymentMethod === "WOMPI" && (
                    <div>
                      <div className="font-medium mb-1">Pago con Wompi</div>
                      <div className="text-yellow-300/70">
                        {o.paymentStatus === "APPROVED" ? "Pago confirmado." : "Pendiente de pago (se confirma cuando figure como Pagado)."}
                      </div>
                    </div>
                  )}
                  {usuario?.role === "ADMIN" && o.paymentMethod !== "WOMPI" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <AdminOrderActions id={o.id} onDone={() => mutate()} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminOrderActions({ id, onDone }: { id: string; onDone: () => void }) {
  const call = async (action: "pending" | "fulfill" | "cancel" | "refund") => {
    await fetch(`/api/admin/orders/${id}/${action}`, { method: "PATCH", credentials: "include" });
    onDone();
  };
  const btn = (label: string, action: Parameters<typeof call>[0], extra?: string) => (
    <button
      onClick={() => call(action)}
      className={`h-9 rounded-lg px-3 border border-yellow-400/60 text-yellow-200 hover:bg-yellow-400/10 ${extra ?? ""}`}
    >
      {label}
    </button>
  );
  return (
    <>
      {btn("Pendiente", "pending")}
      {btn("Completar", "fulfill")}
      {btn("Cancelar", "cancel", "border-red-400/60 text-red-200")}
      {btn("Reembolsar", "refund", "border-red-400/60 text-red-200")}
    </>
  );
}
