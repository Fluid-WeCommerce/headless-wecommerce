"use client";

import { useEffect, useId, useRef, useState } from "react";

import { whenSdkReady } from "@/lib/fairshare/sdk";
import type { Locale } from "@/lib/fluid/locale";

import { Button } from "./Button";
import { ChevronDownIcon } from "./icons";

interface LocaleOptions {
  locale: Locale;
  languages: string[];
  countries: string[];
}

/**
 * The header's country and language picker, after the base theme's: the
 * current flag, country and language, opening a panel to change both.
 */
export function LocaleSwitcher({ locale, languages, countries, className }: LocaleOptions & { className?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (languages.length < 2 && countries.length < 2) return null;

  return (
    <div ref={root} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-sm px-2 text-sm font-medium hover:bg-surface"
      >
        <LocaleLabel locale={locale} />
        <ChevronDownIcon width={16} height={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Country and language"
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-sm border border-border bg-background p-5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)]"
        >
          <LocaleForm locale={locale} languages={languages} countries={countries} />
        </div>
      ) : null}
    </div>
  );
}

/** `🇺🇸 US | EN`: the visitor's country and language. */
export function LocaleLabel({ locale }: { locale: Locale }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className="text-base leading-none">
        {flag(locale.country)}
      </span>
      <span>{locale.country}</span>
      <span aria-hidden className="h-4 w-px bg-border" />
      <span>{locale.language.split("-")[0]?.toUpperCase()}</span>
    </span>
  );
}

/**
 * Country and language selects with a save button. Saving updates the SDK's
 * cart (so prices and currency follow) and reloads the page with `?lang=`
 * and `?country=`, which the proxy turns into the `fluid_locale` cookie.
 */
export function LocaleForm({ locale, languages, countries }: LocaleOptions) {
  const id = useId();
  const [country, setCountry] = useState(locale.country);
  const [language, setLanguage] = useState(locale.language);
  const [saving, setSaving] = useState(false);
  const languageNames = displayNames(locale.language, "language");
  const regionNames = displayNames(locale.language, "region");

  async function save() {
    setSaving(true);
    const next = { language, country };
    // Keep the cart in step; don't hold up the switch if the SDK is slow.
    await Promise.race([
      whenSdkReady().then((sdk) => sdk.updateLocaleSettings(next)),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]).catch(() => undefined);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", next.language);
    url.searchParams.set("country", next.country);
    url.searchParams.delete("cursor");
    window.location.assign(url);
  }

  const selectClass = "h-12 w-full rounded-sm border border-border bg-background px-3.5 text-[15px]";

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      {countries.length > 1 ? (
        <div className="space-y-1.5">
          <label htmlFor={`${id}-country`} className="text-sm font-medium">
            Country
          </label>
          <select id={`${id}-country`} className={selectClass} value={country} onChange={(event) => setCountry(event.target.value)}>
            {countries.map((code) => (
              <option key={code} value={code}>
                {flag(code)} {regionNames?.of(code) ?? code}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {languages.length > 1 ? (
        <div className="space-y-1.5">
          <label htmlFor={`${id}-language`} className="text-sm font-medium">
            Language
          </label>
          <select id={`${id}-language`} className={selectClass} value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languages.map((code) => (
              <option key={code} value={code}>
                {capitalize(languageNames?.of(code) ?? code)}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}

/** The flag emoji for an ISO-2 country code. */
function flag(country: string): string {
  if (!/^[A-Z]{2}$/.test(country)) return "";
  return String.fromCodePoint(...[...country].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));
}

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

function displayNames(language: string, type: "language" | "region") {
  try {
    return new Intl.DisplayNames([language], { type });
  } catch {
    return undefined;
  }
}
