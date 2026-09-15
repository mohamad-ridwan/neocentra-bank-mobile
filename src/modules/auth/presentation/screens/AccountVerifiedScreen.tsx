import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { CheckCircle2, LogIn, Sparkles } from "lucide-react-native";
import { Button, Card, Heading } from "@/shared/components/ui";

export function AccountVerifiedScreen() {
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      className="flex-1 px-5"
    >
      <View className="items-center py-6">
        {/* Success Icon Circle */}
        <View className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/50 items-center justify-center mb-6 border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
          <CheckCircle2 size={56} color="#10B981" />
        </View>

        {/* Title */}
        <Heading className="text-center text-2xl font-bold mb-3 text-slate-900 dark:text-white">
          Akun telah berhasil di verifikasi
        </Heading>

        {/* Description */}
        <Text className="text-center text-sm text-slate-600 dark:text-slate-300 max-w-[340px] mb-8 leading-relaxed">
          Sekarang kamu bisa mengakses fitur NeoCentra, Kamu juga bisa membuat rekening didalamnya
        </Text>

        {/* Feature Highlight Card */}
        <Card variant="elevated" className="w-full mb-8 p-5">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 items-center justify-center mr-3 border border-blue-100 dark:border-blue-900">
              <Sparkles size={18} color="#0066FF" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Fitur Lengkap Terbuka
              </Text>
              <Text className="text-[11px] text-slate-500 dark:text-slate-400">
                Pembukaan rekening digital, transfer seketika, dan manajemen tabungan.
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Button */}
        <Button
          title="Masuk ke Akun"
          variant="primary"
          size="lg"
          onPress={() => router.replace("/(auth)/login")}
          leftIcon={LogIn}
          className="w-full shadow-lg"
        />
      </View>
    </ScrollView>
  );
}
