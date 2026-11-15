import type { Locale, WhatsAppSettings } from "@/types/content";

export type WhatsAppIntent =
  | "home"
  | "membership"
  | "personalTraining"
  | "program"
  | "transformation"
  | "faq";

export interface WhatsAppOptions {
  intent?: WhatsAppIntent;
  message?: string;
  plan?: string;
  program?: string;
}

/**
 * Builds a wa.me deep link from centrally managed settings.
 * Returns `null` when no valid destination number has been configured yet so
 * the UI can show a friendly notice instead of opening an invalid URL.
 */
export function buildWhatsAppLink(
  settings: WhatsAppSettings | undefined,
  locale: Locale,
  options: WhatsAppOptions = {},
): string | null {
  if (!settings) return null;
  const digits = (settings.number || "").replace(/[^0-9]/g, "");
  if (digits.length < 8) return null;

  let text = options.message?.trim() ?? "";
  if (!text) {
    const intent = options.intent ?? "home";
    const template = settings.messages?.[intent];
    text = template ? template[locale] || template.en : settings.defaultMessage?.en ?? "";
  }
  if (options.plan) text = `${text}\n\nPlan: ${options.plan}`;
  if (options.program) text = `${text}\n\nProgram: ${options.program}`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}
