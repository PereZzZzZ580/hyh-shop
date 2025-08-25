import Image from "next/image";

interface AboutBlockProps {
  imageUrl: string;
  title: string;
  text: string;
  bullets: string[];
}

export default function AboutBlock({ imageUrl, title, text, bullets }: AboutBlockProps) {
  return (
    <section className="py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className="lg:col-span-5 space-y-6 md:space-y-8">
        <header className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-yellow-200">{title}</h2>
          <p className="mt-3 text-neutral-300/90">{text}</p>
        </header>
        <ul className="max-w-prose mx-auto list-disc list-outside pl-6 text-neutral-200 space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-yellow-400/15 bg-black/50 shadow-[0_0_30px_-10px_rgba(212,175,55,0.25)] relative w-full aspect-[4/3] overflow-hidden">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}