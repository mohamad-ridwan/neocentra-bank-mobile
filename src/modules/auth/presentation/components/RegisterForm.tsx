import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Controller } from "react-hook-form";
import {
  Check,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User as UserIcon,
  UserPlus,
} from "lucide-react-native";
import { Button, Card, Input } from "@/shared/components/ui";
import { RegisterResponse } from "@/modules/auth/infrastructure/api/auth.api";
import {
  allowedAddressChars,
  allowedEmailChars,
  allowedPhoneChars,
  nonLetterAndSpaceRegex,
  nonNumericRegex,
} from "@/shared/utils/regex";
import { useRegisterForm } from "../hooks/useRegisterForm";

export interface RegisterFormProps {
  scrollRef?: React.RefObject<ScrollView | null>;
  onSuccess?: (data: RegisterResponse) => void;
  onOpenTerms?: () => void;
}

export function RegisterForm({
  scrollRef,
  onSuccess,
  onOpenTerms,
}: RegisterFormProps) {
  const {
    control,
    errors,
    inputRefs,
    password,
    passwordStrength,
    strengthLabel,
    isPending,
    handlePasteBlocked,
    handleSubmit,
    handleFillDemo,
  } = useRegisterForm({ scrollRef, onSuccess });

  return (
    <Card variant="elevated" className="w-full mb-6">
      {/* 1. NIK Input */}
      <Controller
        control={control}
        name="nik"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.nik = el;
            }}
            label="Nomor Induk Kependudukan (NIK)"
            placeholder="16 digit angka KTP"
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={(val) => {
              const digits = val.replace(nonNumericRegex, "").slice(0, 16);
              onChange(digits);
            }}
            onBlur={onBlur}
            keyboardType="numeric"
            maxLength={16}
            error={errors.nik?.message}
            helperText={`${(value || "").length}/16 digit sesuai e-KTP`}
            leftIcon={CreditCard}
            // non-clipboard & non-autofill fields
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            selectTextOnFocus={false}
            secureTextEntry={false}
          />
        )}
      />

      {/* 2. Full Name Input */}
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.fullName = el;
            }}
            label="Nama Lengkap (Sesuai KTP)"
            placeholder="Masukkan nama lengkap"
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={(val) => {
              const alphabet = val.replace(nonLetterAndSpaceRegex, "");
              onChange(alphabet);
            }}
            onBlur={onBlur}
            error={errors.fullName?.message}
            leftIcon={UserIcon}
            // non-clipboard & non-autofill fields
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            selectTextOnFocus={false}
            secureTextEntry={false}
          />
        )}
      />

      {/* 3. Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.email = el;
            }}
            label="Alamat Email Aktif"
            placeholder="nama@email.com"
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={(val) => {
              const validEmail = val
                .replace(allowedEmailChars, "")
                .replace(/\s/g, "");
              onChange(validEmail);
            }}
            onBlur={onBlur}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            textContentType="none"
            importantForAutofill="no"
            keyboardType="email-address"
            contextMenuHidden={true}
            selectTextOnFocus={false}
            secureTextEntry={false}
            error={errors.email?.message}
            leftIcon={Mail}
          />
        )}
      />

      {/* 4. Phone Number Input */}
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.phoneNumber = el;
            }}
            label="Nomor Handphone (WhatsApp / SMS)"
            placeholder="0812xxxxxxx"
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={(val) => {
              const sanitizedPhone = val.replace(allowedPhoneChars, "");
              onChange(sanitizedPhone);
            }}
            onBlur={onBlur}
            keyboardType="phone-pad"
            error={errors.phoneNumber?.message}
            leftIcon={Phone}
            // non-clipboard & non-autofill fields
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            selectTextOnFocus={false}
            secureTextEntry={false}
          />
        )}
      />

      {/* 5. Address Input */}
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.address = el;
            }}
            label="Alamat Domisili Lengkap"
            placeholder="Nama jalan, RT/RW, kelurahan, kota"
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={(val) => {
              const sanitizedAddress = val.replace(allowedAddressChars, "");
              onChange(sanitizedAddress);
            }}
            onBlur={onBlur}
            error={errors.address?.message}
            leftIcon={MapPin}
            // non-clipboard & non-autofill fields
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            selectTextOnFocus={false}
            secureTextEntry={false}
          />
        )}
      />

      {/* 6. Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.password = el;
            }}
            label="Password Akun Baru"
            placeholder="Minimal 12 karakter (huruf besar, angka)"
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={(val) => {
              const cleanPassword = val.trim();
              onChange(cleanPassword);
            }}
            onBlur={onBlur}
            isPassword
            error={errors.password?.message}
            leftIcon={Lock}
            // non-clipboard & non-autofill fields
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            selectTextOnFocus={false}
          />
        )}
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

      {/* 7. Konfirmasi Password */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={(el) => {
              inputRefs.current.confirmPassword = el;
            }}
            label="Konfirmasi Password"
            placeholder="Ulangi kata sandi baru"
            value={value}
            preventPaste={true}
            onPasteBlocked={handlePasteBlocked}
            onChangeText={(val) => {
              const cleanConfirm = val.trim();
              onChange(cleanConfirm);
            }}
            onBlur={onBlur}
            isPassword
            error={errors.confirmPassword?.message}
            leftIcon={Lock}
            // non-clipboard & non-autofill fields
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            selectTextOnFocus={false}
          />
        )}
      />

      {/* 8. Terms & Agreement */}
      <Controller
        control={control}
        name="agreeTerms"
        render={({ field: { onChange, value } }) => (
          <View
            ref={(el) => {
              inputRefs.current.agreeTerms = el;
            }}
            className="mb-5"
          >
            <Pressable
              onPress={() => onChange(!value)}
              className="flex-row items-start"
              hitSlop={8}
            >
              <View
                className={`w-5 h-5 rounded-md border items-center justify-center mr-2.5 mt-0.5 ${
                  value
                    ? "bg-[#0066FF] border-[#0066FF]"
                    : "border-slate-300 dark:border-slate-700 bg-transparent"
                }`}
              >
                {value && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text className="flex-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Saya menyetujui{" "}
                <Text
                  onPress={onOpenTerms}
                  className="text-[#0066FF] dark:text-blue-400 font-semibold"
                >
                  Syarat & Ketentuan Pembukaan Rekening
                </Text>{" "}
                serta perlindungan data nasabah Neocentra Bank.
              </Text>
            </Pressable>
            {errors.agreeTerms && (
              <Text className="text-xs text-rose-500 font-medium mt-1 ml-7">
                {errors.agreeTerms.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Submit Button */}
      <Button
        title="Daftar Rekening Baru"
        variant="primary"
        size="lg"
        isLoading={isPending}
        onPress={handleSubmit}
        leftIcon={UserPlus}
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
