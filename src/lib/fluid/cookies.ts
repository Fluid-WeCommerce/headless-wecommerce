/**
 * The `domain` the locale cookies are written with. The proxy (server) and
 * the Fairshare SDK (browser) must agree, or the browser keeps two copies
 * of `fluid_locale` and sends whichever it likes. Both scope cookies to the
 * exact host, which also works on hosts under public suffixes such as
 * `*.vercel.app`, where the SDK's default apex-domain guess is rejected.
 */
export function cookieDomainFor(hostname: string): string | undefined {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || /^[\d.]+$/.test(host) || host.includes(":")) {
    return undefined;
  }
  return host;
}
