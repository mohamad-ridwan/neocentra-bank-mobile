import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { CreditCard, Sparkles, ShieldCheck } from "lucide-react-native";
import { Card, Button, Badge } from "@/shared/components/ui";

export const OpenAccountCard: React.FC = () => {
  const router = useRouter();

  return (
    <Card className="w-full bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 border border-blue-500/30 p-6 rounded-3xl mb-6 shadow-xl">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <CreditCard size={20} color="#60A5FA" className="mr-2" />
          <Text className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
            Rekening Tabungan
          </Text>
        </View>
        <Badge label="BELUM ADA REKENING" variant="warning" />
      </View>

      <Text className="text-xl font-extrabold text-white mb-2">
        Buka Rekening Pertama Anda
      </Text>
      <Text className="text-xs text-blue-100/80 leading-5 mb-4">
        Nikmati kemudahan transaksi digital instan, bebas biaya admin transfer, dan bunga kompetitif dengan membuka rekening Neocentra.
      </Text>

      <View className="bg-white/5 rounded-xl p-3 mb-4 space-y-1.5 border border-white/10">
        <View className="flex-row items-center">
          <Sparkles size={14} color="#60A5FA" className="mr-2" />
          <Text className="text-xs text-slate-200">
            Aktivasi rekening instan tanpa syarat saldo awal
          </Text>
        </View>
        <View className="flex-row items-center">
          <ShieldCheck size={14} color="#34D399" className="mr-2" />
          <Text className="text-xs text-slate-200">
            Dijamin LPS & diawasi oleh Otoritas Jasa Keuangan
          </Text>
        </View>
      </View>

      <Button
        title="Buka Rekening Sekarang"
        variant="primary"
        size="md"
        onPress={() => {
          router.push("/account/open-account");
        }}
        className="w-full bg-[#0066FF]"
      />
    </Card>
  );
};
