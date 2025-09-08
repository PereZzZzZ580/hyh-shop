import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "HYH Shop",
  description: "Ropa y productos para barbería",
  icons: {
    icon: [
      { url: "/favico_barberia-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favico_barberia-64.png", type: "image/png", sizes: "64x64" },
      { url: "/favico_barberia.ico", type: "image/x-icon" },
    ],
    shortcut: "/favico_barberia-64.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-bg text-text">
      <body>
        <Header />
        <main className="pt-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="motion-safe:opacity-0 motion-safe:translate-y-1 motion-safe:animate-[fadeIn_.5s_ease-out_forwards]">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
