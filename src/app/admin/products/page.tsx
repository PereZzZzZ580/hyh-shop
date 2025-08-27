"use client";

import type { Category, Product } from "@/types/product";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type UiVariant = { id?: string; price: string; stock: string };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    description: "",
  });
  const [variants, setVariants] = useState<UiVariant[]>([
    { price: "", stock: "" },
  ]);

  // ⬇️ ahora usamos File[] para poder "agregar más"
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<Product | null>(null);

  // confirmación de borrado de producto
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // TOAST de notificaciones
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  async function load() {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
    ]);

    if (productsRes.ok) {
      const data = await productsRes.json().catch(() => ({}));
      const items = Array.isArray(data) ? data : data.items;
      setProducts(items ?? []);
    } else {
      setProducts([]);
    }

    if (categoriesRes.ok) {
      const data = await categoriesRes.json().catch(() => []);
      setCategories(Array.isArray(data) ? data : []);
    } else {
      setCategories([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // merge de archivos seleccionados con los ya existentes (evita duplicados por nombre+size+lastModified)
  const addFiles = (fl: FileList | null) => {
    if (!fl) return;
    const incoming = Array.from(fl);
    setImages(prev => {
      const key = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
      const seen = new Set(prev.map(key));
      const merged = [...prev];
      for (const f of incoming) {
        const k = key(f);
        if (!seen.has(k)) {
          seen.add(k);
          merged.push(f);
        }
      }
      return merged;
    });
  };

  const handlePickImages = () => fileInputRef.current?.click();

  const removeImageAt = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };
  const clearAllImages = () => setImages([]);

  // previews (se recrean si cambia "images")
  const previews = useMemo(
    () => images.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [images]
  );
  useEffect(() => {
    // liberar URLs cuando cambien
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // calcular qué variantes se eliminaron al editar
    const originalIds = new Set(editing?.variants.map((v) => v.id) ?? []);
    const currentIds = new Set(variants.map((v) => v.id).filter(Boolean) as string[]);
    const deletedVariantIds = [...originalIds].filter((id) => !currentIds.has(id));

    const dto = {
      ...form,
      variants: variants.map((v) => ({
        id: v.id,
        price: Number(v.price),
        stock: Number(v.stock),
      })),
      deletedVariantIds,
    };

    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const method = editing ? "PATCH" : "POST";

    let res: Response;

    if (images.length > 0) {
      // multipart si hay imágenes
      const formData = new FormData();
      formData.append("dto", JSON.stringify(dto));
      images.forEach((file) => formData.append("images", file));
      res = await fetch(url, { method, body: formData });
    } else {
      // JSON si no adjuntas imágenes
      res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
    }

    if (res.ok) {
      setForm({ name: "", slug: "", categoryId: "", description: "" });
      setVariants([{ price: "", stock: "" }]);
      setImages([]); // limpia selección de imágenes
      setFlash({
        type: "success",
        message: editing ? "Producto actualizado con éxito." : "Producto creado con éxito.",
      });
      setEditing(null);
      load();
    } else {
      const err = await res.json().catch(() => ({}));
      setFlash({
        type: "error",
        message: `No se pudo ${editing ? "actualizar" : "crear"}: ${err?.message || res.statusText}`,
      });
    }
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name,
      slug: p.slug,
      categoryId: p.category.id,
      description: p.description || "",
    });
    setVariants(
      p.variants.map((v) => ({
        id: v.id,
        price: String(v.price),
        stock: String(v.stock),
      }))
    );
    setImages([]); // limpiamos selección previa al entrar a editar
    setEditing(p);
  };

  // abrir modal de eliminar producto
  const requestDelete = (id: string) => setDeleteId(id);

  // ejecutar eliminación de producto
  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setFlash({ type: "error", message: `No se pudo eliminar: ${err?.message || res.statusText}` });
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setFlash({ type: "success", message: "Producto eliminado con éxito." });
    setDeleteId(null);
  };

  // eliminar la última variante (botón global)
  const removeLastVariant = () => {
    setVariants((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">Productos</h1>

      <ul className="mb-8 space-y-2">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-4">
            <span className="flex-1">{p.name}</span>
            <button
              onClick={() => handleEdit(p)}
              className="text-yellow-300 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => requestDelete(p.id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <h2 className="mb-2 text-xl font-semibold">
        {editing ? "Editar producto" : "Nuevo producto"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nombre"
          className="w-full rounded-md border border-white/20 bg-transparent p-2 text-white placeholder-white/50"
          required
        />
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="Slug"
          className="w-full rounded-md border border-white/20 bg-transparent p-2 text-white placeholder-white/50"
          required
        />
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="w-full rounded-md border border-white/20 bg-black p-2 text-white"
          required
        >
          <option value="">Selecciona categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descripción"
          className="w-full rounded-md border border-white/20 bg-transparent p-2 text-white placeholder-white/50"
        />

        {/* Variantes */}
        <div className="space-y-2">
          {variants.map((v, idx) => (
            <div key={v.id ?? idx} className="flex items-center gap-2">
              <input
                value={v.price}
                onChange={(e) => {
                  const arr = [...variants];
                  arr[idx].price = e.target.value;
                  setVariants(arr);
                }}
                placeholder="Precio"
                className="w-full rounded-md border border-white/20 bg-transparent p-2 text-white placeholder-white/50"
              />
              <input
                value={v.stock}
                onChange={(e) => {
                  const arr = [...variants];
                  arr[idx].stock = e.target.value;
                  setVariants(arr);
                }}
                placeholder="Stock"
                className="w-full rounded-md border border-white/20 bg-transparent p-2 text-white placeholder-white/50"
              />
              <button
                type="button"
                onClick={() => setVariants(prev => prev.filter((_, i) => i !== idx))}
                className="rounded-lg border border-red-500 px-3 py-2 text-red-400 hover:bg-red-500/10"
                title="Eliminar esta variante"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setVariants([...variants, { price: "", stock: "" }])}
            className="text-sm rounded-lg border border-yellow-400 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10"
          >
            Agregar variante
          </button>

          <button
            type="button"
            onClick={removeLastVariant}
            className="text-sm rounded-lg border border-white/20 px-3 py-2 text-white hover:bg-white/10 disabled:opacity-50"
            disabled={variants.length <= 1}
          >
            Eliminar variante
          </button>
        </div>

        {/* Imágenes: elegir + agregar más + previews */}
        <div className="space-y-3">
          {/* input oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              // permite volver a seleccionar los mismos archivos si el usuario quiere
              e.currentTarget.value = "";
            }}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePickImages}
              className="rounded-lg border border-yellow-400 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10"
            >
              Elegir imágenes
            </button>
            <button
              type="button"
              onClick={handlePickImages}
              className="rounded-lg border border-yellow-400 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10"
            >
              Agregar más imágenes
            </button>

            {images.length > 0 && (
              <button
                type="button"
                onClick={clearAllImages}
                className="rounded-lg border border-white/20 px-3 py-2 text-white hover:bg-white/10"
              >
                Quitar todas
              </button>
            )}

            <span className="text-sm text-white/60">
              {images.length === 0 ? "Ningún archivo seleccionado" : `${images.length} imagen(es) seleccionada(s)`}
            </span>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {previews.map((p, idx) => (
                <div key={`${p.file.name}-${idx}`} className="group relative overflow-hidden rounded-lg border border-white/15">
                  {/* preview */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.file.name}
                    className="aspect-square w-full object-cover"
                  />
                  {/* remove button */}
                  <button
                    type="button"
                    onClick={() => removeImageAt(idx)}
                    className="absolute right-2 top-2 rounded-md border border-red-500/70 bg-black/60 px-2 py-1 text-xs text-red-300 opacity-0 transition-opacity group-hover:opacity-100"
                    title="Quitar imagen"
                  >
                    ×
                  </button>
                  <div className="truncate px-2 py-1 text-xs text-white/70">
                    {p.file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="rounded-lg border border-yellow-400 px-4 py-2 text-yellow-300 hover:bg-yellow-400/10"
        >
          {editing ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* Modal de confirmación para borrar producto */}
      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar producto"
        description="Esta acción es permanente. El producto y sus variantes serán eliminados."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={doDelete}
      />

      {/* TOAST inferior */}
      {flash && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-xl border px-4 py-3 shadow-2xl
          ${flash.type === "success"
              ? "border-yellow-400 bg-black/85 text-yellow-300"
              : "border-red-500 bg-black/85 text-red-300"
            }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            {flash.type === "success" ? (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            )}
            <span className="text-sm">{flash.message}</span>
            <button
              aria-label="Cerrar notificación"
              className="ml-2 rounded px-2 text-xs text-white/70 hover:bg-white/10"
              onClick={() => setFlash(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
