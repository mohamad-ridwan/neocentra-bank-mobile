import React, { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  Eye,
  Fingerprint,
  HardDrive,
  Info,
  Laptop,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Smartphone,
  Check,
} from "lucide-react-native";
import {
  Badge,
  Button,
  Card,
  Heading,
  Subheading,
  Toast,
} from "@/shared/components/ui";
import { useThemeStore, ThemeMode } from "@/shared/stores/useThemeStore";
import { useColorScheme } from "@/shared/hooks/useColorScheme";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";
import { formatCurrencyIDR } from "@/shared/utils/formatters";

export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, toggleTheme } = useThemeStore();
  const { isDark, colorScheme } = useColorScheme();
  const { isBiometricEnabled, toggleBiometric, user } = useAuthStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const themeOptions: {
    id: ThemeMode;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
  }[] = [
    {
      id: "light",
      title: "Mode Terang",
      description:
        "Tampilan cerah berlatar putih dengan kontras bersih untuk kenyamanan penggunaan siang hari.",
      icon: <Sun size={22} color="#F59E0B" />,
      badge: "Light",
    },
    {
      id: "dark",
      title: "Mode Gelap",
      description:
        "Tampilan gelap elegan berlatar Deep Navy (#0B0F19), nyaman di mata & hemat daya baterai.",
      icon: <Moon size={22} color="#60A5FA" />,
      badge: "Dark",
    },
    {
      id: "system",
      title: "Ikuti Sistem",
      description:
        "Menyesuaikan otomatis dengan tema dan jadwal mode gelap yang aktif di OS perangkat Anda.",
      icon: <Smartphone size={22} color="#10B981" />,
      badge: "Auto System",
    },
  ];

  const handleSelectTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    setToastMessage(
      `Tema berhasil diubah ke ${
        mode === "light"
          ? "Mode Terang"
          : mode === "dark"
            ? "Mode Gelap"
            : "Ikuti Sistem OS"
      } & tersimpan di storage.`,
    );
  };

  const handleResetStorage = () => {
    setThemeMode("system");
    setToastMessage(
      "Pengaturan tema berhasil direset ke setelan bawaan sistem.",
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-neocentra-bg-dark"
      edges={["top", "left", "right"]}
    >
      {/* Top Navigation Bar */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 items-center justify-center active:opacity-70"
          hitSlop={8}
        >
          <ArrowLeft size={20} color={isDark ? "#94A3B8" : "#0F172A"} />
        </Pressable>

        <View className="items-center">
          <Heading className="text-lg font-bold text-slate-900 dark:text-white">
            Pengaturan Aplikasi
          </Heading>
          <Text className="text-[11px] text-slate-500 dark:text-slate-400">
            Kustomisasi Tampilan & Preferensi
          </Text>
        </View>

        <View className="w-10 h-10 items-center justify-center">
          <View className="w-2.5 h-2.5 rounded-full bg-[#0066FF] shadow-sm shadow-blue-500/50" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 pt-4"
      >
        {toastMessage && (
          <Toast
            type="success"
            title="Pengaturan Disimpan"
            message={toastMessage}
            onDismiss={() => setToastMessage(null)}
          />
        )}

        {/* Section 1: Quick Theme Overview Banner */}
        <Card
          variant="elevated"
          className="w-full mb-6 bg-gradient-to-r from-blue-900 to-indigo-950 border border-blue-700/40"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-1">
                <Sparkles size={16} color="#60A5FA" className="mr-1.5" />
                <Text className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Status Tema Aktif
                </Text>
              </View>
              <Text className="text-xl font-bold text-white mb-1">
                {themeMode === "system"
                  ? `Sistem (${isDark ? "Gelap" : "Terang"})`
                  : themeMode === "dark"
                    ? "Mode Gelap Aktif"
                    : "Mode Terang Aktif"}
              </Text>
              <Text className="text-xs text-blue-200/80">
                Tersimpan sinkron di perangkat via{" "}
                <Text className="font-semibold text-blue-100">
                  react-native-mmkv
                </Text>
              </Text>
            </View>

            <View className="items-center">
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#CBD5E1", true: "#0066FF" }}
                thumbColor="#FFFFFF"
              />
              <Text className="text-[10px] text-blue-200 mt-1 font-medium">
                {isDark ? "Gelap" : "Terang"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Section 2: Mode Selection Option Cards */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Pilihan Skema Warna (Theme Mode)
            </Text>
            <Badge
              label={`${themeMode.toUpperCase()}`}
              variant="info"
              className="px-2 py-0.5"
            />
          </View>

          <View className="space-y-3">
            {themeOptions.map((opt) => {
              const isSelected = themeMode === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => handleSelectTheme(opt.id)}
                  className={`p-4 rounded-2xl border mb-3 ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-blue-950/30 border-[#0066FF]"
                      : "bg-white dark:bg-neocentra-bg-cardDark border-slate-200/80 dark:border-slate-800"
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1 mr-3">
                      <View
                        className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${
                          isSelected
                            ? "bg-blue-100 dark:bg-blue-900/50"
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      >
                        {opt.icon}
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-center mb-0.5">
                          <Text
                            className={`font-bold text-base mr-2 ${
                              isSelected
                                ? "text-[#0066FF] dark:text-blue-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {opt.title}
                          </Text>
                          {isSelected && (
                            <Badge
                              label="Aktif"
                              variant="success"
                              className="px-2 py-0.5"
                            />
                          )}
                        </View>
                        <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {opt.description}
                        </Text>
                      </View>
                    </View>

                    {/* Radio Indicator */}
                    <View
                      className={`w-6 h-6 rounded-full border items-center justify-center mt-1 ${
                        isSelected
                          ? "bg-[#0066FF] border-[#0066FF]"
                          : "border-slate-300 dark:border-slate-700 bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section 3: Live Real-time UI Preview */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            Pratinjau Tampilan Komponen (Live Preview)
          </Text>

          <Card variant="elevated" className="w-full">
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <View className="flex-row items-center">
                <Eye size={16} color="#0066FF" className="mr-2" />
                <Text className="text-xs font-bold text-slate-900 dark:text-white">
                  Contoh Komponen Rekening Nasabah
                </Text>
              </View>
              <Badge
                label={isDark ? "DARK THEME" : "LIGHT THEME"}
                variant={isDark ? "info" : "neutral"}
              />
            </View>

            <View className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-3">
              <Text className="text-[11px] text-slate-500 dark:text-slate-400">
                Saldo Demo Neocentra
              </Text>
              <Text className="text-xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrencyIDR(45750000)}
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Button
                title="Tombol Utama"
                variant="primary"
                size="sm"
                className="flex-1"
              />
              <Button
                title="Tombol Sekunder"
                variant="secondary"
                size="sm"
                className="flex-1"
              />
            </View>
          </Card>
        </View>

        {/* Section 4: Security Preferences */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            Preferensi Keamanan & Autentikasi
          </Text>

          <Card variant="default" className="w-full">
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 items-center justify-center mr-3 border border-emerald-100 dark:border-emerald-900/40">
                  <Fingerprint size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                    Masuk Biometrik (Face ID / Sidik Jari)
                  </Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                    Akses cepat tanpa perlu mengetik ulang password akun.
                  </Text>
                </View>
              </View>

              <Switch
                value={isBiometricEnabled}
                onValueChange={() => toggleBiometric()}
                trackColor={{ false: "#CBD5E1", true: "#10B981" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row items-center pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <ShieldCheck size={16} color="#10B981" className="mr-2" />
              <Text className="text-xs text-slate-500 dark:text-slate-400 flex-1">
                Kunci KMS Google Tink & FLE aktif melindungi data akun.
              </Text>
            </View>
          </Card>
        </View>

        {/* Section 5: Storage & App Info */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            Informasi Sistem & Penyimpanan
          </Text>

          <Card variant="default" className="w-full">
            <View className="flex-row items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <View className="flex-row items-center">
                <HardDrive size={16} color="#64748B" className="mr-2.5" />
                <Text className="text-xs text-slate-600 dark:text-slate-400">
                  Engine Penyimpanan Lokal
                </Text>
              </View>
              <Text className="text-xs font-semibold text-[#0066FF] dark:text-blue-400">
                react-native-mmkv (C++ Nitro)
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <View className="flex-row items-center">
                <Database size={16} color="#64748B" className="mr-2.5" />
                <Text className="text-xs text-slate-600 dark:text-slate-400">
                  Status Reaktivitas State
                </Text>
              </View>
              <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Zustand Reactive Store
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Info size={16} color="#64748B" className="mr-2.5" />
                <Text className="text-xs text-slate-600 dark:text-slate-400">
                  Versi Aplikasi
                </Text>
              </View>
              <Text className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                v1.0.0 (Build 2026.08)
              </Text>
            </View>
          </Card>
        </View>

        {/* Section 6: Reset Preferences Action */}
        <Button
          title="Reset Pengaturan Tema ke Bawaan"
          variant="outline"
          size="md"
          onPress={handleResetStorage}
          leftIcon={RotateCcw}
          className="w-full mb-3"
          textClassName="text-slate-700 dark:text-slate-300"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
