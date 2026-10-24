"use client";

import { useId } from "react";

import { whenSdkReady } from "@/lib/fairshare/sdk";
import type { Locale } from "@/lib/fluid/locale";

/**
 * Language and country pickers. Switching updates the SDK's cart (so prices
 * and currency follow) and reloads the page with `?lang=` / `?country=`,
 * which the proxy turns into the `fluid_locale` cookie.
 */
export function LocaleSwitcher({
  locale,
  languages,
  countries,
}: {
  locale: Locale;
  languages: string[];
  countries: string[];
}) {
  const id = useId();
  if (languages.length < 2 && countries.length < 2) return null;

  const languageNames = displayNames(locale.language, "language");
  const regionNames = displayNames(locale.language, "region");

  async function change(next: Locale) {
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

  const selectClass = "rounded-md border border-border bg-background px-2 py-1 text-sm";

  return (
    <div className="flex items-center gap-2">
      {languages.length > 1 ? (
        <>
          <label htmlFor={`${id}-language`} className="sr-only">
            Language
          </label>
          <select
            id={`${id}-language`}
            className={selectClass}
            value={locale.language}
            onChange={(event) => void change({ ...locale, language: event.target.value })}
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {languageNames?.of(language) ?? language}
              </option>
            ))}
          </select>
        </>
      ) : null}
      {countries.length > 1 ? (
        <>
          <label htmlFor={`${id}-country`} className="sr-only">
            Country
          </label>
          <select
            id={`${id}-country`}
            className={selectClass}
            value={locale.country}
            onChange={(event) => void change({ ...locale, country: event.target.value })}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {regionNames?.of(country) ?? country}
              </option>
            ))}
          </select>
        </>
      ) : null}
    </div>
  );
}

function displayNames(language: string, type: "language" | "region") {
  try {
    return new Intl.DisplayNames([language], { type });
  } catch {
    return undefined;
  }
}
