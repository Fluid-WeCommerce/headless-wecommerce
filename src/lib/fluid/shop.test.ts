import { describe, expect, it } from "vitest";

import { hexColor } from "./shop";

describe("hexColor", () => {
  it("accepts Fluid's bare hex and CSS hex", () => {
    expect(hexColor("3A327F")).toBe("#3a327f");
    expect(hexColor("#fff")).toBe("#fff");
  });

  it("rejects anything that is not a hex color", () => {
    expect(hexColor("red; background: url(x)")).toBeNull();
    expect(hexColor(null)).toBeNull();
  });
});
