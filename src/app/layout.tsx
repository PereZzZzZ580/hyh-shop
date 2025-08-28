import type { Metadata } from "next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "HYH Shop",
  description: "Ropa y productos para barbería",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="es" className="bg-bg text-text">
      <body>
        <Header />
        <main className="pt-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
