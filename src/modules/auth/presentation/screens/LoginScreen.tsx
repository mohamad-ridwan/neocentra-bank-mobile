import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Fingerprint, Settings, ShieldCheck } from "lucide-react-native";
import { Button, Card } from "@/shared/components/ui";
import { AuthHeader } from "../components/AuthHeader";
import { LoginForm } from "../components/LoginForm";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";
import { useColorScheme } from "@/shared/hooks/useColorScheme";

export function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const { isDark } = useColorScheme();

  const handleLoginSuccess = () => {
    router.replace("/");
  };

  const handleBiometricMock = () => {
    // Quick biometric authentication simulation
    setSession(
      {
        id: "cust_biometric_01",
        nik: "3201010203040001",
        fullName: "Ahmad Fauzi (Biometric Login)",
        email: "ahmad.fauzi@neocentra.bank",
        phoneNumber: "+6281234567890",
        status: "ACTIVE",
        balance: 45750000,
        accountNumber: "8809 3421 9870",
        createdAt: new Date().toISOString(),
      },
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_biometric_token",
    );
    router.replace("/");
  };

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
        {/* Top Header Bar with Back and Settings Navigation */}
        <View className="flex-row items-center justify-between pt-2 pb-1">
          <Pressable
            onPress={() => router.replace("/")}
            className="flex-row items-center py-2 pr-4 active:opacity-60"
            hitSlop={8}
          >
            <ArrowLeft size={20} color="#0066FF" className="mr-1.5" />
            <Text className="text-sm font-semibold text-[#0066FF] dark:text-blue-400">
              Beranda
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/settings")}
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 items-center justify-center shadow-sm active:opacity-70"
            hitSlop={8}
          >
            <Settings size={16} color={isDark ? "#94A3B8" : "#64748B"} />
          </Pressable>
        </View>

        <AuthHeader
          title="Selamat Datang"
          subtitle="Akses seluruh layanan perbankan digital Neocentra dalam satu genggaman aman."
          badgeText="Sistem Terenkripsi AES-256"
        />

        {/* Login Form Card */}
        <LoginForm
          onSuccess={handleLoginSuccess}
          onForgotPassword={() => {
            alert(
              "Silakan hubungi Customer Service Neocentra Bank untuk pemulihan akun.",
            );
          }}
        />

        {/* Biometric Quick Login Option */}
        <Card variant="outlined" className="w-full mb-6 items-center py-4">
          <Text className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Atau masuk cepat menggunakan biometrik
          </Text>
          <Button
            title="Masuk dengan Sidik Jari / Face ID"
            variant="secondary"
            size="md"
            onPress={handleBiometricMock}
            leftIcon={<Fingerprint size={20} color="#0066FF" />}
            className="w-full border border-blue-100 dark:border-blue-900/30"
          />
        </Card>

        {/* Register Navigation Footer */}
        <View className="flex-row items-center justify-center pt-2">
          <Text className="text-sm text-slate-600 dark:text-slate-400">
            Belum memiliki rekening?{" "}
          </Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text className="text-sm text-[#0066FF] dark:text-blue-400 font-bold">
              Buka Rekening Baru
            </Text>
          </Pressable>
        </View>

        {/* Security Assurance Footer */}
        <View className="flex-row items-center justify-center mt-6">
          <ShieldCheck size={14} color="#10B981" className="mr-1.5" />
          <Text className="text-xs text-slate-400 text-center">
            Terdaftar dan diawasi oleh OJK & Penjaminan LPS
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
