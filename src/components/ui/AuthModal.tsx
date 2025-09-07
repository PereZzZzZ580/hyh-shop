"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onLogin: () => void;
  onRegister: () => void;
  onCancel: () => void;
};

export default function AuthModal({
  open,
  title = "¡Regístrate o inicia sesión!",
  message = "Para continuar debes registrarte o iniciar sesión.",
  onLogin,
  onRegister,
  onCancel,
}: Props) {
  // Block body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close with ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] opacity-0 animate-[fadeIn_.18s_ease-out_forwards]"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#181818] border border-yellow-400/70 rounded-2xl p-6 sm:p-7 text-center shadow-[var(--shadow-base)] w-[92vw] max-w-md animate-[pop_.22s_ease-out]">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{title}</h2>
        <p className="text-white mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onLogin}
            className="inline-flex h-10 px-4 items-center justify-center rounded-lg bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500 shadow-sm"
          >
            Ingresar
          </button>
          <button
            onClick={onRegister}
            className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-yellow-400 text-yellow-400 text-sm font-medium hover:bg-yellow-400 hover:text-black"
          >
            Registrarse
          </button>
          <button
            onClick={onCancel}
            className="inline-flex h-10 px-4 items-center justify-center rounded-lg border border-white/20 text-white text-sm hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

