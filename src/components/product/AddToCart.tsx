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
  const [showToast, setShowToast] = useState(false);
  const max = Math.max(1, stock);

  const handleAdd = async () => {
    if (!autenticado) {
      setShowModal(true);
      return;
    }
    await add(variantId, qty);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000); // Oculta el toast después de 2 segundos
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

      {/* Toast de éxito */}
      {showToast && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg font-semibold z-50">
          ¡Producto agregado con éxito!
        </div>
      )}

      {/* Modal de autenticación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 opacity-0 animate-[fadeIn_.18s_ease-out_forwards]">
          <div className="bg-[#181818] border border-yellow-400/70 rounded-2xl p-6 sm:p-7 text-center shadow-[var(--shadow-base)] w-[92vw] max-w-md animate-[pop_.22s_ease-out]">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              ¡Regístrate o inicia sesión!
            </h2>
            <p className="text-white mb-6">
              Para poder añadir productos al carrito debes registrarte o iniciar sesión.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleLogin}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500 shadow-sm"
              >
                Ingresar
              </button>
              <button
                onClick={handleRegister}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-yellow-400 text-yellow-400 text-sm font-medium hover:bg-yellow-400 hover:text-black"
              >
                Registrarse
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-white/20 text-white text-sm hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
