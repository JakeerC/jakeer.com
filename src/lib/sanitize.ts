/**
 * Safely escapes string values for insertion into YAML frontmatter.
 * Handles quotes, special characters, newlines, and backslashes to prevent frontmatter injection.
 */
export function escapeYamlString(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }

  const stringVal = String(value);
  // Escape backslashes, double quotes, and control chars
  const escaped = stringVal
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, "\\n");

  return `"${escaped}"`;
}
