import { z } from "zod";

/**
 * Normaliza números de telefone de Moçambique (+258) e internacionais
 * para impedir submissões duplicadas acidentais com formatações distintas.
 */
export function normalizePhoneNumber(raw: string): string {
  const cleaned = raw.trim().replace(/[^\d+]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");

  // Números móveis de Moçambique com 9 dígitos iniciados por 82..87 (Tmcel, Vodacom, Movitel)
  if (digitsOnly.length === 9 && /^8[2-7]\d{7}$/.test(digitsOnly)) {
    return `+258${digitsOnly}`;
  }

  // Números com prefixo 00258...
  if (digitsOnly.startsWith("00258") && digitsOnly.length === 14) {
    return `+${digitsOnly.slice(2)}`;
  }

  // Números com 258 sem '+'
  if (digitsOnly.startsWith("258") && digitsOnly.length === 12) {
    return `+${digitsOnly}`;
  }

  if (cleaned.startsWith("+")) {
    return `+${digitsOnly}`;
  }

  return digitsOnly;
}

export const rsvpFormSchema = z
  .object({
    fullName: z
      .string({ required_error: "Por favor, indica o teu nome completo." })
      .trim()
      .min(3, "O nome completo deve ter pelo menos 3 caracteres.")
      .max(120, "O nome completo não pode exceder 120 caracteres."),
    phone: z
      .string({ required_error: "Por favor, indica o teu número de telefone ou WhatsApp." })
      .trim()
      .refine((val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 16;
      }, "Introduz um número de telefone ou WhatsApp válido (ex.: +258 84 123 4567)."),
    attending: z.boolean({
      required_error: "Por favor, indica se vais poder comparecer.",
      invalid_type_error: "Selecciona uma opção válida.",
    }),
    companionsCount: z
      .number({ invalid_type_error: "Indica um número válido de acompanhantes." })
      .int("O número de acompanhantes deve ser um número inteiro.")
      .min(0, "O número de acompanhantes não pode ser negativo.")
      .max(10, "Para grupos superiores a 10 acompanhantes, contacta directamente os noivos.")
      .default(0),
    companionNames: z
      .array(
        z
          .string()
          .trim()
          .max(120, "O nome do acompanhante não pode exceder 120 caracteres.")
      )
      .max(10)
      .default([]),
    message: z
      .string()
      .trim()
      .max(1000, "A mensagem não pode exceder 1000 caracteres.")
      .optional()
      .or(z.literal("")),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (!data.attending) {
      return;
    }

    if (data.companionsCount > 0) {
      if (data.companionNames.length < data.companionsCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companionNames"],
          message: "Por favor, indica o nome de todos os acompanhantes.",
        });
        return;
      }

      for (let i = 0; i < data.companionsCount; i++) {
        const name = (data.companionNames[i] ?? "").trim();
        if (name.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["companionNames", i],
            message: `Indica o nome do acompanhante ${i + 1} (mínimo 2 caracteres).`,
          });
        }
      }
    }
  })
  .transform((data) => {
    const attending = data.attending;
    const companionsCount = attending ? data.companionsCount : 0;
    const companionNames = attending
      ? data.companionNames
          .slice(0, companionsCount)
          .map((n) => n.trim())
          .filter(Boolean)
      : [];

    return {
      fullName: data.fullName.replace(/\s+/g, " ").trim(),
      phone: data.phone.trim(),
      normalizedPhone: normalizePhoneNumber(data.phone),
      attending,
      companionsCount,
      companionNames,
      message: data.message && data.message.trim().length > 0 ? data.message.trim() : null,
      website: data.website ?? "",
    };
  });

export type ValidatedRsvpInput = z.output<typeof rsvpFormSchema>;
