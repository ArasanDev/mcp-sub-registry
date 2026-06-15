import { describe, expect, it } from "vitest";
import {
  sourceInputSchema,
  sourceUpdateSchema
} from "../apps/api/src/services/source-admin";

describe("source admin validation", () => {
  it("applies defaults for source creation", () => {
    expect(
      sourceInputSchema.parse({
        name: "partner",
        baseUrl: "https://registry.partner.example"
      })
    ).toMatchObject({
      name: "partner",
      type: "subregistry",
      baseUrl: "https://registry.partner.example",
      enabled: true
    });
  });

  it("does not apply creation defaults for source updates", () => {
    expect(
      sourceUpdateSchema.parse({
        baseUrl: "https://registry.partner.example"
      })
    ).toEqual({
      baseUrl: "https://registry.partner.example"
    });
  });
});
