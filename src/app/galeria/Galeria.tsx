import Gallery from "@/components/Gallery";

const imagenes = [
  "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542060748-10c28b62716d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
];

export default function Galeria() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-center mb-8">Galería</h1>
      <Gallery images={imagenes} />
    </section>
  );
}
