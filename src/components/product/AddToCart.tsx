import { useState } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function AddToCart({ variantId, stock }: { variantId: string; stock: number }) {
  const add = useCart((s) => s.addItem);
  const { autenticado } = useAuth();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const max = Math.max(1, stock);

  const handleAdd = async () => {
    if (!autenticado) {
      setShowModal(true);
      return;
    }
    await add(variantId, qty);
  };

  const handleRegister = () => {
    setShowModal(false);
    router.push("/registrarse");
  };

  return (
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

      {/* Modal personalizado */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#181818] border border-yellow-400 rounded-xl p-8 text-center shadow-lg">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              ¡Regístrate o inicia sesión!
            </h2>
            <p className="text-white mb-6">
              Para poder añadir productos al carrito debes registrarte o iniciar sesión.
            </p>
            <button
              onClick={handleRegister}
              className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg mr-3 hover:bg-yellow-500"
            >
              Ir a registrarse
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-transparent border border-yellow-400 text-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-400 hover:text-black"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}