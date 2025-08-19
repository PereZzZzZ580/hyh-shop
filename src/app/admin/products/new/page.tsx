"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";

export default function NewProductPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await apiFetch("/admin/products", { method: "POST", body: formData });
      setStatus("Producto creado correctamente");
      form.reset();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Nuevo producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Nombre"
          className="border p-2 w-full"
          required
        />
        <input
          name="slug"
          placeholder="Slug"
          className="border p-2 w-full"
          required
        />
        <input
          name="categoryId"
          placeholder="ID de categoría"
          className="border p-2 w-full"
          required
        />
        <input
          name="brand"
          placeholder="Marca"
          className="border p-2 w-full"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          className="border p-2 w-full"
        />
        <input type="file" name="images" multiple className="w-full" />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}