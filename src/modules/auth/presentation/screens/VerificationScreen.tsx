import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Clock, Mail, RotateCw, ShieldCheck } from "lucide-react-native";
import { Badge, Button, Card, Heading } from "@/shared/components/ui";
import { AuthApi } from "@/modules/auth/infrastructure/api/auth.api";
import { useVerificationStore } from "@/modules/auth/application/store/useVerificationStore";
import UseToast from "@/shared/hooks/UseToast";

export function VerificationScreen() {
  const router = useRouter();
  const { handleToast } = UseToast();
  const session = useVerificationStore((state) => state.session);

  const [digits, setDigits] = useState<string[]>(["", "", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // 1-minute countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (value: string, index: number) => {
    // Only accept numeric
    const cleanVal = value.replace(/[^0-9]/g, "");
    const newDigits = [...digits];

    if (cleanVal.length > 1) {
      // User pasted multiple digits
      const pasted = cleanVal.slice(0, 5).split("");
      pasted.forEach((char, idx) => {
        newDigits[idx] = char;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 4);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Auto advance to next input
    if (cleanVal && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = digits.join("");
    if (fullCode.length !== 5) {
      handleToast({
        title: "Kode Tidak Lengkap",
        message: "Silakan masukkan 5 digit kode verifikasi secara lengkap.",
        type: "warning",
      });
      return;
    }

    if (!session?.verificationToken) {
      handleToast({
        title: "Sesi Habis",
        message: "Sesi verifikasi tidak ditemukan. Silakan lakukan registrasi ulang.",
        type: "error",
      });
      router.replace("/(auth)/register");
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await AuthApi.verifyAccount({
        verificationToken: session.verificationToken,
        code: fullCode,
      });

      if (resp.success) {
        handleToast({
          title: "Berhasil",
          message: resp.message || "Akun Anda berhasil diverifikasi!",
          type: "success",
        });
        router.replace("/(auth)/account-verified");
      } else {
        handleToast({
          title: "Verifikasi Gagal",
          message: resp.message || "Kode verifikasi tidak sesuai.",
          type: "error",
        });
      }
    } catch (err: any) {
      handleToast({
        title: "Verifikasi Gagal",
        message:
          err.message || "Kode verifikasi salah atau telah kadaluwarsa.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const maskedEmail = session?.email || "u***r@domain.com";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5"
      >
        {/* Top Navigation Bar */}
        <View className="flex-row items-center justify-between pt-2 pb-2">
          <Pressable
            onPress={() => router.replace("/(auth)/register")}
            className="flex-row items-center py-2 pr-4 active:opacity-60"
            hitSlop={8}
          >
            <ArrowLeft size={20} color="#0066FF" className="mr-1.5" />
            <Text className="text-sm font-semibold text-[#0066FF] dark:text-blue-400">
              Daftar Ulang
            </Text>
          </Pressable>
        </View>

        {/* Header Content */}
        <View className="mb-6 pt-2">
          <View className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 items-center justify-center mb-4 border border-blue-100 dark:border-blue-900 shadow-sm">
            <Mail size={28} color="#0066FF" />
          </View>

          <Heading className="text-2xl font-bold mb-2">
            Verifikasi Akun
          </Heading>
          <Text className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Masukkan 5 digit kode verifikasi yang telah kami kirimkan ke email{" "}
            <Text className="font-bold text-[#0066FF] dark:text-blue-400">
              {maskedEmail}
            </Text>
          </Text>
        </View>

        {/* Verification OTP Input Card */}
        <Card variant="elevated" className="w-full mb-6 p-6 items-center">
          <View className="flex-row justify-between w-full max-w-[280px] mb-6">
            {digits.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => {
                  inputRefs.current[idx] = ref;
                }}
                value={digit}
                onChangeText={(val) => handleDigitChange(val, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                autoFocus={idx === 0}
                className={`w-12 h-14 rounded-xl text-2xl font-bold text-center border ${
                  digit
                    ? "border-[#0066FF] bg-blue-50/50 dark:bg-blue-950/20 text-[#0066FF] dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-white"
                }`}
              />
            ))}
          </View>

          {/* Countdown & Resend Section */}
          <View className="flex-row items-center justify-center mb-6">
            {countdown > 0 ? (
              <View className="flex-row items-center">
                <Clock size={16} color="#64748B" className="mr-1.5" />
                <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Kode kedaluwarsa dalam{" "}
                  <Text className="font-bold text-amber-500">
                    {countdown} detik
                  </Text>
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setCountdown(60);
                  setDigits(["", "", "", "", ""]);
                  inputRefs.current[0]?.focus();
                  handleToast({
                    title: "Kode Baru",
                    message: "Kode baru telah dikirimkan ke email Anda.",
                    type: "info",
                  });
                }}
                className="flex-row items-center active:opacity-70 py-1 px-3 rounded-full bg-slate-100 dark:bg-slate-800"
              >
                <RotateCw size={14} color="#0066FF" className="mr-1.5" />
                <Text className="text-xs font-semibold text-[#0066FF] dark:text-blue-400">
                  Kirim Ulang Kode
                </Text>
              </Pressable>
            )}
          </View>

          {/* Action Button */}
          <Button
            title="Verifikasi Sekarang"
            variant="primary"
            size="lg"
            onPress={handleVerify}
            isLoading={isSubmitting}
            disabled={digits.join("").length !== 5 || isSubmitting}
            className="w-full"
          />
        </Card>

        {/* Security Info */}
        <View className="flex-row items-center justify-center mt-auto pt-4">
          <ShieldCheck size={14} color="#10B981" className="mr-1.5" />
          <Text className="text-xs text-slate-400 dark:text-slate-500 text-center">
            Verifikasi Diamankan dengan Standar Kriptografi Perbankan
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
