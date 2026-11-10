"use client";

import React, { useState } from "react";
import { CountdownSection } from "@/components/invitation/CountdownSection";
import { EnvelopeIntro } from "@/components/invitation/EnvelopeIntro";
import { EventDetailsSection } from "@/components/invitation/EventDetailsSection";
import { FooterSection } from "@/components/invitation/FooterSection";
import { GallerySection } from "@/components/invitation/GallerySection";
import { HeroSection } from "@/components/invitation/HeroSection";
import { LocationSection } from "@/components/invitation/LocationSection";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { Navbar } from "@/components/invitation/Navbar";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { StorySection } from "@/components/invitation/StorySection";

interface WeddingExperienceProps {
  audioSrc: string | null;
  isDatabaseConfigured: boolean;
}

export function WeddingExperience({
  audioSrc,
  isDatabaseConfigured,
}: WeddingExperienceProps) {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  return (
    <>
      {!envelopeOpened && (
        <EnvelopeIntro onOpened={() => setEnvelopeOpened(true)} />
      )}

      <div
        aria-hidden={!envelopeOpened}
        className={`min-h-screen flex flex-col ${
          envelopeOpened ? "" : "pointer-events-none select-none"
        }`}
      >
        <Navbar />

        <main className="flex-1">
          <HeroSection />
          <StorySection />
          <CountdownSection />
          <EventDetailsSection />
          <LocationSection />
          <GallerySection />
          <RsvpSection isDatabaseConfigured={isDatabaseConfigured} />
        </main>

        <FooterSection />
      </div>

      {/* O leitor de música permanece montado durante toda a navegação pelo convite */}
      {envelopeOpened && <MusicPlayer audioSrc={audioSrc} />}
    </>
  );
}
