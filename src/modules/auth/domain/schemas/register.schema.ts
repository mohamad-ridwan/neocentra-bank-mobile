import { z } from "zod";

/**
 * Zod Schema for Registration Validation
 * Matches Neocentra Bank customer onboarding requirements & backend rules
 */
export const registerSchema = z
  .object({
    nik: z
      .string()
      .min(1, "NIK wajib diisi")
      .length(16, "NIK harus tepat 16 digit angka")
      .regex(/^\d{16}$/, "NIK hanya boleh berisi angka"),
    fullName: z
      .string()
      .min(1, "Nama lengkap sesuai KTP wajib diisi")
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid (contoh: nama@domain.com)"),
    phoneNumber: z
      .string()
      .min(1, "Nomor handphone wajib diisi")
      .refine(
        (val) => {
          const clean = val.replace(/[\s-]/g, "");
          return /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(clean);
        },
        "Format nomor HP tidak valid (contoh: 08123456789 atau +628123456789)"
      ),
    address: z
      .string()
      .min(1, "Alamat domisili wajib diisi")
      .min(10, "Alamat minimal 10 karakter"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus memiliki minimal 1 huruf besar (A-Z)")
      .regex(/[a-z]/, "Password harus memiliki minimal 1 huruf kecil (a-z)")
      .regex(/[0-9]/, "Password harus memiliki minimal 1 angka (0-9)"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    agreeTerms: z
      .boolean()
      .refine((val) => val === true, "Anda harus menyetujui Syarat dan Ketentuan"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok dengan password di atas",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
