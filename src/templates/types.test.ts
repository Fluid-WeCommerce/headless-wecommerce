import { describe, expect, it } from "vitest";

import { templateFor, type TemplateSet } from "./types";

const Default = () => null;
const Landing = () => null;
const templates: TemplateSet<object> = { default: Default, "beet-blend": Landing };

describe("templateFor", () => {
  it("uses the template registered under the record's slug", () => {
    expect(templateFor(templates, "beet-blend")).toBe(Landing);
  });

  it("falls back to default for other slugs and record-less pages", () => {
    expect(templateFor(templates, "kale-chips")).toBe(Default);
    expect(templateFor(templates, null)).toBe(Default);
    expect(templateFor(templates, undefined)).toBe(Default);
  });

  it("ignores inherited object keys", () => {
    expect(templateFor(templates, "constructor")).toBe(Default);
  });
});
