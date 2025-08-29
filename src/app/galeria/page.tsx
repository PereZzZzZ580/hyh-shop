"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type MediaItem = {
  id: string | number;
  url: string;
  title?: string;
  productId?: string | null;
};

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default function GaleriaPage() {
  const [fotos, setFotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const all = await fetchJSON<MediaItem[]>("/api/media");
      if (!mounted) return;
      const list = (all ?? []).filter((m) => !m.productId);
      const clean = (u: string) => u.split("#")[0].split("?")[0].toLowerCase();
      const isImage = (u: string) => /(\.png|\.jpg|\.jpeg|\.webp|\.avif|\.gif)$/i.test(clean(u));
      const isVideo = (u: string) => /(\.mp4|\.webm|\.mov|\.mkv|\.avi)$/i.test(clean(u));
      setFotos(list.filter((m) => isImage(m.url)));
      setVideos(list.filter((m) => isVideo(m.url)));
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section>
      <h1 className="text-3xl md:text-4xl font-bold text-gold mb-6">Galería</h1>
      <p className="text-muted mb-10">Momentos y trabajos de nuestra barbería.</p>

      {/* Fotos */}
      <div className="mb-2 md:mb-4">
        <h2 className="text-2xl font-semibold text-gold mb-4">Fotos</h2>
        {loading && <p className="text-muted">Cargando fotos…</p>}
        {!loading && fotos.length === 0 && (
          <p className="text-muted">Aún no hay fotos.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {fotos.map((item) => (
            <figure
              key={`foto-${item.id}`}
              className="rounded-xl border border-[color:var(--border)] bg-surface shadow-[var(--shadow-base)]"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.title || "Foto de galería"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              </div>
              {item.title && (
                <figcaption className="text-sm text-center text-muted px-3 py-2">
                  {item.title}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div>
        <h2 className="text-2xl font-semibold text-gold mb-1 md:mb-2">Videos</h2>
        {loading && <p className="text-muted">Cargando videos…</p>}
        {!loading && videos.length === 0 && (
          <p className="text-muted">Aún no hay videos.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {videos.map((item) => (
            <figure
              key={`video-${item.id}`}
              className="rounded-xl border border-[color:var(--border)] bg-surface shadow-[var(--shadow-base)]"
            >
              <div className="relative aspect-[9/10] bg-black rounded-xl overflow-hidden">
                <video
                  src={item.url}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-contain object-top"
                />
              </div>
              {item.title && (
                <figcaption className="text-sm text-center text-muted px-3 py-2">
                  {item.title}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
