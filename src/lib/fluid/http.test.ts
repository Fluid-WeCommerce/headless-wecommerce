import { describe, expect, it } from "vitest";

import { withQuery } from "./http";

describe("withQuery", () => {
  it("serializes arrays the way Rails reads them and skips empty values", () => {
    expect(
      withQuery("https://acme.fluid.app/api/v202604/products", {
        lang: "es",
        q: "",
        cursor: undefined,
        "filter[category_ids]": [1, 2],
      }),
    ).toBe("https://acme.fluid.app/api/v202604/products?lang=es&filter%5Bcategory_ids%5D%5B%5D=1&filter%5Bcategory_ids%5D%5B%5D=2");
  });
});
