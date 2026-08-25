import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, Clock, LogIn, Settings, ShieldCheck } from "lucide-react-native";
import { Badge, Button, Card, Heading } from "@/shared/components/ui";
import { maskNIK } from "@/shared/utils/formatters";
import { AuthHeader } from "../components/AuthHeader";
import { RegisterForm } from "../components/RegisterForm";
import { RegisterResponse } from "@/modules/auth/infrastructure/api/auth.api";
import { useColorScheme } from "@/shared/hooks/useColorScheme";

export function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  const [successData, setSuccessData] = useState<RegisterResponse | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleRegisterSuccess = (data: RegisterResponse) => {
    setSuccessData(data);
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
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 items-center justify-center shadow-sm active:opacity-70"
            hitSlop={8}
          >
            <Settings size={16} color={isDark ? "#94A3B8" : "#64748B"} />
          </Pressable>
        </View>

        {successData ? (
          /* Registration Success State Card */
          <View className="items-center py-6">
            <View className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800 shadow-lg">
              <CheckCircle2 size={44} color="#10B981" />
            </View>

            <Heading className="text-center text-2xl font-bold mb-2">
              Pendaftaran Berhasil!
            </Heading>
            <Text className="text-center text-sm text-slate-500 dark:text-slate-400 max-w-[300px] mb-6">
              Pengajuan pembukaan rekening Anda telah berhasil disimpan dan sedang dalam tahap verifikasi KYC.
            </Text>

            <Card variant="elevated" className="w-full mb-6">
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <Text className="text-xs text-slate-500 dark:text-slate-400">Status Akun</Text>
                <Badge
                  label="MENUNGGU VERIFIKASI"
                  variant="warning"
                  icon={Clock}
                />
              </View>

              <View className="space-y-2">
                <View className="flex-row justify-between py-1">
                  <Text className="text-xs text-slate-500 dark:text-slate-400">ID Nasabah</Text>
                  <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {successData.customerId}
                  </Text>
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Nama Lengkap</Text>
                  <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {successData.user.fullName}
                  </Text>
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-xs text-slate-500 dark:text-slate-400">NIK Terdaftar</Text>
                  <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {maskNIK(successData.user.nik)}
                  </Text>
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Email</Text>
                  <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {successData.user.email}
                  </Text>
                </View>
              </View>
            </Card>

            <Button
              title="Masuk ke Akun Sekarang"
              variant="primary"
              size="lg"
              onPress={() => router.replace("/(auth)/login")}
              leftIcon={LogIn}
              className="w-full mb-3"
            />
          </View>
        ) : (
          /* Registration Form View */
          <>
            <AuthHeader
              title="Buka Rekening Baru"
              subtitle="Lengkapi data identitas resmi sesuai e-KTP untuk memulai perbankan digital Neocentra."
              badgeText="Proses Online Cepat & Aman"
            />

            <RegisterForm
              scrollRef={scrollRef}
              onSuccess={handleRegisterSuccess}
              onOpenTerms={() => {
                alert("Syarat dan Ketentuan Nasabah Neocentra Bank berlaku sesuai standar regulasi BI & OJK.");
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
          </>
        )}

        {/* Security Assurance Footer */}
        <View className="flex-row items-center justify-center mt-6">
          <ShieldCheck size={14} color="#10B981" className="mr-1.5" />
          <Text className="text-xs text-slate-400 text-center">
            Dilindungi Enkripsi Field-Level (FLE) & KMS Google Tink
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
