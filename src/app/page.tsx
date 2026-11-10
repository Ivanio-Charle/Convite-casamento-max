import React from "react";
import { WeddingExperience } from "@/components/invitation/WeddingExperience";
import { discoverBackgroundAudio } from "@/lib/audio-discovery";
import { isDatabaseConfigured } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const audioSrc = discoverBackgroundAudio();
  const databaseConfigured = isDatabaseConfigured();

  return (
    <WeddingExperience
      audioSrc={audioSrc}
      isDatabaseConfigured={databaseConfigured}
    />
  );
}
