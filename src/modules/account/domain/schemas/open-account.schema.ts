import { z } from "zod";

// Helper validator format PIN kuat
export const isPINStrong = (pin: string): { valid: boolean; message?: string } => {
  if (!/^[0-9]{6}$/.test(pin)) {
    return { valid: false, message: "PIN harus terdiri dari 6 digit angka." };
  }

  // Cek angka identik berulang (e.g. 111111)
  const allSame = pin.split("").every((digit) => digit === pin[0]);
  if (allSame) {
    return { valid: false, message: "PIN tidak boleh menggunakan angka berulang yang sama." };
  }

  // Cek angka berurutan naik (e.g. 123456)
  let isSeqAsc = true;
  for (let i = 1; i < pin.length; i++) {
    if (Number(pin[i]) !== Number(pin[i - 1]) + 1) {
      isSeqAsc = false;
      break;
    }
  }
  if (isSeqAsc) {
    return { valid: false, message: "PIN tidak boleh menggunakan kombinasi angka berurutan." };
  }

  // Cek angka berurutan turun (e.g. 654321)
  let isSeqDesc = true;
  for (let i = 1; i < pin.length; i++) {
    if (Number(pin[i]) !== Number(pin[i - 1]) - 1) {
      isSeqDesc = false;
      break;
    }
  }
  if (isSeqDesc) {
    return { valid: false, message: "PIN tidak boleh menggunakan kombinasi angka berurutan." };
  }

  return { valid: true };
};

export const OpenAccountFormSchema = z
  .object({
    productType: z.enum(["REGULAR_SAVINGS", "PRIORITY_SAVINGS", "STUDENT_SAVINGS"], {
      errorMap: () => ({ message: "Silakan pilih jenis rekening tabungan." }),
    }),
    occupation: z.string().min(2, "Jenis pekerjaan wajib diisi."),
    monthlyIncome: z.string().min(1, "Rentang penghasilan wajib dipilih."),
    sourceOfFunds: z.string().min(1, "Sumber dana wajib dipilih."),
    agreedToTerms: z.literal(true, {
      errorMap: () => ({ message: "Anda harus menyetujui Syarat & Ketentuan Perbankan." }),
    }),
    pin: z
      .string()
      .length(6, "PIN harus 6 digit angka")
      .refine((pin) => isPINStrong(pin).valid, {
        message: "PIN terlalu mudah ditebak. Hindari kombinasi angka berulang atau berurutan.",
      }),
    confirmPin: z.string().length(6, "Konfirmasi PIN harus 6 digit angka"),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "Konfirmasi PIN tidak cocok dengan PIN pertama.",
    path: ["confirmPin"],
  });

export type OpenAccountFormData = z.infer<typeof OpenAccountFormSchema>;
