import { describe, it, expect } from "vitest";
import { mdxComponents } from "../registry";

describe("mdxComponents registry", () => {
  it("exports required MDX overrides", () => {
    expect(typeof mdxComponents.h2).toBe("function");
    expect(typeof mdxComponents.h3).toBe("function");
    expect(typeof mdxComponents.pre).toBe("function");
    expect(typeof mdxComponents.code).toBe("function");
    expect(typeof mdxComponents.p).toBe("function");
    expect(typeof mdxComponents.img).toBe("function");
  });

  it("exports custom MDX components", () => {
    expect(mdxComponents.Callout).toBeDefined();
    expect(mdxComponents.SparkyText).toBeDefined();
    expect(mdxComponents.MoreInfo).toBeDefined();
    expect(mdxComponents.SwirlyUnderline).toBeDefined();
    expect(mdxComponents.HighlightText).toBeDefined();
  });
});
