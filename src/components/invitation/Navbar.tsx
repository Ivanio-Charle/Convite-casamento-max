"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { WEDDING_DATA } from "@/lib/wedding-data";

const NAV_LINKS = [
  { href: "#historia", label: "A Nossa História" },
  { href: "#grande-dia", label: "O Grande Dia" },
  { href: "#como-chegar", label: "Como Chegar" },
  { href: "#momentos", label: "Momentos" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 260);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-30 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/95 backdrop-blur-md border-b border-gold/25 py-3 shadow-sm translate-y-0 opacity-100"
          : "bg-transparent py-5 -translate-y-2 opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <a
          href="#inicio"
          className="font-serif text-xl sm:text-2xl tracking-[0.18em] text-espresso hover:text-gold-dark transition-colors"
          aria-label="Voltar ao topo do convite"
        >
          {WEDDING_DATA.couple.monogram}
        </a>

        {/* Navegação Desktop */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Secções do convite"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.2em] text-espresso-muted hover:text-espresso transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#rsvp"
            className="px-5 py-2 text-[11px] uppercase tracking-[0.2em] border border-gold text-espresso hover:bg-espresso hover:text-ivory hover:border-espresso transition-all duration-300"
          >
            Confirmar Presença
          </a>
        </nav>

        {/* Botão Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <a
            href="#rsvp"
            className="px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] border border-gold text-espresso bg-ivory/80"
          >
            RSVP
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu de secções"}
            className="p-2 text-espresso hover:text-gold-dark focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu móvel"
          className="md:hidden bg-ivory border-b border-gold/25 px-6 pt-3 pb-6 flex flex-col gap-4 shadow-editorial"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-xs uppercase tracking-[0.2em] text-espresso border-b border-beige/70"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#rsvp"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-1 py-3 text-center text-xs uppercase tracking-[0.22em] bg-espresso text-ivory"
          >
            Confirmar Presença
          </a>
        </nav>
      )}
    </header>
  );
}
