import React from "react";
import { Pressable, Text, View } from "react-native";
import { Check, Lock, LogIn, Mail, Sparkles } from "lucide-react-native";
import { Button, Card, Input, Toast } from "@/shared/components/ui";
import { useLoginForm } from "@/modules/auth/presentation/hooks/useLoginForm";

export interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const {
    identifier,
    password,
    rememberMe,
    errors,
    errorMessage,
    setErrorMessage,
    loginMutation,
    handleIdentifierChange,
    handlePasswordChange,
    handleToggleRememberMe,
    handleValidationAndSubmit,
    handleFillDemo,
  } = useLoginForm({ onSuccess });

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
        onChangeText={handleIdentifierChange}
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.identifier}
        leftIcon={Mail}
      />

      {/* Password Input */}
      <Input
        label="Password Akun"
        placeholder="Masukkan kata sandi akun"
        value={password}
        onChangeText={handlePasswordChange}
        isPassword
        error={errors.password}
        leftIcon={Lock}
      />

      {/* Remember Me & Forgot Password */}
      <View className="flex-row items-center justify-between mb-5 mt-1">
        <Pressable
          onPress={handleToggleRememberMe}
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
        leftIcon={LogIn}
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
