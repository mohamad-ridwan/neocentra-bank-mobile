/**
 * Formatting and normalization utilities for Neocentra Bank Mobile.
 */

/**
 * Format NIK into 4-digit groups (e.g., "3201 1234 5678 0001")
 */
export function formatNIK(nik: string): string {
  const clean = nik.replace(/\D/g, "").slice(0, 16);
  return clean.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * Mask NIK for sensitive display (e.g., "3201 •••• •••• 0001")
 */
export function maskNIK(nik: string): string {
  const clean = nik.replace(/\D/g, "");
  if (clean.length < 8) return clean;
  const first4 = clean.slice(0, 4);
  const last4 = clean.slice(-4);
  return `${first4} •••• •••• ${last4}`;
}

/**
 * Normalizes Indonesian phone numbers into E.164 standard (+628xxxx)
 */
export function normalizePhoneNumber(phone: string): string {
  let clean = phone.replace(/[\s-]/g, "");
  if (clean.startsWith("0")) {
    clean = "+62" + clean.slice(1);
  } else if (clean.startsWith("62")) {
    clean = "+" + clean;
  } else if (!clean.startsWith("+")) {
    clean = "+62" + clean;
  }
  return clean;
}

/**
 * Formats phone number for display (e.g. "+62 812-3456-7890")
 */
export function formatPhoneDisplay(phone: string): string {
  const norm = normalizePhoneNumber(phone);
  if (norm.startsWith("+62")) {
    const rest = norm.slice(3);
    if (rest.length <= 3) return `+62 ${rest}`;
    if (rest.length <= 7) return `+62 ${rest.slice(0, 3)}-${rest.slice(3)}`;
    return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7, 11)}`;
  }
  return phone;
}

/**
 * Formats number to Indonesian Rupiah currency string
 */
export function formatCurrencyIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
