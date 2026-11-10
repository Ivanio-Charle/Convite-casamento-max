import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { BotanicalSprig, EditorialDivider } from "@/components/ornaments/BotanicalElements";
import { ScrollReveal } from "@/components/invitation/ScrollReveal";
import { WEDDING_DATA } from "@/lib/wedding-data";

export function HeroSection() {
  return (
    <section id="inicio" aria-label="Apresentação dos noivos">
      {/* Fotografia Principal em Destaque Editorial */}
      <div className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden bg-espresso">
        <Image
          src={WEDDING_DATA.heroPhoto.src}
          alt={WEDDING_DATA.heroPhoto.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_46%] sm:object-[50%_54%] animate-slow-zoom"
        />

        {/* Camadas de contraste suave editorial para leitura impecável */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(32, 24, 18, 0.34) 0%, rgba(32, 24, 18, 0.08) 42%, rgba(32, 24, 18, 0.56) 76%, rgba(28, 21, 16, 0.80) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Moldura fina interior dourada */}
        <div
          className="pointer-events-none absolute inset-4 sm:inset-7 border border-ivory/25"
          aria-hidden="true"
        />

        {/* Topo discreto */}
        <div className="relative z-10 pt-10 sm:pt-14 px-6 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.34em] text-ivory/85">
            {WEDDING_DATA.event.cityCountry}
          </p>
        </div>

        {/* Composição Tipográfica Principal sobre a fotografia */}
        <div className="relative z-10 px-6 pb-16 sm:pb-20 pt-24 text-center max-w-4xl mx-auto flex flex-col items-center">
          <span
            className="mb-4 h-[1px] w-14 bg-gold-light/80"
            aria-hidden="true"
          />

          <h1 className="font-serif font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-[0.14em] text-white leading-[1.08] drop-shadow-sm">
            {WEDDING_DATA.couple.displayNamesUpper}
          </h1>

          <p className="mt-4 sm:mt-5 font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#EFE4D2] tracking-wide">
            &ldquo;{WEDDING_DATA.copy.heroAnnouncement}&rdquo;
          </p>

          <div className="mt-6 sm:mt-8 inline-flex items-center gap-4 px-5 py-2.5 border-y border-gold-light/55">
            <span className="text-xs sm:text-sm uppercase tracking-[0.28em] text-white font-normal">
              {WEDDING_DATA.event.dateDisplayUpper}
            </span>
          </div>

          {/* Indicador elegante de navegação */}
          <a
            href="#mensagem-boas-vindas"
            aria-label="Deslizar para ler a mensagem do convite"
            className="mt-10 sm:mt-12 inline-flex flex-col items-center gap-1.5 text-ivory/80 hover:text-white transition-colors"
          >
            <span className="text-[10px] uppercase tracking-[0.26em]">
              Descobrir
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Mensagem Principal do Convite (Editorial Letterpress Card) */}
      <div
        id="mensagem-boas-vindas"
        className="relative bg-ivory py-20 sm:py-28 px-6 border-b border-gold/20"
      >
        <ScrollReveal className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <BotanicalSprig className="w-28 h-10 text-gold mb-5" />
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold-dark mb-5">
            {WEDDING_DATA.couple.groomFull} &amp; {WEDDING_DATA.couple.brideFull}
          </p>
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-[2.1rem] leading-[1.55] text-espresso font-normal">
            &ldquo;{WEDDING_DATA.copy.mainMessage}&rdquo;
          </blockquote>
          <EditorialDivider className="w-48 mt-9" />
        </ScrollReveal>
      </div>
    </section>
  );
}
