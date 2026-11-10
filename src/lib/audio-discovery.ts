import fs from "node:fs";
import path from "node:path";

const SUPPORTED_AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".m4a",
  ".ogg",
  ".wav",
  ".aac",
  ".webm",
]);

/**
 * Detecta automaticamente o ficheiro de música disponibilizado na pasta do projecto:
 * 1. Variável de ambiente NEXT_PUBLIC_AUDIO_URL, caso definida (recomendado em Cloudflare Workers).
 * 2. Qualquer ficheiro de áudio válido colocado em public/audio/ (servido dinamicamente com suporte HTTP Range).
 *
 * Não substitui por músicas aleatórias caso não exista ficheiro de áudio.
 */
export function discoverBackgroundAudio(): string | null {
  const configuredUrl = process.env.NEXT_PUBLIC_AUDIO_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  try {
    const audioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(audioDir)) {
      return null;
    }

    const files = fs
      .readdirSync(audioDir)
      .filter((fileName) => {
        const ext = path.extname(fileName).toLowerCase();
        return SUPPORTED_AUDIO_EXTENSIONS.has(ext);
      })
      .sort((a, b) => a.localeCompare(b));

    if (files.length === 0) {
      return null;
    }

    return `/api/audio?file=${encodeURIComponent(files[0])}`;
  } catch {
    // Em ambientes edge sem acesso directo ao sistema de ficheiros local,
    // utilize NEXT_PUBLIC_AUDIO_URL (ex.: "/audio/musica.mp3").
    return null;
  }
}
