// Regex untuk mencegah karakter berbahaya (injeksi SQL/XSS/Command Injection)
// Hanya mengizinkan huruf, angka, spasi, dan tanda baca umum yang aman
export const safeStringRegex = /^[a-zA-Z0-9\s.,@_\-\+]+$/;
