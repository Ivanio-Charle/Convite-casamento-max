"use client";

import React, { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/invitation/ScrollReveal";
import { WEDDING_DATA } from "@/lib/wedding-data";

interface CountdownState {
  mounted: boolean;
  arrived: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_EPOCH_MS = new Date(WEDDING_DATA.event.isoTargetMaputo).getTime();

function computeTimeLeft(): Omit<CountdownState, "mounted"> {
  const diff = TARGET_EPOCH_MS - Date.now();
  if (diff <= 0) {
    return {
      arrived: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    arrived: false,
    days,
    hours,
    minutes,
    seconds,
  };
}

function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}

export function CountdownSection() {
  const [timeState, setTimeState] = useState<CountdownState>({
    mounted: false,
    arrived: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      setTimeState({
        mounted: true,
        ...computeTimeLeft(),
      });
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = [
    {
      label: "Dias",
      value: timeState.mounted ? String(timeState.days) : "--",
    },
    {
      label: "Horas",
      value: timeState.mounted ? padTwo(timeState.hours) : "--",
    },
    {
      label: "Minutos",
      value: timeState.mounted ? padTwo(timeState.minutes) : "--",
    },
    {
      label: "Segundos",
      value: timeState.mounted ? padTwo(timeState.seconds) : "--",
    },
  ];

  return (
    <section
      aria-label="Contagem decrescente para o casamento"
      className="bg-ivory py-20 sm:py-28 px-6 border-b border-gold/20"
    >
      <ScrollReveal className="max-w-4xl mx-auto text-center">
        <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-gold-dark mb-3">
          Contagem Decrescente
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-espresso font-normal">
          Falta pouco para o nosso &ldquo;Sim&rdquo;
        </h2>
        <p className="mt-3 text-xs sm:text-sm tracking-[0.16em] uppercase text-espresso-soft">
          {WEDDING_DATA.event.dateDisplay} · {WEDDING_DATA.event.ceremonyTime} (Horário de Moçambique)
        </p>

        {timeState.mounted && timeState.arrived ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-10 p-8 sm:p-10 bg-white border border-gold/40 shadow-editorial max-w-2xl mx-auto"
          >
            <p className="font-serif text-3xl sm:text-4xl text-espresso">
              {WEDDING_DATA.copy.countdownArrivedTitle}
            </p>
            <p className="mt-3 text-sm sm:text-base text-espresso-muted leading-relaxed">
              {WEDDING_DATA.copy.countdownArrivedBody}
            </p>
          </div>
        ) : (
          <div
            role="timer"
            aria-live="off"
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto"
          >
            {units.map((unit) => (
              <div
                key={unit.label}
                className="relative bg-white/90 border border-gold/35 py-7 sm:py-9 px-4 shadow-editorial flex flex-col items-center justify-center"
              >
                <div
                  className="absolute inset-1.5 border border-gold/15 pointer-events-none"
                  aria-hidden="true"
                />
                <span className="font-serif text-4xl sm:text-5xl md:text-6xl text-espresso font-normal tabular-nums leading-none">
                  {unit.value}
                </span>
                <span className="mt-3 text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-gold-dark font-medium">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
