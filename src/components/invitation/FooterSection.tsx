import React from "react";
import Link from "next/link";
import { BotanicalSprig, EditorialDivider } from "@/components/ornaments/BotanicalElements";
import { WEDDING_DATA } from "@/lib/wedding-data";

export function FooterSection() {
  const brandHref =
    process.env.NEXT_PUBLIC_CHARLE_CONVITES_URL?.trim() ||
    WEDDING_DATA.brand.defaultUrl;

  const isExternalBrand = /^https?:\/\//i.test(brandHref);

  return (
    <footer className="bg-[#382F28] text-ivory pt-20 pb-12 px-6">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        <BotanicalSprig className="w-24 h-8 text-gold-light mb-5" />

        <p className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.14em] text-ivory font-normal">
          {WEDDING_DATA.couple.monogram}
        </p>

        <p className="mt-6 font-serif text-2xl sm:text-3xl text-[#F2E9DC]">
          {WEDDING_DATA.copy.footerLove}
        </p>

        <p className="mt-2 font-serif italic text-lg sm:text-xl text-ivory/80">
          {WEDDING_DATA.copy.footerPleasure}
        </p>

        <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-gold-light/90">
          {WEDDING_DATA.event.dateShort} · {WEDDING_DATA.event.cityCountry}
        </p>

        <EditorialDivider className="w-44 my-10 opacity-75" />

        {/* Crédito discreto da marca Charle Convites com ligação configurável */}
        <p className="text-[11px] tracking-[0.14em] text-ivory/65">
          {WEDDING_DATA.copy.footerCreditPrefix}{" "}
          {isExternalBrand ? (
            <a
              href={brandHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light hover:text-white underline underline-offset-4 decoration-gold-light/50 transition-colors"
            >
              {WEDDING_DATA.brand.name}
            </a>
          ) : (
            <Link
              href={brandHref}
              className="text-gold-light hover:text-white underline underline-offset-4 decoration-gold-light/50 transition-colors"
            >
              {WEDDING_DATA.brand.name}
            </Link>
          )}
          .
        </p>
      </div>
    </footer>
  );
}
