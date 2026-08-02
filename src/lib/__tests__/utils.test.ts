import { cn, formatDate, truncate, slugify } from "../utils";
import { describe, it, expect } from "vitest";

describe("utils", () => {
  describe("cn", () => {
    it("merges tailwind classes", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
      expect(cn("p-4 p-2")).toBe("p-2");
    });
  });

  describe("formatDate", () => {
    it("formats a date string", () => {
      expect(formatDate("2023-01-01T00:00:00Z")).toMatch(/Jan 1, 2023/);
    });

    it("formats a Date object", () => {
      expect(formatDate(new Date("2023-01-01T00:00:00Z"))).toMatch(/Jan 1, 2023/);
    });
  });

  describe("truncate", () => {
    it("truncates string longer than length", () => {
      expect(truncate("hello world", 5)).toBe("hello…");
    });

    it("does not truncate string shorter than length", () => {
      expect(truncate("hello", 10)).toBe("hello");
    });
  });

  describe("slugify", () => {
    it("slugifies a string", () => {
      expect(slugify("Hello World!")).toBe("hello-world");
      expect(slugify("This is a Test  -- ")).toBe("this-is-a-test-");
    });
  });
});
