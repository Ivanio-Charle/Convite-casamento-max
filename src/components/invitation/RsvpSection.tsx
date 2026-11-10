"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send, Users } from "lucide-react";
import { BotanicalSprig, EditorialDivider } from "@/components/ornaments/BotanicalElements";
import { ScrollReveal } from "@/components/invitation/ScrollReveal";
import { rsvpFormSchema } from "@/lib/validations/rsvp";
import { WEDDING_DATA } from "@/lib/wedding-data";
import type { RsvpApiError, RsvpApiSuccess, RsvpRecordResponse } from "@/types/wedding";

interface RsvpSectionProps {
  isDatabaseConfigured: boolean;
}

export function RsvpSection({ isDatabaseConfigured }: RsvpSectionProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<boolean | null>(true);
  const [companionsCount, setCompanionsCount] = useState<number>(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<{
    code?: string;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RsvpRecordResponse | null>(
    null
  );

  // Chave determinística por sessão + dados principais para evitar duplicações em cliques duplos
  const sessionSeed = useMemo(
    () => Math.random().toString(36).slice(2, 10),
    []
  );

  const handleCompanionsCountChange = (nextCount: number) => {
    setCompanionsCount(nextCount);
    setCompanionNames((prev) => {
      const updated = [...prev];
      while (updated.length < nextCount) {
        updated.push("");
      }
      return updated;
    });
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy.companionsCount;
      delete copy.companionNames;
      return copy;
    });
  };

  const handleCompanionNameChange = (index: number, value: string) => {
    setCompanionNames((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[`companionNames.${index}`];
      delete copy.companionNames;
      return copy;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || submittedRecord) return;

    setServerError(null);
    setFieldErrors({});

    if (attending === null) {
      setFieldErrors({ attending: "Por favor, selecciona se vais comparecer." });
      return;
    }

    const rawPayload = {
      fullName,
      phone,
      attending,
      companionsCount: attending ? companionsCount : 0,
      companionNames: attending ? companionNames.slice(0, companionsCount) : [],
      message,
      website,
    };

    const validation = rsvpFormSchema.safeParse(rawPayload);
    if (!validation.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `${sessionSeed}-${validation.data.normalizedPhone}-${validation.data.attending ? "1" : "0"}-${validation.data.companionsCount}`.slice(
        0,
        64
      );

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(rawPayload),
      });

      const payload = (await response.json()) as RsvpApiSuccess | RsvpApiError;

      // NUNCA apresenta confirmação como guardada se a base de dados não confirmou gravação (HTTP 201 + success: true)
      if (!response.ok || !payload.success) {
        const errPayload = payload as RsvpApiError;
        setServerError({
          code: errPayload.code,
          message:
            errPayload.error ||
            "Não foi possível registar a tua confirmação neste momento.",
        });
        return;
      }

      setSubmittedRecord(payload.data);
    } catch {
      setServerError({
        message:
          "Ocorreu uma falha de comunicação ao enviar a tua resposta. Verifica a ligação à internet e tenta novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const guestFirstName = submittedRecord?.fullName.split(" ")[0] ?? "";

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-heading"
      className="bg-ivory py-20 sm:py-28 lg:py-32 px-6 border-b border-gold/25"
    >
      <div className="max-w-2xl mx-auto">
        <ScrollReveal className="text-center flex flex-col items-center mb-12 sm:mb-14">
          <BotanicalSprig className="w-24 h-8 text-gold mb-3" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-dark mb-2">
            R.S.V.P.
          </span>
          <h2
            id="rsvp-heading"
            className="font-serif text-4xl sm:text-5xl text-espresso font-normal"
          >
            {WEDDING_DATA.copy.rsvpTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-espresso-muted font-light max-w-lg leading-relaxed">
            {WEDDING_DATA.copy.rsvpSubtitle}
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={120}>
          <div className="relative bg-white border border-gold/40 p-6 sm:p-11 shadow-editorial">
            <div
              className="pointer-events-none absolute inset-2.5 border border-gold/20"
              aria-hidden="true"
            />

            {submittedRecord ? (
              /* Ecrã Personalizado de Confirmação Guardada com Sucesso */
              <div
                role="status"
                aria-live="polite"
                className="relative z-10 py-8 sm:py-10 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-ivory border border-gold flex items-center justify-center text-gold-dark mb-5">
                  <CheckCircle2 className="w-7 h-7" strokeWidth={1.4} />
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-espresso">
                  {WEDDING_DATA.copy.rsvpSuccessTitle}
                </h3>

                <p className="mt-4 text-base sm:text-lg text-espresso-muted leading-relaxed max-w-md">
                  {WEDDING_DATA.copy.rsvpSuccessMessage}
                </p>

                <EditorialDivider className="w-36 my-6" />

                <div className="bg-ivory/80 border border-beige px-6 py-4 text-xs sm:text-sm text-espresso space-y-1 max-w-md w-full">
                  <p className="font-medium">
                    Convidado(a): {submittedRecord.fullName}
                  </p>
                  <p className="text-espresso-muted">
                    Estado:{" "}
                    {submittedRecord.attending
                      ? submittedRecord.companionsCount > 0
                        ? `Presença confirmada (+${submittedRecord.companionsCount} ${
                            submittedRecord.companionsCount === 1
                              ? "acompanhante"
                              : "acompanhantes"
                          })`
                        : "Presença individual confirmada"
                      : "Ausência comunicada aos noivos"}
                  </p>
                </div>

                {guestFirstName && (
                  <p className="mt-6 font-serif italic text-xl text-espresso">
                    Com carinho, Daniel &amp; Sofia para {guestFirstName}.
                  </p>
                )}
              </div>
            ) : (
              /* Formulário de Confirmação de Presença */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="relative z-10 space-y-6"
              >
                {!isDatabaseConfigured && (
                  <div className="bg-ivory border border-gold/45 p-4 text-xs text-espresso-muted leading-relaxed">
                    <p className="font-medium text-espresso uppercase tracking-[0.14em] text-[11px] mb-1">
                      Ambiente Demonstrativo · Base de Dados por Configurar
                    </p>
                    <p>
                      A persistência PostgreSQL/Neon encontra-se pronta via Prisma ORM, aguardando a configuração de{" "}
                      <code className="text-espresso">DATABASE_URL</code> no ficheiro{" "}
                      <code className="text-espresso">.env</code>. Nenhuma confirmação será simulada enquanto a ligação não estiver activa.
                    </p>
                  </div>
                )}

                {serverError && (
                  <div
                    role="alert"
                    className="bg-[#FDF6F4] border border-[#C97A6A] p-4 flex items-start gap-3 text-left"
                  >
                    <AlertCircle className="w-5 h-5 text-[#A94A38] shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-[#6B2D21] leading-relaxed">
                      <p className="font-medium">
                        A tua confirmação ainda não foi guardada
                      </p>
                      <p className="mt-1">{serverError.message}</p>
                    </div>
                  </div>
                )}

                {/* Honeypot oculto para bots */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="rsvp-website">Website</label>
                  <input
                    id="rsvp-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {/* Nome Completo */}
                <div>
                  <label
                    htmlFor="rsvp-fullname"
                    className="block text-xs uppercase tracking-[0.2em] text-espresso font-medium mb-2"
                  >
                    Nome completo <span className="text-gold-dark">*</span>
                  </label>
                  <input
                    id="rsvp-fullname"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Ex.: Mateus Joaquim Mondlane"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) {
                        setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                      }
                    }}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    className={`w-full px-4 py-3.5 bg-ivory/65 border text-sm text-espresso placeholder:text-espresso-soft/60 focus:outline-none focus:bg-white transition-colors ${
                      fieldErrors.fullName
                        ? "border-[#C97A6A]"
                        : "border-beige-deep focus:border-gold"
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1.5 text-xs text-[#A94A38]" role="alert">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Telefone ou WhatsApp */}
                <div>
                  <label
                    htmlFor="rsvp-phone"
                    className="block text-xs uppercase tracking-[0.2em] text-espresso font-medium mb-2"
                  >
                    Número de telefone ou WhatsApp <span className="text-gold-dark">*</span>
                  </label>
                  <input
                    id="rsvp-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Ex.: +258 84 123 4567"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => ({ ...prev, phone: "" }));
                      }
                    }}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    className={`w-full px-4 py-3.5 bg-ivory/65 border text-sm text-espresso placeholder:text-espresso-soft/60 focus:outline-none focus:bg-white transition-colors ${
                      fieldErrors.phone
                        ? "border-[#C97A6A]"
                        : "border-beige-deep focus:border-gold"
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1.5 text-xs text-[#A94A38]" role="alert">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Vai comparecer? (Sim / Não) */}
                <fieldset>
                  <legend className="block text-xs uppercase tracking-[0.2em] text-espresso font-medium mb-2.5">
                    Vai comparecer? <span className="text-gold-dark">*</span>
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setAttending(true)}
                      aria-pressed={attending === true}
                      className={`py-3.5 px-4 border text-xs uppercase tracking-[0.18em] font-medium transition-all ${
                        attending === true
                          ? "bg-espresso text-ivory border-espresso shadow-sm"
                          : "bg-ivory/60 text-espresso border-beige-deep hover:border-gold"
                      }`}
                    >
                      Sim, estarei presente
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAttending(false);
                        setCompanionsCount(0);
                        setCompanionNames([]);
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.companionsCount;
                          delete next.companionNames;
                          Object.keys(next).forEach((k) => {
                            if (k.startsWith("companionNames.")) delete next[k];
                          });
                          return next;
                        });
                      }}
                      aria-pressed={attending === false}
                      className={`py-3.5 px-4 border text-xs uppercase tracking-[0.18em] font-medium transition-all ${
                        attending === false
                          ? "bg-espresso text-ivory border-espresso shadow-sm"
                          : "bg-ivory/60 text-espresso border-beige-deep hover:border-gold"
                      }`}
                    >
                      Não poderei comparecer
                    </button>
                  </div>
                  {fieldErrors.attending && (
                    <p className="mt-1.5 text-xs text-[#A94A38]" role="alert">
                      {fieldErrors.attending}
                    </p>
                  )}
                </fieldset>

                {/* Campos Condicionais de Acompanhantes (visíveis apenas quando "Sim") */}
                {attending === true && (
                  <div className="space-y-5 pt-2 pb-1 border-y border-beige">
                    <div>
                      <label
                        htmlFor="rsvp-companions-count"
                        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-espresso font-medium mb-2"
                      >
                        <Users className="w-3.5 h-3.5 text-gold-dark" />
                        <span>Número de acompanhantes</span>
                      </label>
                      <select
                        id="rsvp-companions-count"
                        name="companionsCount"
                        value={companionsCount}
                        onChange={(e) =>
                          handleCompanionsCountChange(Number(e.target.value))
                        }
                        className="w-full px-4 py-3.5 bg-ivory/65 border border-beige-deep focus:border-gold text-sm text-espresso focus:outline-none focus:bg-white transition-colors"
                      >
                        <option value={0}>0 — Irei sem acompanhantes</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "acompanhante" : "acompanhantes"}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.companionsCount && (
                        <p className="mt-1.5 text-xs text-[#A94A38]" role="alert">
                          {fieldErrors.companionsCount}
                        </p>
                      )}
                    </div>

                    {companionsCount > 0 && (
                      <div className="space-y-3 pb-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-espresso font-medium">
                          Nome dos acompanhantes <span className="text-gold-dark">*</span>
                        </p>
                        {Array.from({ length: companionsCount }).map((_, idx) => {
                          const specificErr = fieldErrors[`companionNames.${idx}`];
                          return (
                            <div key={idx}>
                              <label
                                htmlFor={`companion-name-${idx}`}
                                className="sr-only"
                              >
                                Nome completo do acompanhante {idx + 1}
                              </label>
                              <input
                                id={`companion-name-${idx}`}
                                type="text"
                                required
                                placeholder={`Nome completo do acompanhante ${idx + 1}`}
                                value={companionNames[idx] ?? ""}
                                onChange={(e) =>
                                  handleCompanionNameChange(idx, e.target.value)
                                }
                                aria-invalid={Boolean(specificErr)}
                                className={`w-full px-4 py-3 bg-ivory/65 border text-sm text-espresso placeholder:text-espresso-soft/60 focus:outline-none focus:bg-white transition-colors ${
                                  specificErr
                                    ? "border-[#C97A6A]"
                                    : "border-beige-deep focus:border-gold"
                                }`}
                              />
                              {specificErr && (
                                <p
                                  className="mt-1 text-xs text-[#A94A38]"
                                  role="alert"
                                >
                                  {specificErr}
                                </p>
                              )}
                            </div>
                          );
                        })}
                        {fieldErrors.companionNames && (
                          <p className="text-xs text-[#A94A38]" role="alert">
                            {fieldErrors.companionNames}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Mensagem Opcional aos Noivos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="rsvp-message"
                      className="text-xs uppercase tracking-[0.2em] text-espresso font-medium"
                    >
                      Mensagem aos noivos{" "}
                      <span className="text-espresso-soft font-normal lowercase tracking-normal">
                        (opcional)
                      </span>
                    </label>
                    <span className="text-[11px] text-espresso-soft tabular-nums">
                      {message.length}/1000
                    </span>
                  </div>
                  <textarea
                    id="rsvp-message"
                    name="message"
                    rows={4}
                    maxLength={1000}
                    placeholder="Deixa votos de felicidades ou uma nota especial para Daniel e Sofia..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3.5 bg-ivory/65 border border-beige-deep focus:border-gold text-sm text-espresso placeholder:text-espresso-soft/60 focus:outline-none focus:bg-white transition-colors resize-y"
                  />
                  {fieldErrors.message && (
                    <p className="mt-1.5 text-xs text-[#A94A38]" role="alert">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Botão de Submissão com Bloqueio contra Duplicados */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 bg-espresso text-ivory text-xs sm:text-[13px] uppercase tracking-[0.24em] font-medium hover:bg-gold-dark transition-colors duration-300 flex items-center justify-center gap-2.5 disabled:opacity-65 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>A registar resposta...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Confirmação</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
