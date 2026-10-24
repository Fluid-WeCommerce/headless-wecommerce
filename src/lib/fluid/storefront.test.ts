import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { normalizeRecord } = await import("./storefront");

describe("normalizeRecord", () => {
  it("flattens rich-text descriptions to their HTML body", () => {
    expect(normalizeRecord({ id: 1, description: { id: 9, name: "description", body: "<p>Hi</p>" } })).toEqual({
      id: 1,
      description: "<p>Hi</p>",
    });
  });

  it("leaves string and missing descriptions alone", () => {
    expect(normalizeRecord({ id: 1, description: "Plain" })).toEqual({ id: 1, description: "Plain" });
    expect(normalizeRecord({ id: 1, description: null })).toEqual({ id: 1, description: null });
  });
});
