import type { Metadata } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { CartProvider } from "@/lib/cart-context";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Onest({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "СОПІЛКА | 3D Print Studio — Українські духові інструменти",
  description: "Виготовляємо традиційні українські духові інструменти за допомогою сучасних технологій 3D-друку. Сопілки, окаріни, флейти Пана та дудки.",
  keywords: ["сопілка", "флейта", "окаріна", "3D друк", "українські інструменти", "народні інструменти"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} antialiased font-[family-name:var(--font-body)] min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Header />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
