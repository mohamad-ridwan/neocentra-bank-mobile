import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Landmark,
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  Settings,
} from "lucide-react-native";
import { Badge, Button, Card, Heading } from "@/shared/components/ui";
import { useColorScheme } from "@/shared/hooks/useColorScheme";

export const LandingScreen: React.FC = () => {
  const router = useRouter();
  const { isDark } = useColorScheme();

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-neocentra-bg-dark"
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
        {/* Top Header Bar with Settings Navigation */}
        <View className="flex-row items-center justify-between pt-2 pb-2">
          <View className="flex-row items-center">
            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Neocentra Digital Bank
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/settings")}
            className="flex-row items-center px-3 py-2 rounded-xl bg-white dark:bg-neocentra-bg-cardDark border border-slate-200 dark:border-slate-800 shadow-sm active:opacity-70"
            hitSlop={8}
          >
            <Settings
              size={15}
              color={isDark ? "#94A3B8" : "#64748B"}
              className="mr-2"
            />
            <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pengaturan
            </Text>
          </Pressable>
        </View>

        {/* Brand Banner Hero */}
        <View className="items-center pt-4">
          <View className="w-20 h-20 rounded-3xl bg-[#0066FF] items-center justify-center mb-4 shadow-2xl">
            <Landmark size={40} color="#FFFFFF" />
          </View>

          <Badge
            label="NEOCENTRA BANK MOBILE"
            variant="info"
            className="mb-3"
            textClassName="tracking-widest text-[10px]"
          />

          <Heading className="text-center text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Perbankan Digital{"\n"}Generasi Baru
          </Heading>
          <Text className="text-center text-slate-600 dark:text-slate-400 text-sm max-w-[280px]">
            Solusi finansial cerdas, cepat, dan aman dengan standar enkripsi
            militer.
          </Text>
        </View>

        {/* Value Propositions */}
        <View className="my-6 space-y-3">
          <Card
            variant="default"
            className="flex-row items-center p-4 rounded-2xl mb-3"
          >
            <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 items-center justify-center mr-3">
              <ShieldCheck size={20} color="#0066FF" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                Keamanan Berlapis (KMS + FLE)
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Data sensitif dan transaksi Anda terenkripsi Google Tink
                AES-256.
              </Text>
            </View>
          </Card>

          <Card
            variant="default"
            className="flex-row items-center p-4 rounded-2xl mb-3"
          >
            <View className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 items-center justify-center mr-3">
              <Sparkles size={20} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                Buka Rekening 100% Online
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Cukup 3 menit verifikasi identitas e-KTP instan tanpa antre.
              </Text>
            </View>
          </Card>

          <Card
            variant="default"
            className="flex-row items-center p-4 rounded-2xl"
          >
            <View className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 items-center justify-center mr-3">
              <Zap size={20} color="#9333EA" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                Transfer & QRIS Real-Time
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Bebas biaya admin transfer antar bank 24 jam nonstop.
              </Text>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <Button
            title="Masuk ke Akun"
            variant="primary"
            size="lg"
            onPress={() => router.push("/(auth)/login")}
            className="w-full bg-[#0066FF] shadow-lg mb-3"
          />

          <Button
            title="Daftar Akun"
            variant="secondary"
            size="lg"
            onPress={() => router.push("/(auth)/register")}
            className="w-full border border-slate-200 dark:border-slate-800"
          />

          <View className="flex-row items-center justify-center pt-4">
            <Lock
              size={12}
              color={isDark ? "#94A3B8" : "#64748B"}
              className="mr-2"
            />
            <Text className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
              Berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
