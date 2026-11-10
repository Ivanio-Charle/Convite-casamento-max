import React from "react";

interface OrnamentProps {
  className?: string;
}

/**
 * Ramo botânico minimalista de traço fino (inspirado em ramos de acácia e oliveira)
 */
export function BotanicalSprig({ className = "w-28 h-10 text-gold" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 180 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Caule central suave */}
      <path
        d="M22 34C58 31 112 24 158 22"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      {/* Folhas superiores */}
      <path
        d="M52 31C48 21 55 13 66 15C62 24 57 29 52 31Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <path
        d="M84 28C82 17 90 10 101 13C96 21 90 26 84 28Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <path
        d="M118 25C117 15 125 9 135 12C130 19 124 23 118 25Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      {/* Folhas inferiores */}
      <path
        d="M67 30C71 39 65 46 54 45C58 37 62 32 67 30Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <path
        d="M101 26C106 35 100 43 89 41C93 34 97 29 101 26Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <path
        d="M134 23C138 31 133 38 123 37C127 31 130 26 134 23Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      {/* Folha terminal */}
      <path
        d="M154 22C161 18 168 19 172 22C167 25 160 25 154 22Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      {/* Pequenos botões florais */}
      <circle cx="40" cy="27" r="1.4" fill="currentColor" />
      <circle cx="146" cy="17" r="1.3" fill="currentColor" />
    </svg>
  );
}

/**
 * Divisor editorial delicado com linhas finas douradas e flor-de-lis geométrica central
 */
export function EditorialDivider({ className = "w-56 max-w-full mx-auto" }: OrnamentProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 select-none ${className}`}
      aria-hidden="true"
    >
      <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/50 to-gold/80" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-4 h-4 text-gold shrink-0"
      >
        <path
          d="M12 3L14.6 9.4L21 12L14.6 14.6L12 21L9.4 14.6L3 12L9.4 9.4L12 3Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
      <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gold/50 to-gold/80" />
    </div>
  );
}

/**
 * Selo de lacre dourado com monograma D & S para o envelope digital
 */
export function WaxSealMonogram({
  monogram = "D & S",
  className = "w-20 h-20",
}: {
  monogram?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center select-none shadow-seal ${className}`}
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #D6BE94 0%, #B99A68 52%, #8F7143 100%)",
      }}
    >
      {/* Anel exterior orgânico de lacre */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="43"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="0.9"
        />
        <circle
          cx="50"
          cy="50"
          r="39"
          stroke="rgba(64, 54, 46, 0.25)"
          strokeWidth="0.7"
          strokeDasharray="1.8 2.4"
        />
      </svg>
      <span className="relative font-serif text-ivory tracking-[0.12em] text-lg sm:text-xl font-medium drop-shadow-sm">
        {monogram}
      </span>
    </div>
  );
}
