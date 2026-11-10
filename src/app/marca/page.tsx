import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BotanicalSprig, EditorialDivider } from "@/components/ornaments/BotanicalElements";
import { WEDDING_DATA } from "@/lib/wedding-data";

export const metadata: Metadata = {
  title: "Charle Convites — Experiências Digitais de Casamento",
  description:
    "Página institucional demonstrativa da marca Charle Convites — Convites digitais interactivos e sofisticados.",
};

export default function BrandPlaceholderPage() {
  return (
    <main className="min-h-screen bg-ivory paper-texture flex items-center justify-center p-6">
      <div className="relative max-w-xl w-full bg-white border border-gold/40 p-10 sm:p-14 shadow-editorial text-center flex flex-col items-center">
        <div
          className="pointer-events-none absolute inset-3 border border-gold/20"
          aria-hidden="true"
        />

        <BotanicalSprig className="w-24 h-8 text-gold mb-4" />

        <span className="text-[10px] uppercase tracking-[0.3em] text-gold-dark mb-2">
          Marca Oficial
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl text-espresso font-normal">
          {WEDDING_DATA.brand.name}
        </h1>

        <p className="mt-3 font-serif italic text-xl text-espresso-muted">
          {WEDDING_DATA.brand.tagline}
        </p>

        <EditorialDivider className="w-40 my-7" />

        <p className="text-sm text-espresso-muted leading-relaxed font-light max-w-md">
          Esta é a página institucional de reserva da{" "}
          <strong className="font-medium text-espresso">Charle Convites</strong>.
          Quando o website institucional definitivo estiver publicado, basta definir a variável de ambiente{" "}
          <code className="px-1.5 py-0.5 bg-ivory border border-beige text-xs text-espresso">
            NEXT_PUBLIC_CHARLE_CONVITES_URL
          </code>{" "}
          para direccionar automaticamente todos os convites para o domínio oficial da agência.
        </p>

        <div className="mt-9 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-espresso text-ivory text-xs uppercase tracking-[0.22em] hover:bg-gold-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao convite Daniel &amp; Sofia</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
