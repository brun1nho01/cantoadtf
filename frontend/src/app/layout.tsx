import type { Metadata } from "next";
import { Inter, Playfair_Display, Pinyon_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const pinyon = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-cursive" });

import CartDrawer from "@/components/layout/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cantoa.com.br"),
  title: "CantoA - Confecção & DTF Premium",
  description: "Loja premium de confecção, estamparia DTF e simulador 3D de artes.",
  keywords: ["DTF", "Confecção", "Camisetas", "Private Label", "Malha Menegotti", "Silk"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://cantoa.com.br", // Trocar em PRD
    title: "CantoA - Confecção & DTF Premium",
    description: "Crie ou Produza. Estamparia premium com Simulator 3D exclusivo e qualidade de maquinário DTF de ponta.",
    siteName: "CantoA",
    images: [
      {
        url: "/images/hero-bg.jpg", // Imagem provisória lida pela pasta public
        width: 1200,
        height: 630,
        alt: "Design Premium e Confecção CantoA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CantoA - Confecção & DTF Premium",
    description: "Simule em 3D, receba perfeição. Alta qualidade DTF.",
    images: ["/images/hero-bg.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} ${pinyon.variable} font-sans antialiased`}>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
