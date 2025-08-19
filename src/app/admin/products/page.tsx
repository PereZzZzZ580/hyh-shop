"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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

  async function load() {
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
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

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <ul className="mb-8 space-y-2">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-4">
            <span className="flex-1">{p.name}</span>
            <button
              onClick={() => handleEdit(p)}
              className="text-blue-600 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">
        {editing ? "Editar producto" : "Nuevo producto"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nombre"
          className="border p-2 w-full"
          required
        />
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="Slug"
          className="border p-2 w-full"
          required
        />
        <input
          value={form.categoryId}
          onChange={(e) =>
            setForm({ ...form, categoryId: e.target.value })
          }
          placeholder="ID de categoría"
          className="border p-2 w-full"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Descripción"
          className="border p-2 w-full"
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
              className="border p-2 w-full"
            />
            <input
              value={v.stock}
              onChange={(e) => {
                const arr = [...variants];
                arr[idx].stock = e.target.value;
                setVariants(arr);
              }}
              placeholder="Stock"
              className="border p-2 w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setVariants([...variants, { price: "", stock: "" }])}
          className="text-sm text-blue-600"
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editing ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}
