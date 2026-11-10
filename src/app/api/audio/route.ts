import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const MIME_BY_EXT: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".aac": "audio/aac",
  ".webm": "audio/webm",
};

export async function GET(request: NextRequest) {
  try {
    const audioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(audioDir)) {
      return new NextResponse("Ficheiro de áudio não encontrado.", { status: 404 });
    }

    const files = fs
      .readdirSync(audioDir)
      .filter((name) => Boolean(MIME_BY_EXT[path.extname(name).toLowerCase()]))
      .sort((a, b) => a.localeCompare(b));

    if (files.length === 0) {
      return new NextResponse("Nenhum ficheiro de áudio disponível.", { status: 404 });
    }

    const requested = request.nextUrl.searchParams.get("file");
    const chosenFile =
      requested && files.includes(path.basename(requested))
        ? path.basename(requested)
        : files[0];

    const filePath = path.join(audioDir, chosenFile);
    const stat = fs.statSync(filePath);
    const totalSize = stat.size;
    const contentType =
      MIME_BY_EXT[path.extname(chosenFile).toLowerCase()] ?? "application/octet-stream";

    const range = request.headers.get("range");
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (match) {
        const start = match[1] ? parseInt(match[1], 10) : 0;
        const end = match[2] ? Math.min(parseInt(match[2], 10), totalSize - 1) : totalSize - 1;

        if (start >= 0 && start <= end && end < totalSize) {
          const chunkLength = end - start + 1;
          const buffer = Buffer.alloc(chunkLength);
          const fd = fs.openSync(filePath, "r");
          try {
            fs.readSync(fd, buffer, 0, chunkLength, start);
          } finally {
            fs.closeSync(fd);
          }

          return new NextResponse(buffer, {
            status: 206,
            headers: {
              "Content-Type": contentType,
              "Content-Length": String(chunkLength),
              "Content-Range": `bytes ${start}-${end}/${totalSize}`,
              "Accept-Ranges": "bytes",
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      }
    }

    const fullBuffer = fs.readFileSync(filePath);
    return new NextResponse(fullBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(totalSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Erro ao carregar ficheiro de áudio.", { status: 500 });
  }
}
