import { useEffect, useMemo, useRef } from "react";
import { ScrollView } from "react-native";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormData,
} from "@/modules/auth/domain/schemas/register.schema";
import { useRegisterMutation } from "@/modules/auth/application/queries/useRegisterMutation";
import { RegisterResponse } from "@/modules/auth/infrastructure/api/auth.api";
import UseToast from "@/shared/hooks/UseToast";
import useScreenCapture from "@/shared/hooks/useScreenCapture";
import Reactotron from "reactotron-react-native";
import { HybridCryptoService } from "@/shared/security/hybridCryptoService";
import { normalizePhoneNumber } from "@/shared/utils/formatters";
import { RequestCustomerRegisterBinary } from "../../infrastructure/mappers/user.mapper";

export interface UseRegisterFormProps {
  scrollRef?: React.RefObject<ScrollView | null>;
  onSuccess?: (data: RegisterResponse) => void;
}

// Urutan field dari atas ke bawah untuk auto-scroll deterministik
const FIELD_ORDER: (keyof RegisterFormData)[] = [
  "nik",
  "fullName",
  "email",
  "phoneNumber",
  "address",
  "password",
  "confirmPassword",
  "agreeTerms",
];

export function useRegisterForm({
  scrollRef,
  onSuccess,
}: UseRegisterFormProps) {
  // Anti-Screenshot & App Switcher Masking
  // MASVS-RESILIENCE
  useScreenCapture();

  const { handleToast } = UseToast();

  const handlePasteBlocked = () => {
    handleToast({
      message:
        "Demi keamanan perbankan, pengisian data dari papan klip (paste) tidak diperbolehkan.",
      title: "Keamanan Perbankan",
      type: "warning",
    });
  };

  // Ref dictionary untuk menyimpan referensi setiap elemen input
  const inputRefs = useRef<Record<string, any>>({});

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nik: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false as any,
    },
    mode: "onBlur",
  });

  const allValues = watch();

  useEffect(() => {
    if (__DEV__) {
      // This pushes form state straight to your desktop debugger layout
      Reactotron.display({
        name: "React Hook Form",
        preview: "Form Values & State Update",
        value: {
          values: allValues,
          errors: errors,
          isDirty: isDirty,
          isSubmitting: isSubmitting,
        },
      });
    }
  }, [allValues, errors, isDirty, isSubmitting]);

  useEffect(() => {
    if (__DEV__) {
      return () => {
        Reactotron.display({
          name: "React Hook Form",
          preview: "Form Values & State Update & unmount RegisterForm.tsx",
          value: {
            values: allValues,
            errors: errors,
            isDirty: isDirty,
            isSubmitting: isSubmitting,
          },
        });
      };
    }
  }, []);

  const registerMutation = useRegisterMutation({
    onSuccess: (data) => {
      onSuccess?.(data);
      reset({});
    },
    onError: (err) => {
      handleToast({
        message:
          err.message || "Gagal melakukan registrasi. Silakan coba lagi.",
        title: "Registrasi Gagal",
        type: "error",
      });
    },
  });

  // Watch password untuk penghitungan indikator kekuatan kata sandi secara reaktif
  const password = watch("password") || "";

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (password.length === 0) return { text: "", color: "bg-slate-200" };
    if (passwordStrength <= 2) return { text: "Lemah", color: "bg-rose-500" };
    if (passwordStrength <= 3) return { text: "Sedang", color: "bg-amber-500" };
    return { text: "Sangat Kuat", color: "bg-emerald-500" };
  }, [password, passwordStrength]);

  /**
   * Handler saat validasi form BERHASIL
   * Meneruskan data yang sudah divalidasi ke TanStack Query useMutation
   */
  const onSubmit = (data: RegisterFormData) => {
    // 1. Serialize data registrasi customer ke format JSON (normalisasi nomor telepon ke E.164)
    const customerJSON = JSON.stringify({
      nik: data.nik,
      full_name: data.fullName,
      email: data.email,
      phone_number: normalizePhoneNumber(data.phoneNumber),
      address: data.address,
      password: data.password,
    });

    // 2. Enkripsi hybrid Pola 1 (RSA-OAEP SHA-256 + AES-256-GCM)
    const binaryPayload: RequestCustomerRegisterBinary =
      HybridCryptoService.encryptPayload(customerJSON);

    registerMutation.mutate(binaryPayload);
  };

  /**
   * Handler saat validasi form GAGAL (Best Practice Auto-Focus & Auto-Scroll)
   * 1. Menentukan field pertama yang error berdasarkan urutan visual (FIELD_ORDER)
   * 2. Menjalankan focus() pada input terkait
   * 3. Mengukur posisi elemen terhadap ScrollView menggunakan measureLayout
   * 4. Melakukan scroll animasi ke posisi target dengan offset yang nyaman
   */
  const onError = (formErrors: FieldErrors<RegisterFormData>) => {
    // 1. Ambil field pertama yang error berdasarkan urutan schema/layout
    const firstError = FIELD_ORDER.find((field) => formErrors[field]);
    if (!firstError) return;

    const targetElement = inputRefs.current[firstError];
    if (targetElement) {
      // 2. Fokus ke input tersebut
      targetElement.focus?.();

      // 3. Scroll ke posisi input secara presisi di dalam ScrollView
      if (scrollRef?.current && targetElement.measureLayout) {
        targetElement.measureLayout(
          scrollRef.current,
          (_x: number, y: number) => {
            scrollRef.current?.scrollTo({
              y: Math.max(0, y - 24), // Margin 24px untuk padding visual label & header
              animated: true,
            });
          },
          () => {
            // Fallback jika measureLayout belum siap
          },
        );
      }
    }
  };

  const handleFillDemo = () => {
    reset({
      nik: "3201010101990001",
      fullName: "Budi Santoso",
      email: "budi.santoso@neocentra.bank",
      phoneNumber: "081298765432",
      address: "Jl. Sudirman No. 45, Jakarta Selatan",
      password: "Neocentra2026!",
      confirmPassword: "Neocentra2026!",
      agreeTerms: true,
    });
  };

  return {
    control,
    errors,
    inputRefs,
    password,
    passwordStrength,
    strengthLabel,
    isPending: registerMutation.isPending,
    handlePasteBlocked,
    handleSubmit: handleSubmit(onSubmit, onError),
    handleFillDemo,
  };
}
