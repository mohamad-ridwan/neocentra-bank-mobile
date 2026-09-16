import React from "react";
import { View, Text } from "react-native";
import { ShieldCheck } from "lucide-react-native";
import { Card } from "@/shared/components/ui";
import { maskNIK } from "@/shared/utils/formatters";

interface CustomerProfileCardProps {
  nik: string;
  email: string;
  phoneNumber: string;
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({
  nik,
  email,
  phoneNumber,
}) => {
  return (
    <Card variant="elevated" className="w-full mb-6">
      <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Informasi Nasabah Terdaftar
        </Text>
        <ShieldCheck size={16} color="#10B981" />
      </View>

      <View className="space-y-2">
        <View className="flex-row justify-between py-1">
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            NIK (Masked)
          </Text>
          <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {maskNIK(nik)}
          </Text>
        </View>
        <View className="flex-row justify-between py-1">
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            Email
          </Text>
          <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {email}
          </Text>
        </View>
        <View className="flex-row justify-between py-1">
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            Nomor HP
          </Text>
          <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {phoneNumber}
          </Text>
        </View>
      </View>
    </Card>
  );
};
