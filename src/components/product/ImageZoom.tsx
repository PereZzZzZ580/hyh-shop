"use client";
import { useRef, useState } from "react";
//import { ProductGallery } from "@/components/product/ProductGallery";


type Props = {
  src: string;
  alt?: string;
  zoom?: number;          // 2.5 = 250%
  className?: string;     // usa para dar tamaño (ej. aspect-square)
};

export default function ImageZoom({ src, alt = "", zoom = 1.6, className = "" }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState("center");
  const [isHover, setIsHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos(`${x}% ${y}%`);
  };

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseMove={onMove}
      className={`overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: isHover ? pos : "center",
        backgroundSize: isHover ? `${zoom * 100}%` : "contain",
      }}
      aria-label={alt}
      role="img"
    >
      {/* Mantiene altura/relación; la imagen base la manejamos como background */}
      <div className="aspect-square w-full" />
    </div>
  );
}
