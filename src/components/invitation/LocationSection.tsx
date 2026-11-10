"use client";

import React, { useState } from "react";
import { Compass, ExternalLink, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/invitation/ScrollReveal";
import { VENUES, WEDDING_DATA } from "@/lib/wedding-data";
import type { VenueInfo } from "@/types/wedding";

export function LocationSection() {
  const [selectedVenueId, setSelectedVenueId] = useState<VenueInfo["id"]>("ceremony");
  const activeVenue =
    VENUES.find((v) => v.id === selectedVenueId) ?? VENUES[0];

  return (
    <section
      id="como-chegar"
      aria-labelledby="directions-heading"
      className="bg-ivory py-20 sm:py-28 px-6 border-b border-gold/20"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-gold-dark mb-2">
            Roteiro &amp; Mapas
          </span>
          <h2
            id="directions-heading"
            className="font-serif text-4xl sm:text-5xl text-espresso font-normal"
          >
            {WEDDING_DATA.copy.directionsTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-espresso-muted font-light">
            Selecciona um dos momentos abaixo para visualizar a pesquisa no mapa ou abrir a navegação directamente no Google Maps.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Cartões de Selecção e Botões Google Maps */}
          <ScrollReveal className="lg:col-span-5 flex flex-col gap-5 justify-between">
            {VENUES.map((venue) => {
              const isSelected = venue.id === activeVenue.id;
              return (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenueId(venue.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedVenueId(venue.id);
                    }
                  }}
                  aria-pressed={isSelected}
                  className={`cursor-pointer text-left p-6 sm:p-7 border transition-all duration-300 ${
                    isSelected
                      ? "bg-white border-gold shadow-editorial"
                      : "bg-beige/35 border-gold/25 hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-gold-dark font-medium">
                        {venue.id === "ceremony" ? "14h30 · Cerimónia" : "17h00 · Recepção"}
                      </span>
                      <h3 className="mt-1 font-serif text-2xl sm:text-3xl text-espresso">
                        {venue.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-espresso-muted">
                        <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                        {venue.city}
                      </p>
                    </div>
                    <span
                      className={`mt-1 w-3 h-3 rounded-full border shrink-0 transition-colors ${
                        isSelected
                          ? "bg-gold border-gold"
                          : "bg-transparent border-espresso-soft/50"
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-3 text-xs text-espresso-soft">
                    Pesquisa nominal: &ldquo;{venue.searchQuery}&rdquo; (local demonstrativo)
                  </p>

                  <div className="mt-5 pt-4 border-t border-beige flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-gold-dark">
                      <Compass className="w-3.5 h-3.5" />
                      {isSelected ? "A mostrar no mapa" : "Mostrar no mapa"}
                    </span>

                    <a
                      href={venue.mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase tracking-[0.18em] bg-espresso text-ivory hover:bg-gold-dark transition-colors"
                    >
                      <span>Abrir no Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </ScrollReveal>

          {/* Mapa Incorporado (via pesquisa nominal Google Maps, sem coordenadas inventadas) */}
          <ScrollReveal delayMs={150} className="lg:col-span-7">
            <div className="relative h-[360px] sm:h-[430px] lg:h-full min-h-[360px] bg-beige border border-gold/35 p-2.5 bg-white shadow-editorial flex flex-col">
              <div className="relative flex-1 w-full overflow-hidden bg-beige-soft">
                <iframe
                  key={activeVenue.id}
                  title={`Mapa de pesquisa demonstrativa — ${activeVenue.title}`}
                  src={activeVenue.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 grayscale-[20%] contrast-[98%]"
                />
              </div>
              <div className="pt-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-espresso-soft">
                <span>
                  A visualizar: <strong className="font-medium text-espresso">{activeVenue.title}</strong> ({activeVenue.city})
                </span>
                <span>Local demonstrativo · Pesquisa Google Maps</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
