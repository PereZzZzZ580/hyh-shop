"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Media {
  id: string;
  url: string;
  productId?: string | null;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<Media[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  async function load() {
    const res = await fetch("/api/media");
    if (res.ok) {
      const data = await res.json();
      setImages(data);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("images", f));
    await fetch("/api/media/upload", { method: "POST", body: formData });
    setFiles(null);
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Galería</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Subir
        </button>
      </form>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <li key={img.id} className="relative">
            <Image src={img.url}
             alt=""
             width={200} 
             height={200} 
             className="w-full h-auto" 
             />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
