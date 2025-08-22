import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto py-8">
      <nav className="mb-8 flex gap-4">
        <Link href="/admin/products" className="hover:underline">
          Productos
        </Link>
        <Link href="/admin/galeria" className="hover:underline">
          Galería
        </Link>
      </nav>
      {children}
    </div>
  );
}