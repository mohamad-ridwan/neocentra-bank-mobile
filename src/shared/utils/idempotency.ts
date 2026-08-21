/**
 * Generates a RFC4122 compliant UUID v4 string for Idempotency Keys.
 * Used in header `X-Idempotency-Key` to prevent double submissions.
 */
export function generateIdempotencyKey(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
