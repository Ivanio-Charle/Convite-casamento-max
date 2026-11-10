"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { BotanicalSprig } from "@/components/ornaments/BotanicalElements";
import { ScrollReveal } from "@/components/invitation/ScrollReveal";
import { GALLERY_PHOTOS, WEDDING_DATA } from "@/lib/wedding-data";

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const photos = GALLERY_PHOTOS;
  const isOpen = activeIndex !== null && photos[activeIndex] !== undefined;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null || photos.length === 0) return null;
      return (prev - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null || photos.length === 0) return null;
      return (prev + 1) % photos.length;
    });
  }, [photos.length]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeLightbox, showPrev, showNext]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <section
      id="momentos"
      aria-labelledby="gallery-heading"
      className="bg-beige/35 py-20 sm:py-28 lg:py-32 px-6 border-b border-gold/25"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center flex flex-col items-center mb-14 sm:mb-18">
          <BotanicalSprig className="w-24 h-8 text-gold mb-3" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-dark mb-2">
            Álbum Editorial
          </span>
          <h2
            id="gallery-heading"
            className="font-serif text-4xl sm:text-5xl text-espresso font-normal"
          >
            {WEDDING_DATA.copy.galleryTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-espresso-muted font-light max-w-lg">
            Instantes que guardam a essência da nossa cumplicidade. Toca numa fotografia para ampliar.
          </p>
        </ScrollReveal>

        {photos.length === 0 ? (
          /* Fallback explícito caso a pasta de fotografias esteja vazia */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                className="aspect-[3/4] bg-ivory border border-dashed border-gold/60 flex flex-col items-center justify-center p-8 text-center"
              >
                <span className="font-serif text-2xl text-espresso">
                  Fotografia {slot}
                </span>
                <p className="mt-2 text-xs text-espresso-soft leading-relaxed">
                  Coloque as fotografias reais do casal em{" "}
                  <code className="text-espresso">public/images/couple/</code>
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Grelha Editorial Assimétrica com Proporções Variadas */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 space-y-5 sm:space-y-6">
            {photos.map((photo, index) => (
              <ScrollReveal
                key={photo.id}
                delayMs={(index % 3) * 100}
                className="break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ampliar fotografia ${index + 1} de ${photos.length}: ${photo.caption}`}
                  className="group relative block w-full overflow-hidden bg-white p-2 sm:p-2.5 border border-gold/30 shadow-editorial text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <div className="relative w-full overflow-hidden bg-beige-soft">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                      className="w-full h-auto object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />

                    {/* Véu subtil no hover */}
                    <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/25 transition-colors duration-500 flex items-end justify-between p-4">
                      <span className="text-xs font-serif italic text-ivory opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 drop-shadow">
                        {photo.caption}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-ivory/90 text-espresso flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Expand className="w-3.5 h-3.5" strokeWidth={1.6} />
                      </span>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Ampliado (Acessível e Optimizado para Telemóveis) */}
      {isOpen && activePhoto && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada da fotografia"
          onClick={closeLightbox}
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
            const deltaX = endX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(deltaX) > 48) {
              if (deltaX > 0) showPrev();
              else showNext();
            }
          }}
          className="fixed inset-0 z-50 bg-[#231D18]/95 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-8 select-none"
        >
          {/* Barra Superior do Lightbox */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-ivory z-10"
          >
            <span className="text-xs tracking-[0.24em] uppercase text-ivory/80">
              {activeIndex + 1} / {photos.length}
            </span>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Fechar visualização da fotografia"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-ivory/10 hover:bg-ivory/20 border border-ivory/25 text-xs uppercase tracking-[0.2em] text-ivory transition-colors"
            >
              <span>Fechar</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Imagem Central + Botões Anterior/Seguinte */}
          <div className="relative flex-1 flex items-center justify-center my-3 overflow-hidden">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Fotografia anterior"
              className="absolute left-1 sm:left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-ivory/15 hover:bg-ivory/25 border border-ivory/25 text-ivory flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[76vh] max-w-[90vw] sm:max-w-[82vw] flex items-center justify-center"
            >
              <Image
                key={activePhoto.id}
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
                sizes="92vw"
                priority
                className="max-h-[75vh] w-auto h-auto object-contain border border-gold/30 shadow-2xl"
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Fotografia seguinte"
              className="absolute right-1 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-ivory/15 hover:bg-ivory/25 border border-ivory/25 text-ivory flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Legenda Inferior */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="text-center pb-1 z-10"
          >
            <p className="font-serif italic text-lg sm:text-xl text-ivory/90">
              {activePhoto.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
