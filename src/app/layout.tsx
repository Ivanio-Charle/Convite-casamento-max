import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F5EF",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"
  ),
  title: "Daniel & Sofia — Convite de Casamento | 19 de Dezembro de 2026",
  description:
    "Dois corações, uma história e uma vida inteira para escrever. Com muita alegria, convidamos-te a celebrar o início do nosso para sempre em Beira, Moçambique.",
  keywords: [
    "Convite Digital de Casamento",
    "Daniel e Sofia",
    "Charle Convites",
    "Casamento Beira Moçambique",
    "Convite Interactivo Premium",
  ],
  authors: [{ name: "Charle Convites" }],
  icons: {
    icon: "/icons/monogram-ds.svg",
  },
  openGraph: {
    title: "Daniel & Sofia — Vamos Casar! | 19.12.2026",
    description:
      "Com muita alegria, convidamos-te a celebrar o início do nosso para sempre. Beira, Moçambique.",
    type: "website",
    locale: "pt_MZ",
    siteName: "Charle Convites",
    images: [
      {
        url: "/images/couple/01-horizonte-dourado.jpg",
        width: 1333,
        height: 2000,
        alt: "Daniel & Sofia — Convite de Casamento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel & Sofia — Convite de Casamento | 19.12.2026",
    description:
      "Uma história escrita pelo destino, celebrada pelo amor. Confirma a tua presença.",
    images: ["/images/couple/01-horizonte-dourado.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-ivory text-espresso antialiased">
        {children}
      </body>
    </html>
  );
}
