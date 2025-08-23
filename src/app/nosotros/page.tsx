import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce a nuestro barbero con más de cinco años de experiencia ofreciendo servicios a domicilio.",
};

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-center">Nosotros</h1>
      <p>
        Con más de cinco años de experiencia en el arte del cuidado capilar, nuestro barbero ha atendido a numerosas personas maravillosas, ganándose su confianza mediante un servicio impecable y dedicado.
      </p>
      <p>
        Ama profundamente su profesión y la ejerce con el máximo nivel de profesionalismo, prestando atención a cada detalle para ofrecer resultados que superan las expectativas.
      </p>
      <p>
        Actualmente trabajamos en la construcción de nuestra sede física. Mientras tanto, todos los servicios se realizan a domicilio, brindando comodidad y calidad directamente en la casa de cada cliente.
      </p>
      <p className="italic text-center">
        &ldquo;La pasión y la disciplina transforman cada corte en una obra maestra.&rdquo;
      </p>
    </section>
  );
}