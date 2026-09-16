import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Settings, ShieldCheck } from "lucide-react-native";
import { AuthHeader } from "../components/AuthHeader";
import { RegisterForm } from "../components/RegisterForm";
import { RegisterResponse } from "@/modules/auth/infrastructure/api/auth.api";
import { useColorScheme } from "@/shared/hooks/useColorScheme";
import { useVerificationStore } from "@/modules/auth/application/store/useVerificationStore";

export function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  const scrollRef = useRef<ScrollView>(null);
  const setVerificationSession = useVerificationStore(
    (state) => state.setVerificationSession,
  );

  const handleRegisterSuccess = (data: RegisterResponse) => {
    // Simpan masked email dan verificationToken ke global state
    setVerificationSession({
      email: data.email,
      verificationToken: data.verificationToken,
    });
    // Direct ke route verification
    router.push("/(auth)/verification");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5"
      >
        {/* Top Navigation Bar with Back and Settings */}
        <View className="flex-row items-center justify-between pt-2 pb-1">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center self-start py-2 pr-4 active:opacity-60"
            hitSlop={8}
          >
            <ArrowLeft size={20} color="#0066FF" className="mr-1.5" />
            <Text className="text-sm font-semibold text-[#0066FF] dark:text-blue-400">
              Kembali ke Login
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/settings")}
            className="w-9 h-9 rounded-xl bg-white dark:bg-neocentra-bg-cardDark border border-slate-200 dark:border-slate-800 items-center justify-center shadow-sm active:opacity-70"
            hitSlop={8}
          >
            <Settings size={16} color={isDark ? "#94A3B8" : "#64748B"} />
          </Pressable>
        </View>

        {/* Registration Form View */}
        <AuthHeader
          title="Pendaftaran Akun"
          subtitle="Lengkapi data identitas resmi sesuai e-KTP untuk memulai perbankan digital Neocentra."
          badgeText="Proses Online Cepat & Aman"
        />

        <RegisterForm
          scrollRef={scrollRef}
          onSuccess={handleRegisterSuccess}
          onOpenTerms={() => {
            alert(
              "Syarat dan Ketentuan Nasabah Neocentra Bank berlaku sesuai standar regulasi BI & OJK.",
            );
          }}
        />

        {/* Login Navigation Footer */}
        <View className="flex-row items-center justify-center pt-2">
          <Text className="text-sm text-slate-600 dark:text-slate-400">
            Sudah memiliki akun?{" "}
          </Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="text-sm text-[#0066FF] dark:text-blue-400 font-bold">
              Masuk Sekarang
            </Text>
          </Pressable>
        </View>

        {/* Security Assurance Footer */}
        <View className="flex-row items-center justify-center mt-6">
          <ShieldCheck size={14} color="#10B981" className="mr-1.5" />
          <Text className="text-xs text-slate-400 dark:text-slate-500 text-center">
            Dilindungi Enkripsi Field-Level (FLE) & KMS Google Tink
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
