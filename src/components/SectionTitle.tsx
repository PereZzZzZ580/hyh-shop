import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  underline?: boolean;
}

export default function SectionTitle({ children, underline = false }: SectionTitleProps) {
  return (
    <div>
      <h2 className="text-gold text-[26px] sm:text-[28px] md:text-[36px] font-semibold">
        {children}
      </h2>
      {underline && <div className="mt-2 w-16 h-[2px] bg-gold" />}
    </div>
  );
}