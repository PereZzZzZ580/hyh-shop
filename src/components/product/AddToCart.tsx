"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/ui/AuthModal";

export default function AddToCart({ variantId, stock }: { variantId: string; stock: number }) {
  const add = useCart((s) => s.addItem);
  const { autenticado } = useAuth();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const max = Math.max(1, stock);

  const handleAdd = async () => {
    if (!autenticado) {
      setShowModal(true);
      return;
    }
    await add(variantId, qty);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleRegister = () => {
    setShowModal(false);
    router.push("/registrarse");
  };
  const handleLogin = () => {
    setShowModal(false);
    router.push("/ingresar");
  };

  return (
    <div className="flex flex-col gap-3 relative">
      <div className="flex gap-3">
        <input
          type="number"
          min={1}
          max={stock}
          value={qty}
          onChange={(e) =>
            setQty(Math.max(1, Math.min(Number(e.target.value), max)))
          }
          className="w-20 h-10 rounded-lg bg-transparent border border-white/20 text-center"
          disabled={stock < 1}
        />
        <button
          onClick={handleAdd}
          disabled={stock < 1}
          className="h-10 px-4 rounded-lg border border-white/15 hover:border-white/30 disabled:opacity-50"
        >
          {stock < 1 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>

      {showToast && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg font-semibold z-50">
          ¡Producto agregado con éxito!
        </div>
      )}

      <AuthModal
        open={showModal}
        message="Para poder añadir productos al carrito debes registrarte o iniciar sesión."
        onLogin={handleLogin}
        onRegister={handleRegister}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}

