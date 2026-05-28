export const CURSOR_API_KEY_ENV = "CURSOR_API_KEY";

export function hasCursorApiKey(): boolean {
  return Boolean(process.env[CURSOR_API_KEY_ENV]?.trim());
}
