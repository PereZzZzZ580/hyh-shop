"use client";

import { useCart } from "@/store/cart";

export default function CartPage() {
  const { items, total, updateQty, removeItem, clear } = useCart();

  return (
    <section>
      <h1 className="text-3xl font-bold">Tu carrito</h1>
      <div className="mt-6 space-y-4">
        {items.length === 0 && <p className="opacity-80">Aún no tienes productos.</p>}
        {items.map(({ product, qty }) => (
          <div key={product.id} className="flex items-center justify-between border border-white/10 rounded-xl p-4">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="opacity-80 text-sm">${product.price.toLocaleString("es-CO")}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => updateQty(product.id, Number(e.target.value))}
                className="w-16 h-9 rounded-lg bg-transparent border border-white/20 text-center"
              />
              <button
                onClick={() => removeItem(product.id)}
                className="h-9 rounded-lg px-3 border border-white/15 hover:border-red-400/50"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-lg">Total: <strong>${total().toLocaleString("es-CO")}</strong></p>
          <div className="flex gap-3">
            <button onClick={clear} className="h-10 rounded-lg px-4 border border-white/15">Vaciar</button>
            <button className="h-10 rounded-lg px-4 border border-white/15 hover:border-white/30">Ir a pagar</button>
          </div>
        </div>
      )}
    </section>
  );
}
