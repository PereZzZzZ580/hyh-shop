import Image from "next/image";
import SectionTitle from "./SectionTitle";

interface AboutBlockProps {
  imageUrl: string;
  title: string;
  text: string;
  bullets: string[];
}

export default function AboutBlock({ imageUrl, title, text, bullets }: AboutBlockProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center py-10 md:py-12">
      <div className="relative w-full aspect-[4/3] border border-gold">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <div>
        <SectionTitle underline>{title}</SectionTitle>
        <p className="mt-4 text-white/90">{text}</p>
        <ul className="mt-6 space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-gold">✓</span>
              <span className="text-white/90">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}