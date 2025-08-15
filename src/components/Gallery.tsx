import Image from "next/image";

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-xl border border-gold">
          <Image src={src} alt={`Imagen ${index + 1}`} fill className="object-cover" />
        </div>
      ))}
    </section>
  );
}