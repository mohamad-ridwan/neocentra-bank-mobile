import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  Copy,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Send,
  QrCode,
  Smartphone,
} from "lucide-react-native";
import { Button, Card, Badge } from "@/shared/components/ui";
import { useDashboardStore } from "@/modules/dashboard/application/store/useDashboardStore";
import { useOpenAccountStore } from "../../application/store/useOpenAccountStore";
import * as Clipboard from "expo-clipboard";

export const AccountSuccessScreen: React.FC = () => {
  const router = useRouter();
  const { activeAccount } = useDashboardStore();
  const { resetWizard } = useOpenAccountStore();
  const [copied, setCopied] = useState(false);

  const accountNumber = activeAccount?.accountNumber || "001108472914";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    resetWizard();
    router.replace("/");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-neocentra-bg-dark"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon & Celebration Title */}
        <View className="items-center mt-6 mb-6">
          <View className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={44} color="#10B981" />
          </View>
          <Text className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-2">
            Rekening Berhasil Dibuka!
          </Text>
          <Text className="text-xs text-slate-600 dark:text-slate-400 text-center max-w-[300px] leading-5">
            Selamat, rekening Neocentra Bank Anda kini telah aktif dan siap digunakan untuk berbagai transaksi finansial.
          </Text>
        </View>

        {/* Account Details Card */}
        <Card className="w-full bg-[#0A2540] dark:bg-neocentra-navy-dark border border-blue-900/50 p-6 rounded-3xl mb-6 shadow-xl">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Landmark size={18} color="#60A5FA" className="mr-2" />
              <Text className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                Tabungan Utama Neocentra
              </Text>
            </View>
            <Badge label="AKTIF" variant="success" />
          </View>

          <Text className="text-xs text-blue-200/70 mb-1">Nomor Rekening Anda</Text>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-mono font-black text-white tracking-widest">
              {accountNumber}
            </Text>
            <Pressable
              onPress={handleCopy}
              className="flex-row items-center py-1.5 px-3 rounded-lg bg-white/10 active:bg-white/20"
            >
              <Copy size={14} color="#93C5FD" className="mr-1.5" />
              <Text className="text-xs text-blue-200 font-medium">
                {copied ? "Disalin" : "Salin"}
              </Text>
            </Pressable>
          </View>

          <View className="pt-3 border-t border-blue-900/60 flex-row justify-between items-center">
            <View>
              <Text className="text-[11px] text-blue-200/60">Mata Uang</Text>
              <Text className="text-xs font-bold text-white">IDR (Rupiah)</Text>
            </View>
            <View className="items-end">
              <Text className="text-[11px] text-blue-200/60">Saldo Awal</Text>
              <Text className="text-xs font-bold text-emerald-400">Rp 0</Text>
            </View>
          </View>
        </Card>

        {/* Unlocked Features Info */}
        <Text className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Akses Transaksi Terbuka
        </Text>

        <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 mb-6 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 items-center justify-center mr-3">
              <Send size={16} color="#0066FF" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Transfer Antarbank BI-FAST
              </Text>
              <Text className="text-[11px] text-slate-500">
                Transfer instan ke seluruh bank di Indonesia
              </Text>
            </View>
            <ShieldCheck size={16} color="#10B981" />
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 items-center justify-center mr-3">
              <QrCode size={16} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Pembayaran QRIS
              </Text>
              <Text className="text-[11px] text-slate-500">
                Scan & bayar instan di jutaan merchant nasional
              </Text>
            </View>
            <ShieldCheck size={16} color="#10B981" />
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 items-center justify-center mr-3">
              <Smartphone size={16} color="#9333EA" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Top Up E-Wallet & Tagihan
              </Text>
              <Text className="text-[11px] text-slate-500">
                Isi saldo GoPay, OVO, ShopeePay & pulsa
              </Text>
            </View>
            <ShieldCheck size={16} color="#10B981" />
          </View>
        </View>

        {/* Action Button */}
        <Button
          title="Masuk ke Beranda & Mulai Transaksi"
          variant="primary"
          size="lg"
          rightIcon={ArrowRight}
          onPress={handleFinish}
          className="w-full bg-[#0066FF]"
        />
      </ScrollView>
    </SafeAreaView>
  );
};
