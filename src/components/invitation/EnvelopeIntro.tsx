"use client";

import React, { useEffect, useState } from "react";
import { BotanicalSprig, WaxSealMonogram } from "@/components/ornaments/BotanicalElements";
import { WEDDING_DATA } from "@/lib/wedding-data";

interface EnvelopeIntroProps {
  onOpened: () => void;
  onUserInteractOpen?: () => void;
}

export function EnvelopeIntro({
  onOpened,
  onUserInteractOpen,
}: EnvelopeIntroProps) {
  const [stage, setStage] = useState<"idle" | "opening" | "fading" | "done">("idle");

  useEffect(() => {
    if (stage === "done") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  const handleOpen = () => {
    if (stage !== "idle") return;

    onUserInteractOpen?.();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setStage("done");
      onOpened();
      return;
    }

    setStage("opening");

    window.setTimeout(() => {
      setStage("fading");
    }, 1250);

    window.setTimeout(() => {
      setStage("done");
      onOpened();
    }, 1850);
  };

  if (stage === "done") {
    return null;
  }

  const isOpeningOrFading = stage === "opening" || stage === "fading";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Abertura do convite de casamento de Daniel e Sofia"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-4 py-8 sm:py-12 bg-ivory paper-texture overflow-hidden transition-opacity duration-700 ease-out ${
        stage === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Moldura fina interior decorativa */}
      <div
        className="pointer-events-none absolute inset-3 sm:inset-6 border border-gold/25"
        aria-hidden="true"
      />

      {/* Cabeçalho discreto com monograma */}
      <div className="relative z-10 flex flex-col items-center text-center pt-1 sm:pt-2">
        <BotanicalSprig className="w-24 h-8 text-gold/80 mb-1" />
        <p className="font-serif text-xl sm:text-2xl tracking-[0.22em] text-espresso">
          {WEDDING_DATA.couple.monogram}
        </p>
      </div>

      {/* Centro: Envelope Digital Animado */}
      <div className="relative z-10 w-full max-w-[360px] sm:max-w-[430px] my-auto flex flex-col items-center">
        <p className="font-serif italic text-2xl sm:text-3xl text-espresso mb-6 sm:mb-8 text-center">
          {WEDDING_DATA.copy.envelopePrompt}
        </p>

        {/* Contentor 3D do Envelope */}
        <div
          onClick={handleOpen}
          className="group relative w-full aspect-[16/11] cursor-pointer select-none"
          style={{ perspective: "1200px" }}
        >
          {/* Sombra e base do envelope */}
          <div className="absolute inset-0 rounded-[4px] bg-[#E3D6C3] shadow-envelope border border-gold/35" />

          {/* Interior escuro/quente do envelope */}
          <div className="absolute inset-[2px] rounded-[3px] bg-[#D6C5AD]" />

          {/* Cartão interior que sobe suavemente ao abrir */}
          <div
            className={`absolute left-[6%] right-[6%] top-[8%] bottom-[8%] bg-ivory rounded-[2px] border border-gold/40 shadow-md flex flex-col items-center justify-center px-5 text-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpeningOrFading
                ? "-translate-y-[42%] sm:-translate-y-[46%] delay-300 z-20"
                : "translate-y-0 z-10"
            }`}
          >
            <div className="absolute inset-2 border border-gold/25 pointer-events-none" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-gold-dark mb-1.5">
              Convite de Casamento
            </span>
            <p className="font-serif text-2xl sm:text-3xl tracking-[0.1em] text-espresso">
              {WEDDING_DATA.couple.displayNames}
            </p>
            <span className="mt-2 h-[1px] w-12 bg-gold/50" />
            <p className="mt-2 text-[11px] tracking-[0.24em] text-espresso-muted uppercase">
              {WEDDING_DATA.event.dateShort}
            </p>
          </div>

          {/* Abas laterais do envelope (frente) */}
          <svg
            viewBox="0 0 400 275"
            className="absolute inset-0 w-full h-full z-20 pointer-events-none rounded-[4px]"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Aba esquerda */}
            <polygon points="0,0 200,142 0,275" fill="#EBE1D3" />
            <line
              x1="0"
              y1="0"
              x2="200"
              y2="142"
              stroke="rgba(185,154,104,0.35)"
              strokeWidth="1"
            />
            {/* Aba direita */}
            <polygon points="400,0 200,142 400,275" fill="#E6DAC9" />
            <line
              x1="400"
              y1="0"
              x2="200"
              y2="142"
              stroke="rgba(185,154,104,0.35)"
              strokeWidth="1"
            />
            {/* Bolso inferior frontal */}
            <polygon points="0,275 178,132 222,132 400,275" fill="#F1E9DD" />
            <polyline
              points="0,275 178,132 222,132 400,275"
              fill="none"
              stroke="rgba(185,154,104,0.48)"
              strokeWidth="1.1"
            />
          </svg>

          {/* Aba superior articulada em 3D */}
          <div
            className="absolute inset-x-0 top-0 h-[58%] origin-top transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none"
            style={{
              transformStyle: "preserve-3d",
              transform: isOpeningOrFading ? "rotateX(180deg)" : "rotateX(0deg)",
              zIndex: isOpeningOrFading ? 15 : 30,
            }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 400 160"
              className="w-full h-full drop-shadow-[0_6px_12px_rgba(64,54,46,0.1)]"
              preserveAspectRatio="none"
            >
              <polygon points="0,0 400,0 200,156" fill="#F5EFE6" />
              <polyline
                points="0,0 200,156 400,0"
                fill="none"
                stroke="rgba(185,154,104,0.55)"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          {/* Selo de lacre central D & S */}
          <div
            className={`absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
              isOpeningOrFading
                ? "opacity-0 scale-75 pointer-events-none"
                : "opacity-100 scale-100 group-hover:scale-105"
            }`}
          >
            <WaxSealMonogram
              monogram={WEDDING_DATA.couple.monogram}
              className="w-[74px] h-[74px] sm:w-[84px] sm:h-[84px]"
            />
          </div>
        </div>

        {/* Botão de acção principal */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center">
          <button
            type="button"
            onClick={handleOpen}
            disabled={isOpeningOrFading}
            className="group relative inline-flex items-center justify-center px-9 py-3.5 bg-espresso text-ivory text-xs sm:text-[13px] uppercase tracking-[0.24em] font-medium border border-espresso hover:bg-transparent hover:text-espresso transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:opacity-60"
          >
            <span>{WEDDING_DATA.copy.envelopeCta}</span>
          </button>
          <span className="mt-3 text-[11px] tracking-[0.18em] text-espresso-soft uppercase">
            Beira · Moçambique
          </span>
        </div>
      </div>

      {/* Rodapé discreto da abertura */}
      <div className="relative z-10 text-center pb-1">
        <p className="text-[10px] uppercase tracking-[0.26em] text-espresso-soft/80">
          {WEDDING_DATA.brand.name}
        </p>
      </div>
    </div>
  );
}
