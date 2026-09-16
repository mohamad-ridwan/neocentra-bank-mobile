import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Lock, Sparkles, X } from "lucide-react-native";
import { Button } from "@/shared/components/ui";

interface TransactionGuardModalProps {
  visible: boolean;
  onClose: () => void;
  actionName?: string;
}

export const TransactionGuardModal: React.FC<TransactionGuardModalProps> = ({
  visible,
  onClose,
  actionName = "Transaksi",
}) => {
  const router = useRouter();

  const handleOpenAccount = () => {
    onClose();
    router.push("/account/open-account");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end sm:justify-center items-center p-4">
        <View className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
          {/* Header & Close Button */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 items-center justify-center">
              <Lock size={24} color="#0066FF" />
            </View>
            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:opacity-70"
            >
              <X size={18} color="#94A3B8" />
            </Pressable>
          </View>

          {/* Body Text */}
          <Text className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
            Akses {actionName} Dikunci
          </Text>
          <Text className="text-sm text-slate-600 dark:text-slate-300 leading-5 mb-5">
            Anda belum memiliki rekening tabungan aktif di Neocentra Bank. Buka rekening pertama Anda dalam waktu 2 menit untuk membuka seluruh akses transaksi finansial instan.
          </Text>

          {/* Quick Perks */}
          <View className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 mb-6 border border-slate-100 dark:border-slate-700/50 space-y-2">
            <View className="flex-row items-center">
              <Sparkles size={16} color="#0066FF" className="mr-2" />
              <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Aktivasi instan tanpa setoran awal
              </Text>
            </View>
            <View className="flex-row items-center">
              <Sparkles size={16} color="#10B981" className="mr-2" />
              <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Bebas biaya transfer & bunga s.d 6% p.a.
              </Text>
            </View>
          </View>

          {/* Actions */}
          <Button
            title="Buka Rekening Sekarang"
            variant="primary"
            size="lg"
            onPress={handleOpenAccount}
            className="w-full bg-[#0066FF] mb-3"
          />

          <Button
            title="Nanti Saja"
            variant="ghost"
            size="md"
            onPress={onClose}
            className="w-full"
          />
        </View>
      </View>
    </Modal>
  );
};
