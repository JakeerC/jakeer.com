import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  requireEnv,
  optionalEnv,
  getSupabaseUrl,
  getSupabasePublishableKey,
  getGitHubToken,
} from "../env";

describe("env validation module", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("requireEnv", () => {
    it("returns variable value when set", () => {
      process.env.TEST_VAR = "hello-world";
      expect(requireEnv("TEST_VAR")).toBe("hello-world");
    });

    it("throws descriptive error when variable is unset", () => {
      delete process.env.TEST_VAR;
      expect(() => requireEnv("TEST_VAR")).toThrowError(
        "Missing required environment variable: TEST_VAR. Check .env.local or deployment environment."
      );
    });

    it("does not leak secret values in error messages", () => {
      delete process.env.SUPER_SECRET_KEY;
      try {
        requireEnv("SUPER_SECRET_KEY");
      } catch (e) {
        expect((e as Error).message).not.toContain("secret-token");
        expect((e as Error).message).toContain("SUPER_SECRET_KEY");
      }
    });
  });

  describe("optionalEnv", () => {
    it("returns value when variable is set", () => {
      process.env.OPT_VAR = "configured";
      expect(optionalEnv("OPT_VAR")).toBe("configured");
    });

    it("returns undefined when variable is unset", () => {
      delete process.env.OPT_VAR;
      expect(optionalEnv("OPT_VAR")).toBeUndefined();
    });
  });

  describe("Supabase accessors", () => {
    it("getSupabaseUrl returns url when set", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      expect(getSupabaseUrl()).toBe("https://example.supabase.co");
    });

    it("getSupabaseUrl throws when unset", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      expect(() => getSupabaseUrl()).toThrowError(
        "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. Check .env.local or deployment environment."
      );
    });

    it("getSupabasePublishableKey returns key when set", () => {
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk-test-key";
      expect(getSupabasePublishableKey()).toBe("pk-test-key");
    });

    it("getSupabasePublishableKey throws when unset", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      expect(() => getSupabasePublishableKey()).toThrowError(
        "Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Check .env.local or deployment environment."
      );
    });
  });

  describe("getGitHubToken", () => {
    it("returns token when set", () => {
      process.env.GITHUB_TOKEN = "ghp_validtoken";
      expect(getGitHubToken()).toBe("ghp_validtoken");
    });

    it("throws descriptive error when unset without exposing token values", () => {
      delete process.env.GITHUB_TOKEN;
      expect(() => getGitHubToken()).toThrowError(
        "GITHUB_TOKEN is not set. GitHub-backed admin actions are unavailable. Set this in .env.local for local development."
      );
    });
  });
});
