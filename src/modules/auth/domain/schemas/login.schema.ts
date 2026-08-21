import { z } from "zod";

/**
 * Zod Schema for Login Validation
 * Supports Email or NIK or Phone number as identifier
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email / NIK / No. Handphone wajib diisi")
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isNIK = /^\d{16}$/.test(val);
      const isPhone = /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(val.replace(/[\s-]/g, ""));
      return isEmail || isNIK || isPhone || val.length >= 3;
    }, "Format Email, NIK (16 digit), atau No. HP tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
