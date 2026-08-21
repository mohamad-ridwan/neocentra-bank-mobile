import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Copy,
  CreditCard,
  History,
  Landmark,
  Lock,
  LogOut,
  PlusCircle,
  QrCode,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
} from "lucide-react-native";
import {
  Badge,
  Button,
  Card,
  Heading,
  Subheading,
} from "@/shared/components/ui";
import { formatCurrencyIDR, maskNIK } from "@/shared/utils/formatters";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";

export default function EntryScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Hide splash once the initial layout is ready
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const handleCopyAccount = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ----------------------------------------------------
  // 1. Authenticated Customer Dashboard View
  // ----------------------------------------------------
  if (isAuthenticated && user) {
    return (
      <SafeAreaView
        className="flex-1 bg-slate-50 dark:bg-[#0B0F19]"
        edges={["top", "left", "right"]}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
        >
          {/* Top Bar / Profile Header */}
          <View className="flex-row items-center justify-between pt-4 pb-5">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#0066FF] items-center justify-center shadow-md shadow-blue-500/20 mr-3">
                <Text className="text-white font-bold text-lg">
                  {user.fullName.charAt(0)}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-slate-500">Selamat Datang,</Text>
                <Subheading className="text-base font-bold text-slate-900 dark:text-white">
                  {user.fullName}
                </Subheading>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <Pressable className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 items-center justify-center">
                <Bell size={18} color="#64748B" />
              </Pressable>
              <Pressable
                onPress={logout}
                className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 items-center justify-center"
              >
                <LogOut size={18} color="#EF4444" />
              </Pressable>
            </View>
          </View>

          {/* Account Balance Card */}
          <Card className="w-full bg-[#0A2540] border border-blue-900/50 p-6 rounded-3xl mb-6 shadow-xl shadow-blue-950/40">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Landmark size={18} color="#60A5FA" className="mr-2" />
                <Text className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Tabungan Utama Neocentra
                </Text>
              </View>
              <Badge
                label={user.status === "ACTIVE" ? "AKTIF" : "VERIFIKASI"}
                variant={user.status === "ACTIVE" ? "success" : "warning"}
              />
            </View>

            <Text className="text-xs text-slate-400 mb-1">
              Total Saldo Efektif
            </Text>
            <Text className="text-3xl font-extrabold text-white mb-4">
              {formatCurrencyIDR(user.balance || 45750000)}
            </Text>

            <View className="flex-row items-center justify-between pt-3 border-t border-slate-700/60">
              <View>
                <Text className="text-[11px] text-slate-400">
                  Nomor Rekening
                </Text>
                <Text className="text-sm font-mono font-bold text-slate-100">
                  {user.accountNumber || "8809 3421 9870"}
                </Text>
              </View>
              <Pressable
                onPress={handleCopyAccount}
                className="flex-row items-center py-1.5 px-3 rounded-lg bg-white/10 active:bg-white/20"
              >
                {copied ? (
                  <>
                    <CheckCircle2
                      size={14}
                      color="#34D399"
                      className="mr-1.5"
                    />
                    <Text className="text-xs text-emerald-300 font-medium">
                      Disalin
                    </Text>
                  </>
                ) : (
                  <>
                    <Copy size={14} color="#93C5FD" className="mr-1.5" />
                    <Text className="text-xs text-blue-200 font-medium">
                      Salin
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </Card>

          {/* Quick Actions Grid */}
          <Text className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Layanan Cepat
          </Text>
          <View className="flex-row justify-between mb-6">
            <Pressable className="items-center flex-1">
              <View className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 items-center justify-center mb-1.5 shadow-sm">
                <Send size={22} color="#0066FF" />
              </View>
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Transfer
              </Text>
            </Pressable>

            <Pressable className="items-center flex-1">
              <View className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 items-center justify-center mb-1.5 shadow-sm">
                <QrCode size={22} color="#10B981" />
              </View>
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                QRIS
              </Text>
            </Pressable>

            <Pressable className="items-center flex-1">
              <View className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 items-center justify-center mb-1.5 shadow-sm">
                <Smartphone size={22} color="#9333EA" />
              </View>
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Top Up
              </Text>
            </Pressable>

            <Pressable className="items-center flex-1">
              <View className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 items-center justify-center mb-1.5 shadow-sm">
                <History size={22} color="#F59E0B" />
              </View>
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mutasi
              </Text>
            </Pressable>
          </View>

          {/* Account Profile Details */}
          <Card variant="elevated" className="w-full mb-6">
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Informasi Nasabah Terdaftar
              </Text>
              <ShieldCheck size={16} color="#10B981" />
            </View>

            <View className="space-y-2">
              <View className="flex-row justify-between py-1">
                <Text className="text-xs text-slate-500">NIK (Masked)</Text>
                <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {maskNIK(user.nik)}
                </Text>
              </View>
              <View className="flex-row justify-between py-1">
                <Text className="text-xs text-slate-500">Email</Text>
                <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user.email}
                </Text>
              </View>
              <View className="flex-row justify-between py-1">
                <Text className="text-xs text-slate-500">Nomor HP</Text>
                <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user.phoneNumber}
                </Text>
              </View>
            </View>
          </Card>

          {/* Logout Action */}
          <Button
            title="Keluar dari Aplikasi (Logout)"
            variant="outline"
            size="md"
            onPress={logout}
            leftIcon={<LogOut size={16} color="#EF4444" />}
            className="w-full border-rose-200 dark:border-rose-900/40"
            textClassName="text-rose-600 dark:text-rose-400"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // 2. Unauthenticated Welcome / Landing Screen
  // ----------------------------------------------------
  return (
    <SafeAreaView
      className="flex-1 bg-[#0A2540]"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6"
      >
        {/* Brand Banner Hero */}
        <View className="items-center pt-8">
          <View className="w-20 h-20 rounded-3xl bg-[#0066FF] items-center justify-center mb-4 shadow-2xl shadow-blue-500/50">
            <Landmark size={40} color="#FFFFFF" />
          </View>

          <Badge
            label="NEOCENTRA BANK MOBILE"
            variant="info"
            className="mb-3 bg-blue-900/60 border-blue-500/40"
            textClassName="text-blue-300 tracking-widest text-[10px]"
          />

          <Heading className="text-center text-3xl font-extrabold text-white mb-2">
            Perbankan Digital{"\n"}Generasi Baru
          </Heading>
          <Text className="text-center text-slate-300 text-sm max-w-[280px]">
            Solusi finansial cerdas, cepat, dan aman dengan standar enkripsi
            militer.
          </Text>
        </View>

        {/* Value Propositions */}
        <View className="my-8 space-y-3">
          <View className="flex-row items-center p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-3">
            <View className="w-10 h-10 rounded-xl bg-blue-500/20 items-center justify-center mr-3">
              <ShieldCheck size={20} color="#60A5FA" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-white">
                Keamanan Berlapis (KMS + FLE)
              </Text>
              <Text className="text-xs text-slate-400">
                Data sensitif dan transaksi Anda terenkripsi Google Tink
                AES-256.
              </Text>
            </View>
          </View>

          <View className="flex-row items-center p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-3">
            <View className="w-10 h-10 rounded-xl bg-emerald-500/20 items-center justify-center mr-3">
              <Sparkles size={20} color="#34D399" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-white">
                Buka Rekening 100% Online
              </Text>
              <Text className="text-xs text-slate-400">
                Cukup 3 menit verifikasi identitas e-KTP instan tanpa antre.
              </Text>
            </View>
          </View>

          <View className="flex-row items-center p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <View className="w-10 h-10 rounded-xl bg-purple-500/20 items-center justify-center mr-3">
              <ZapIcon />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-white">
                Transfer & QRIS Real-Time
              </Text>
              <Text className="text-xs text-slate-400">
                Bebas biaya admin transfer antar bank 24 jam nonstop.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <Button
            title="Masuk ke Akun"
            variant="primary"
            size="lg"
            onPress={() => router.push("/(auth)/login")}
            className="w-full bg-[#0066FF] shadow-lg shadow-blue-500/40 mb-3"
          />

          <Button
            title="Daftar Rekening Baru"
            variant="outline"
            size="lg"
            onPress={() => router.push("/(auth)/register")}
            className="w-full border-slate-600 bg-white/5"
            textClassName="text-white"
          />

          <View className="flex-row items-center justify-center pt-4">
            <Lock size={12} color="#94A3B8" className="mr-1.5" />
            <Text className="text-[11px] text-slate-400 text-center">
              Berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ZapIcon() {
  return (
    <View>
      <CreditCard size={20} color="#C084FC" />
    </View>
  );
}
