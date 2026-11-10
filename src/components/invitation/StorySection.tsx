import React from "react";
import Image from "next/image";
import { BotanicalSprig, EditorialDivider } from "@/components/ornaments/BotanicalElements";
import { ScrollReveal } from "@/components/invitation/ScrollReveal";
import { WEDDING_DATA } from "@/lib/wedding-data";

export function StorySection() {
  return (
    <section
      id="historia"
      aria-labelledby="story-heading"
      className="bg-ivory overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Fotografia Editorial com Moldura Dourada Desfasada */}
          <ScrollReveal className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div
                className="absolute -inset-3 sm:-inset-4 border border-gold/40 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative aspect-[3/2] overflow-hidden bg-beige shadow-editorial">
                <Image
                  src={WEDDING_DATA.storyPhoto.src}
                  alt={WEDDING_DATA.storyPhoto.alt}
                  width={WEDDING_DATA.storyPhoto.width}
                  height={WEDDING_DATA.storyPhoto.height}
                  sizes="(max-width: 1024px) 92vw, 48vw"
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Texto "A nossa história" */}
          <ScrollReveal delayMs={150} className="lg:col-span-6 text-center lg:text-left">
            <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-gold-dark mb-3">
              Capítulo I · O Nosso Encontro
            </span>

            <h2
              id="story-heading"
              className="font-serif text-4xl sm:text-5xl text-espresso font-normal tracking-wide"
            >
              {WEDDING_DATA.copy.storyTitle}
            </h2>

            <div className="my-6 flex justify-center lg:justify-start" aria-hidden="true">
              <span className="h-[1px] w-16 bg-gold" />
            </div>

            <p className="text-espresso-muted text-base sm:text-[17px] leading-[1.9] font-light">
              {WEDDING_DATA.copy.storyBody}
            </p>

            <p className="mt-8 font-serif italic text-2xl sm:text-3xl text-espresso">
              {WEDDING_DATA.couple.groomShort} &amp; {WEDDING_DATA.couple.brideShort}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Faixa de Destaque Romântica */}
      <div className="bg-beige/65 border-y border-gold/25 py-16 sm:py-20 px-6">
        <ScrollReveal className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <BotanicalSprig className="w-24 h-8 text-gold mb-4" />
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-espresso leading-relaxed">
            &ldquo;{WEDDING_DATA.copy.highlightQuote}&rdquo;
          </p>
          <EditorialDivider className="w-40 mt-6" />
        </ScrollReveal>
      </div>
    </section>
  );
}
