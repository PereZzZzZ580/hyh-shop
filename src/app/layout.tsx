import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Header from "../components/Header";
import "./globals.css";
import Footer from "../components/Footer";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const sans = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "HYH Shop",
  description: "Ropa y productos para barbería",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${display.variable} bg-bg text-text`}>
      <body>
        <Header />
        <main className="container py-10 md:py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
