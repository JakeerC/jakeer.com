/**
 * Validated environment variable accessors.
 * Prevents non-null assertions and guarantees safe diagnostics without exposing secrets.
 */

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env.local or deployment environment.`
    );
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

/**
 * Accessor for NEXT_PUBLIC_SUPABASE_URL.
 * Direct property access ensures static replacement by Next.js bundler in browser bundles.
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. Check .env.local or deployment environment."
    );
  }
  return url;
}

/**
 * Accessor for NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 * Direct property access ensures static replacement by Next.js bundler in browser bundles.
 */
export function getSupabasePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Check .env.local or deployment environment."
    );
  }
  return key;
}

/**
 * Server-only accessor for GITHUB_TOKEN.
 * Lazily evaluated so missing token never breaks public routes or client bundles.
 */
export function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is not set. GitHub-backed admin actions are unavailable. Set this in .env.local for local development."
    );
  }
  return token;
}
