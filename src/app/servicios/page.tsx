export const metadata = {
  title: "Servicios",
  description: "Servicios de barbería ofrecidos por H&H Shop",
};

export default function Servicios() {
  const servicios = [
    { nombre: "Corte de cabello", descripcion: "Estilos modernos y clásicos." },
    { nombre: "Arreglo de barba", descripcion: "Perfilado y afeitado tradicional." },
    { nombre: "Tintura", descripcion: "Color para cabello y barba." },
  ];
  return (
    <section>
      <h1 className="text-3xl font-bold text-center">Servicios</h1>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {servicios.map((s) => (
          <li key={s.nombre} className="p-4 border border-white/10 rounded-lg">
            <h2 className="text-xl font-semibold">{s.nombre}</h2>
            <p className="mt-2 opacity-80">{s.descripcion}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
