import { languageTag, type Locale } from "@/lib/fluid/locale";

/** A date in the visitor's language: "October 23, 2026". */
export function formatDate(value: string | null | undefined, locale: Locale): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(languageTag(locale), { dateStyle: "long" }).format(date);
}
