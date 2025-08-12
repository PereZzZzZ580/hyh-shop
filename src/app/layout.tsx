import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "HYH Shop",
  description: "Ropa y productos para barbería",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-black text-white">
      <body>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
