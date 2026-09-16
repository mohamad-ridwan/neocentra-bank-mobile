import React from "react";
import { View, Text, Pressable } from "react-native";
import { Send, QrCode, Smartphone, History } from "lucide-react-native";

export const QuickActionsGrid: React.FC = () => {
  return (
    <>
      <Text className="text-sm font-bold text-slate-900 dark:text-white mb-3">
        Layanan Cepat
      </Text>
      <View className="flex-row justify-between mb-6">
        <Pressable className="items-center flex-1 active:opacity-75">
          <View className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 items-center justify-center mb-1.5 shadow-sm">
            <Send size={22} color="#0066FF" />
          </View>
          <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Transfer
          </Text>
        </Pressable>

        <Pressable className="items-center flex-1 active:opacity-75">
          <View className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 items-center justify-center mb-1.5 shadow-sm">
            <QrCode size={22} color="#10B981" />
          </View>
          <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            QRIS
          </Text>
        </Pressable>

        <Pressable className="items-center flex-1 active:opacity-75">
          <View className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 items-center justify-center mb-1.5 shadow-sm">
            <Smartphone size={22} color="#9333EA" />
          </View>
          <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Top Up
          </Text>
        </Pressable>

        <Pressable className="items-center flex-1 active:opacity-75">
          <View className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 items-center justify-center mb-1.5 shadow-sm">
            <History size={22} color="#F59E0B" />
          </View>
          <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Mutasi
          </Text>
        </Pressable>
      </View>
    </>
  );
};
