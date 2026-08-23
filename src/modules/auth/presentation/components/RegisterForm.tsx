import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  Check,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Sparkles,
  User as UserIcon,
  UserPlus,
} from "lucide-react-native";
import { Button, Card, Input, Toast } from "@/shared/components/ui";
import { registerSchema } from "@/modules/auth/domain/schemas/register.schema";
import { useRegisterMutation } from "@/modules/auth/application/queries/useRegisterMutation";
import { RegisterResponse } from "@/modules/auth/infrastructure/api/auth.api";

export interface RegisterFormProps {
  onSuccess?: (data: RegisterResponse) => void;
  onOpenTerms?: () => void;
}

export function RegisterForm({ onSuccess, onOpenTerms }: RegisterFormProps) {
  const [nik, setNik] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registerMutation = useRegisterMutation({
    onSuccess: (data) => {
      setErrorMessage(null);
      onSuccess?.(data);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Gagal melakukan registrasi. Silakan coba lagi.");
    },
  });

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // max 5
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (password.length === 0) return { text: "", color: "bg-slate-200" };
    if (passwordStrength <= 2) return { text: "Lemah", color: "bg-rose-500" };
    if (passwordStrength <= 3) return { text: "Sedang", color: "bg-amber-500" };
    return { text: "Sangat Kuat", color: "bg-emerald-500" };
  }, [password, passwordStrength]);

  const handleValidationAndSubmit = () => {
    setErrorMessage(null);

    const formData = {
      nik: nik.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      password,
      confirmPassword,
      agreeTerms,
    };

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    registerMutation.mutate(result.data);
  };

  const handleFillDemo = () => {
    setNik("3201010101990001");
    setFullName("Budi Santoso");
    setEmail("budi.santoso@neocentra.bank");
    setPhoneNumber("081298765432");
    setAddress("Jl. Sudirman No. 45, Jakarta Selatan");
    setPassword("Neocentra2026!");
    setConfirmPassword("Neocentra2026!");
    setAgreeTerms(true);
    setErrors({});
    setErrorMessage(null);
  };

  return (
    <Card variant="elevated" className="w-full mb-6">
      {errorMessage && (
        <Toast
          type="error"
          title="Registrasi Gagal"
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* 1. NIK Input */}
      <Input
        label="Nomor Induk Kependudukan (NIK)"
        placeholder="16 digit angka KTP"
        value={nik}
        onChangeText={(val) => {
          const digits = val.replace(/\D/g, "").slice(0, 16);
          setNik(digits);
          if (errors.nik) setErrors((prev) => ({ ...prev, nik: "" }));
        }}
        keyboardType="numeric"
        maxLength={16}
        error={errors.nik}
        helperText={`${nik.length}/16 digit sesuai e-KTP`}
        leftIcon={<CreditCard size={18} color="#64748B" />}
      />

      {/* 2. Full Name Input */}
      <Input
        label="Nama Lengkap (Sesuai KTP)"
        placeholder="Masukkan nama lengkap"
        value={fullName}
        onChangeText={(val) => {
          setFullName(val);
          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
        }}
        error={errors.fullName}
        leftIcon={<UserIcon size={18} color="#64748B" />}
      />

      {/* 3. Email Input */}
      <Input
        label="Alamat Email Aktif"
        placeholder="nama@email.com"
        value={email}
        onChangeText={(val) => {
          setEmail(val);
          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.email}
        leftIcon={<Mail size={18} color="#64748B" />}
      />

      {/* 4. Phone Number Input */}
      <Input
        label="Nomor Handphone (WhatsApp / SMS)"
        placeholder="0812xxxxxxx"
        value={phoneNumber}
        onChangeText={(val) => {
          setPhoneNumber(val);
          if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: "" }));
        }}
        keyboardType="phone-pad"
        error={errors.phoneNumber}
        leftIcon={<Phone size={18} color="#64748B" />}
      />

      {/* 5. Address Input */}
      <Input
        label="Alamat Domisili Lengkap"
        placeholder="Nama jalan, RT/RW, kelurahan, kota"
        value={address}
        onChangeText={(val) => {
          setAddress(val);
          if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
        }}
        error={errors.address}
        leftIcon={<MapPin size={18} color="#64748B" />}
      />

      {/* 6. Password Input */}
      <Input
        label="Password Akun Baru"
        placeholder="Minimal 8 karakter (huruf besar, angka)"
        value={password}
        onChangeText={(val) => {
          setPassword(val);
          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
        }}
        isPassword
        error={errors.password}
        leftIcon={<Lock size={18} color="#64748B" />}
      />

      {/* Password Strength Indicator */}
      {password.length > 0 && (
        <View className="mb-4 -mt-2">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs text-slate-500">Kekuatan Kata Sandi</Text>
            <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {strengthLabel.text}
            </Text>
          </View>
          <View className="flex-row h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <View
              className={`h-full ${strengthLabel.color}`}
              style={{ width: `${(passwordStrength / 5) * 100}%` }}
            />
          </View>
        </View>
      )}

      {/* 7. Confirm Password Input */}
      <Input
        label="Konfirmasi Password"
        placeholder="Ulangi kata sandi baru"
        value={confirmPassword}
        onChangeText={(val) => {
          setConfirmPassword(val);
          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }}
        isPassword
        error={errors.confirmPassword}
        leftIcon={<Lock size={18} color="#64748B" />}
      />

      {/* 8. Terms & Agreement */}
      <View className="mb-5">
        <Pressable
          onPress={() => {
            setAgreeTerms(!agreeTerms);
            if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: "" }));
          }}
          className="flex-row items-start"
          hitSlop={8}
        >
          <View
            className={`w-5 h-5 rounded-md border items-center justify-center mr-2.5 mt-0.5 ${
              agreeTerms
                ? "bg-[#0066FF] border-[#0066FF]"
                : "border-slate-300 dark:border-slate-700 bg-transparent"
            }`}
          >
            {agreeTerms && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text className="flex-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Saya menyetujui{" "}
            <Text className="text-[#0066FF] dark:text-blue-400 font-semibold">
              Syarat & Ketentuan Pembukaan Rekening
            </Text>{" "}
            serta perlindungan data nasabah Neocentra Bank.
          </Text>
        </Pressable>
        {errors.agreeTerms && (
          <Text className="text-xs text-rose-500 font-medium mt-1 ml-7">
            {errors.agreeTerms}
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <Button
        title="Daftar Rekening Baru"
        variant="primary"
        size="lg"
        isLoading={registerMutation.isPending}
        onPress={handleValidationAndSubmit}
        leftIcon={<UserPlus size={18} color="#FFFFFF" />}
        className="w-full mb-3"
      />

      {/* Quick Demo Autofill Helper */}
      <Pressable
        onPress={handleFillDemo}
        className="flex-row items-center justify-center py-2 px-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40"
      >
        <Sparkles size={14} color="#0066FF" className="mr-1.5" />
        <Text className="text-xs text-[#0066FF] dark:text-blue-400 font-medium">
          Isi Contoh Data Registrasi
        </Text>
      </Pressable>
    </Card>
  );
}
