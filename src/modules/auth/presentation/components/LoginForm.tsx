import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Check, KeyRound, Lock, LogIn, Mail, Sparkles } from "lucide-react-native";
import { Button, Card, Input, Toast } from "@/shared/components/ui";
import { loginSchema } from "@/modules/auth/domain/schemas/login.schema";
import { useLoginMutation } from "@/modules/auth/application/queries/useLoginMutation";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";

export interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const rememberedIdentifier = useAuthStore((state) => state.rememberedIdentifier);

  const [identifier, setIdentifier] = useState(rememberedIdentifier || "nasabah@neocentra.bank");
  const [password, setPassword] = useState("Password123#");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      setErrorMessage(null);
      onSuccess?.();
    },
    onError: (err) => {
      setErrorMessage(err.message || "Gagal masuk. Periksa kembali data akun Anda.");
    },
  });

  const handleValidationAndSubmit = () => {
    setErrorMessage(null);
    const result = loginSchema.safeParse({
      identifier: identifier.trim(),
      password: password.trim(),
      rememberMe,
    });

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
    loginMutation.mutate(result.data);
  };

  const handleFillDemo = () => {
    setIdentifier("nasabah@neocentra.bank");
    setPassword("Neocentra2026!");
    setErrors({});
    setErrorMessage(null);
  };

  return (
    <Card variant="elevated" className="w-full">
      {errorMessage && (
        <Toast
          type="error"
          title="Login Gagal"
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* Identifier Input */}
      <Input
        label="Email / NIK / No. Handphone"
        placeholder="nama@email.com atau 3201..."
        value={identifier}
        onChangeText={(val) => {
          setIdentifier(val);
          if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: "" }));
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.identifier}
        leftIcon={<Mail size={18} color="#64748B" />}
      />

      {/* Password Input */}
      <Input
        label="Password Akun"
        placeholder="Masukkan kata sandi akun"
        value={password}
        onChangeText={(val) => {
          setPassword(val);
          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
        }}
        isPassword
        error={errors.password}
        leftIcon={<Lock size={18} color="#64748B" />}
      />

      {/* Remember Me & Forgot Password */}
      <View className="flex-row items-center justify-between mb-5 mt-1">
        <Pressable
          onPress={() => setRememberMe(!rememberMe)}
          className="flex-row items-center"
          hitSlop={8}
        >
          <View
            className={`w-5 h-5 rounded-md border items-center justify-center mr-2 ${
              rememberMe
                ? "bg-[#0066FF] border-[#0066FF]"
                : "border-slate-300 dark:border-slate-700 bg-transparent"
            }`}
          >
            {rememberMe && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Ingat Akun Saya
          </Text>
        </Pressable>

        <Pressable onPress={onForgotPassword} hitSlop={8}>
          <Text className="text-xs text-[#0066FF] dark:text-blue-400 font-semibold">
            Lupa Password?
          </Text>
        </Pressable>
      </View>

      {/* Submit Button */}
      <Button
        title="Masuk ke Rekening"
        variant="primary"
        size="lg"
        isLoading={loginMutation.isPending}
        onPress={handleValidationAndSubmit}
        leftIcon={<LogIn size={18} color="#FFFFFF" />}
        className="w-full mb-3"
      />

      {/* Quick Demo Autofill Helper */}
      <Pressable
        onPress={handleFillDemo}
        className="flex-row items-center justify-center py-2 px-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40"
      >
        <Sparkles size={14} color="#0066FF" className="mr-1.5" />
        <Text className="text-xs text-[#0066FF] dark:text-blue-400 font-medium">
          Gunakan Demo Akun Nasabah
        </Text>
      </Pressable>
    </Card>
  );
}
