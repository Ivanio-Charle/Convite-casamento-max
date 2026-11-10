import { NextResponse } from "next/server";
import { discoverBackgroundAudio } from "@/lib/audio-discovery";
import { isDatabaseConfigured } from "@/lib/prisma";

export async function GET() {
  const databaseConfigured = isDatabaseConfigured();
  const adminTokenConfigured = Boolean(process.env.RSVP_ADMIN_TOKEN?.trim());
  const backgroundAudioUrl = discoverBackgroundAudio();

  return NextResponse.json(
    {
      status: "ok",
      project: "Charle Convites — Daniel & Sofia",
      services: {
        databaseConfigured,
        adminTokenConfigured,
        backgroundAudioAvailable: Boolean(backgroundAudioUrl),
      },
    },
    { status: 200 }
  );
}
