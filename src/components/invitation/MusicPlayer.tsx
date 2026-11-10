"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Music, Pause, Play, SlidersHorizontal, Volume2, VolumeX, X } from "lucide-react";

interface MusicPlayerProps {
  audioSrc: string | null;
}

export function MusicPlayer({ audioSrc }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const hasValidAudio = Boolean(audioSrc) && !audioError;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = useCallback(async () => {
    if (!hasValidAudio || !audioRef.current) {
      setPanelOpen((prev) => !prev);
      return;
    }

    const audio = audioRef.current;
    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
      setPanelOpen(true);
    }
  }, [hasValidAudio]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(e.target.value);
    setVolume(nextVolume);
    if (nextVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setAudioError(true);
            setIsPlaying(false);
          }}
        />
      )}

      {/* Painel de Controlo de Volume / Estado do Áudio */}
      {panelOpen && (
        <div
          role="region"
          aria-label="Controlo de música de fundo"
          className="w-64 sm:w-72 bg-ivory border border-gold/50 shadow-editorial p-4 text-espresso"
        >
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-beige">
            <div className="flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-gold-dark" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
                Música Ambiente
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Fechar painel de música"
              className="p-1 text-espresso-soft hover:text-espresso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {hasValidAudio ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-espresso-muted">
                  {isPlaying ? "Em reprodução" : "Em pausa"}
                </span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] bg-espresso text-ivory hover:bg-gold-dark transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Ouvir</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label={isMuted || volume === 0 ? "Activar som" : "Silenciar som"}
                  className="p-1 text-espresso hover:text-gold-dark"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Controlo de volume da música"
                  className="w-full h-1.5 bg-beige-deep rounded-lg appearance-none cursor-pointer accent-espresso"
                />
                <span className="text-[10px] tabular-nums text-espresso-soft w-8 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-espresso-muted leading-relaxed space-y-1.5">
              <p className="font-medium text-espresso">
                Ficheiro de música aguarda adição
              </p>
              <p>
                Coloque o ficheiro de áudio oficial do casal na pasta{" "}
                <code className="px-1 py-0.5 bg-beige/70 text-[11px] text-espresso">
                  public/audio/
                </code>{" "}
                (ex.: <code className="text-[11px]">musica.mp3</code>) para activar a reprodução.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Botão Flutuante Discreto */}
      <div className="inline-flex items-center bg-ivory/95 backdrop-blur-md border border-gold/50 rounded-full shadow-editorial overflow-hidden">
        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={isPlaying}
          aria-label={
            hasValidAudio
              ? isPlaying
                ? "Pausar música de fundo"
                : "Reproduzir música de fundo"
              : "Informação sobre música de fundo"
          }
          className="inline-flex items-center gap-2.5 pl-4 pr-3.5 h-11 text-espresso hover:text-gold-dark transition-colors focus:outline-none"
        >
          {isPlaying ? (
            /* Indicador visual animado quando a música está activa */
            <span className="flex items-end gap-[2.5px] h-3.5 w-4 justify-center" aria-hidden="true">
              <span className="w-[2.5px] h-full bg-gold-dark origin-bottom animate-sound-bar-1" />
              <span className="w-[2.5px] h-full bg-espresso origin-bottom animate-sound-bar-2" />
              <span className="w-[2.5px] h-full bg-gold-dark origin-bottom animate-sound-bar-3" />
            </span>
          ) : (
            <Music className="w-4 h-4 text-gold-dark" strokeWidth={1.6} />
          )}
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium">
            {isPlaying ? "A tocar" : "Música"}
          </span>
        </button>

        <span className="h-5 w-[1px] bg-gold/30" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setPanelOpen((prev) => !prev)}
          aria-expanded={panelOpen}
          aria-label="Abrir controlo de volume e opções de áudio"
          className="px-3 h-11 text-espresso-muted hover:text-espresso transition-colors focus:outline-none"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}
