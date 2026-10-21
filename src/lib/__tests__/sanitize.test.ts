import { describe, it, expect } from "vitest";
import { escapeYamlString } from "../sanitize";

describe("escapeYamlString", () => {
  it("wraps normal strings in quotes", () => {
    expect(escapeYamlString("Hello World")).toBe('"Hello World"');
  });

  it("handles empty or nullish values", () => {
    expect(escapeYamlString("")).toBe('""');
    expect(escapeYamlString(null)).toBe('""');
    expect(escapeYamlString(undefined)).toBe('""');
  });

  it("escapes embedded double quotes to prevent frontmatter injection", () => {
    const malicious = 'Test "breaking: frontmatter" title';
    expect(escapeYamlString(malicious)).toBe('"Test \\"breaking: frontmatter\\" title"');
  });

  it("escapes backslashes properly", () => {
    const withBackslash = "Path\\to\\something";
    expect(escapeYamlString(withBackslash)).toBe('"Path\\\\to\\\\something"');
  });

  it("escapes newline characters so YAML parser does not break", () => {
    const multiline = "Line 1\nLine 2";
    expect(escapeYamlString(multiline)).toBe('"Line 1\\nLine 2"');
  });
});
