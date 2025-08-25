import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="font-serif text-3xl md:text-4xl text-yellow-200 text-center text-balance">
      {children}
    </h2>
  );
}
