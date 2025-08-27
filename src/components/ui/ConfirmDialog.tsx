"use client";
import { useEffect } from "react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Confirmar",
  description = "¿Seguro que deseas continuar?",
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  // cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-[92%] max-w-md rounded-2xl border border-yellow-400/60 bg-black p-6 text-yellow-100 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0">
            <path d="M12 9v4" stroke="currentColor" strokeWidth="2" />
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <div>
            <h2 className="text-xl font-semibold text-yellow-300">{title}</h2>
            <p className="mt-1 text-sm text-yellow-100/80">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="h-10 rounded-lg px-4 border border-white/20 text-white hover:bg-white/10"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="h-10 rounded-lg px-4 border border-yellow-400 text-yellow-300 hover:bg-yellow-400/10 disabled:opacity-50"
          >
            {loading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
