/**
 * HTML written by the merchant in Fluid admin (product descriptions, blog
 * posts). It is rendered as-is, the same way Fluid's own themes render it,
 * so only feed it content from your own Fluid company.
 */
export function RichText({ html, className }: { html: string | null | undefined; className?: string }) {
  if (!html) return null;
  return <div className={`rich-text ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
