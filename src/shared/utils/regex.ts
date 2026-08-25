// Regex untuk mencegah karakter berbahaya (injeksi SQL/XSS/Command Injection)
// Hanya mengizinkan huruf, angka, spasi, dan tanda baca umum yang aman
export const safeStringRegex = /^[a-zA-Z0-9\s.,@_\-\+]+$/;

export const nonNumericRegex = /\D/g;
export const nonLetterAndSpaceRegex = /[^A-Za-z ]/g;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 1. Definisikan karakter yang diizinkan (Whitelisting)
// Hanya izinkan karakter yang valid untuk email
export const allowedEmailChars = /[^a-zA-Z0-9._%+-@]/g;

// Izinkan digit dan karakter '+' untuk format internasional
export const allowedPhoneChars = /[^0-9+]/g;

// Izinkan alfanumerik, spasi, titik, koma, strip, dan garis miring (untuk alamat)
export const allowedAddressChars = /[^a-zA-Z0-9\s.,\-\/]/g;

