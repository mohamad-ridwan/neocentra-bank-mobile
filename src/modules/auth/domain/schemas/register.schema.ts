import { safeStringRegex } from "@/shared/utils/regex";
import { z } from "zod";

/**
 * Zod Schema for Registration Validation
 * Matches Neocentra Bank customer onboarding requirements & backend rules
 */

export const registerSchema = z
  .object({
    // NIK: Memastikan hanya angka 16 digit, tidak ada karakter lain
    nik: z
      .string()
      .length(16, "NIK harus tepat 16 digit")
      .regex(/^\d{16}$/, "NIK hanya boleh berisi angka"),

    // Full Name: Batasi panjang dan hindari karakter spesial yang berpotensi injeksi
    fullName: z
      .string()
      .trim()
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter")
      .regex(safeStringRegex, "Nama mengandung karakter yang tidak diizinkan"),

    // Email: Gunakan .email() dari Zod yang sudah cukup standar, namun tambahkan sanitasi
    email: z.string().trim().toLowerCase().email("Format email tidak valid"),

    // PhoneNumber: Penanganan prefix ketat (E.164 format suggestion)
    phoneNumber: z.string().refine((val) => {
      const clean = val.replace(/[\s-]/g, "");
      // Memastikan format lokal Indonesia yang valid
      return /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(clean);
    }, "Format nomor HP tidak valid"),

    // Address: Sanitasi ketat untuk menghindari injeksi
    address: z
      .string()
      .trim()
      .min(10, "Alamat minimal 10 karakter")
      .max(255, "Alamat terlalu panjang")
      .regex(safeStringRegex, "Alamat mengandung karakter tidak valid"),

    // Password: Standar perbankan memerlukan entropi tinggi
    password: z
      .string()
      .min(12, "Password minimal 12 karakter untuk standar keamanan perbankan")
      .regex(/[A-Z]/, "Minimal 1 huruf besar")
      .regex(/[a-z]/, "Minimal 1 huruf kecil")
      .regex(/[0-9]/, "Minimal 1 angka")
      .regex(/[^A-Za-z0-9]/, "Minimal 1 simbol/karakter khusus (@, #, !, dll)"),

    confirmPassword: z.string(),

    // AgreeTerms: Eksplisit, tidak bisa null/undefined
    agreeTerms: z.literal(true, {
      errorMap: () => ({
        message: "Anda harus menyetujui Syarat dan Ketentuan",
      }),
    }),
  })
  // Refinement terakhir untuk validasi lintas field
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
