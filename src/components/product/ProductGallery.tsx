"use client";
import { useState } from "react";
import Image from "next/image";        
import ImageZoom from "./ImageZoom";

type Props = {
  images: string[];
  className?: string;
  thumbClassName?: string;
  zoom?: number;
};

export default function ProductGallery({
  images,
  className = "",
  thumbClassName = "h-12 w-12", // 56x56
  zoom = 2.0,
}: Props) {
  const safeImages = images?.length ? images : ["/placeholder.png"];
  const [idx, setIdx] = useState(0);

  return (
    <div className={`grid gap-3 md:grid-cols-[72px_1fr] ${className}`}>
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-auto md:block md:overflow-visible">
        {safeImages.map((src, i) => (
          <button
            key={`${src}-${i}`}
            onClick={() => setIdx(i)}
            className={`relative shrink-0 overflow-hidden rounded-xl border
              ${thumbClassName}
              ${i === idx ? "border-yellow-400" : "border-white/15 hover:border-white/30"}`}
            aria-label={`Imagen ${i + 1}`}
          >
            {/* Contenedor relativo + Image con fill para cubrir */}
            <Image
              src={src}
              alt={`thumb-${i}`}
              fill
              className="object-cover"
              sizes="56px"            // descarga sólo lo necesario para el thumb
              priority={i === 0}      // primer thumb en alta prioridad
              // unoptimized // <- descomenta si tus URLs son blob:/data: en dev
            />
          </button>
        ))}
      </div>

      {/* Imagen principal (con lupa) */}
      <ImageZoom
        src={safeImages[idx]}
        alt={`Imagen ${idx + 1}`}
        zoom={zoom}
        className="aspect-square w-full"
      />
    </div>
  );
}
