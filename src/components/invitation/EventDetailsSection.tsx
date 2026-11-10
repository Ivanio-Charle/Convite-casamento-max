import React from "react";
import { Calendar, Clock, ExternalLink, Landmark, MapPin, Wine } from "lucide-react";
import { BotanicalSprig } from "@/components/ornaments/BotanicalElements";
import { ScrollReveal } from "@/components/invitation/ScrollReveal";
import { VENUES, WEDDING_DATA } from "@/lib/wedding-data";

export function EventDetailsSection() {
  return (
    <section
      id="grande-dia"
      aria-labelledby="event-details-heading"
      className="bg-beige/45 py-20 sm:py-28 lg:py-32 px-6 border-b border-gold/25"
    >
      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center flex flex-col items-center mb-14 sm:mb-18">
          <BotanicalSprig className="w-24 h-8 text-gold mb-3" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-dark mb-2">
            Programação da Celebração
          </span>
          <h2
            id="event-details-heading"
            className="font-serif text-4xl sm:text-5xl text-espresso font-normal"
          >
            {WEDDING_DATA.copy.eventDetailsTitle}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {VENUES.map((venue, index) => {
            const isCeremony = venue.id === "ceremony";
            const Icon = isCeremony ? Landmark : Wine;

            return (
              <ScrollReveal key={venue.id} delayMs={index * 150}>
                <article className="relative h-full bg-white border border-gold/35 p-8 sm:p-11 shadow-editorial flex flex-col justify-between text-center">
                  {/* Borda fina interior */}
                  <div
                    className="pointer-events-none absolute inset-2.5 border border-gold/20"
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-ivory border border-gold/40 flex items-center justify-center text-gold-dark mb-6">
                      <Icon className="w-6 h-6" strokeWidth={1.35} aria-hidden="true" />
                    </div>

                    <span className="text-[10px] uppercase tracking-[0.26em] text-gold-dark font-medium">
                      {venue.label}
                    </span>

                    <h3 className="mt-2 font-serif text-3xl sm:text-4xl text-espresso font-normal">
                      {isCeremony ? "Cerimónia" : "Recepção"}
                    </h3>

                    <span className="my-5 h-[1px] w-12 bg-gold/60" aria-hidden="true" />

                    {/* Metadados do momento */}
                    <ul className="space-y-2.5 text-sm text-espresso">
                      <li className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-gold shrink-0" strokeWidth={1.5} />
                        <span>{venue.date}</span>
                      </li>
                      <li className="flex items-center justify-center gap-2 font-medium">
                        <Clock className="w-4 h-4 text-gold shrink-0" strokeWidth={1.5} />
                        <span>Às {venue.time}</span>
                      </li>
                      <li className="pt-2">
                        <p className="font-serif text-2xl text-espresso">{venue.title}</p>
                        <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.18em] text-espresso-soft">
                          <MapPin className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
                          {venue.city}
                        </p>
                      </li>
                    </ul>

                    <p className="mt-5 text-sm text-espresso-muted leading-relaxed font-light max-w-sm">
                      {venue.description}
                    </p>
                  </div>

                  {/* Acção "Ver localização" */}
                  <div className="relative z-10 mt-8 pt-6 border-t border-beige flex flex-col items-center gap-2">
                    <a
                      href={venue.mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 text-xs uppercase tracking-[0.22em] border border-espresso text-espresso hover:bg-espresso hover:text-ivory transition-colors duration-300"
                    >
                      <span>Ver localização</span>
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                    <span className="text-[10px] tracking-[0.12em] text-espresso-soft">
                      {venue.subtitle}
                    </span>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-espresso-soft max-w-2xl mx-auto leading-relaxed">
          {WEDDING_DATA.copy.demonstrativeLocationsNote}
        </p>
      </div>
    </section>
  );
}
