"use client";

import type { Category, Product } from "@/types/product";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    description: "",
  });
  const [variants, setVariants] = useState<{ price: string; stock: string }[]>([
    { price: "", stock: "" },
  ]);
  const [images, setImages] = useState<FileList | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  // estado para el modal de eliminación
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dto = {
      ...form,
      variants: variants.map((v) => ({
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    };
    const formData = new FormData();
    formData.append("dto", JSON.stringify(dto));
    if (images) {
      Array.from(images).forEach((file) => formData.append("images", file));
    }
    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      setForm({ name: "", slug: "", categoryId: "", description: "" });
      setVariants([{ price: "", stock: "" }]);
      setImages(null);
      setEditing(null);
      load();
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
        price: String(v.price),
        stock: String(v.stock),
      }))
    );
    setEditing(p);
  };

  // abre el modal
  const requestDelete = (id: string) => setDeleteId(id);

  // ejecuta la eliminación
  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${deleteId}`, {
      method: "DELETE",
    });
    setDeleting(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`No se pudo eliminar: ${err?.message || res.statusText}`);
      return;
    }

    // actualización optimista
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
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
          className="w-full border p-2"
          required
        />
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="Slug"
          className="w-full border p-2"
          required
        />
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="w-full border p-2"
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
          className="w-full border p-2"
        />
        {variants.map((v, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={v.price}
              onChange={(e) => {
                const arr = [...variants];
                arr[idx].price = e.target.value;
                setVariants(arr);
              }}
              placeholder="Precio"
              className="w-full border p-2"
            />
            <input
              value={v.stock}
              onChange={(e) => {
                const arr = [...variants];
                arr[idx].stock = e.target.value;
                setVariants(arr);
              }}
              placeholder="Stock"
              className="w-full border p-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setVariants([...variants, { price: "", stock: "" }])}
          className="text-sm text-yellow-300"
        >
          Agregar variante
        </button>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="w-full"
        />
        <button
          type="submit"
          className="rounded border border-yellow-400 px-4 py-2 text-yellow-300 hover:bg-yellow-400/10"
        >
          {editing ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* Modal de confirmación negro + dorado */}
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
    </div>
  );
}
