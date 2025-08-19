"use client";

import { useEffect, useState } from "react";
import Gallery from "@/components/Gallery";

interface Media {
  id: string;
  url: string;
  productId?: string | null;
}

export default function Galeria() {
  const [imagenes, setImagenes] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data: Media[] = await res.json();
        const urls = data
          .filter((m) => !m.productId)
          .map((m) => m.url);
        setImagenes(urls);
      }
    }
    load();
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold text-center mb-8">Galería</h1>
      <Gallery images={imagenes} />
    </section>
  );
}
