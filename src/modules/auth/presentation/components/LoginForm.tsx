import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Controller } from "react-hook-form";
import { Check, Lock, LogIn, Mail, Sparkles } from "lucide-react-native";
import { Button, Card, Input } from "@/shared/components/ui";
import { useLoginForm } from "@/modules/auth/presentation/hooks/useLoginForm";

export interface LoginFormProps {
  scrollRef?: React.RefObject<ScrollView | null>;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({
  scrollRef,
  onSuccess,
  onForgotPassword,
}: LoginFormProps) {
  const {
    control,
    errors,
    inputRefs,
    isPending,
    handleSubmit,
    handleFillDemo,
    handlePasteBlocked,
    watch,
    setValue,
  } = useLoginForm({ scrollRef, onSuccess });

  const rememberMe = watch("rememberMe");

  return (
    <Card variant="elevated" className="w-full">
      {/* 1. Identifier Input (Email / NIK / No. Handphone) */}
      <Controller
        control={control}
        name="identifier"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.identifier = el;
            }}
            label="Email / NIK / No. Handphone"
            placeholder="nama@email.com atau 3201..."
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.identifier?.message}
            leftIcon={Mail}
            autoComplete="off"
            autoCorrect={false}
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            selectTextOnFocus={false}
            secureTextEntry={false}
            spellCheck={false}
          />
        )}
      />

      {/* 2. Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.password = el;
            }}
            label="Password Akun"
            placeholder="Masukkan kata sandi akun"
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={onChange}
            onBlur={onBlur}
            isPassword
            error={errors.password?.message}
            leftIcon={Lock}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            selectTextOnFocus={false}
          />
        )}
      />

      {/* Remember Me & Forgot Password */}
      <View className="flex-row items-center justify-between mb-5 mt-1">
        <Pressable
          onPress={() => setValue("rememberMe", !rememberMe)}
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
        title="Masuk Akun"
        variant="primary"
        size="lg"
        isLoading={isPending}
        onPress={handleSubmit}
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
