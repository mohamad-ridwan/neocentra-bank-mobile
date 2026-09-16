import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Settings, Bell, LogOut } from "lucide-react-native";
import { Subheading } from "@/shared/components/ui";
import { useColorScheme } from "@/shared/hooks/useColorScheme";

interface DashboardHeaderProps {
  fullName: string;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  fullName,
  onLogout,
}) => {
  const router = useRouter();
  const { isDark } = useColorScheme();

  return (
    <View className="flex-row items-center justify-between pt-4 pb-5">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-[#0066FF] items-center justify-center shadow-md mr-3">
          <Text className="text-white font-bold text-lg">
            {fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            Selamat Datang,
          </Text>
          <Subheading className="text-base font-bold text-slate-900 dark:text-white">
            {fullName}
          </Subheading>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => router.push("/settings")}
          className="w-10 h-10 rounded-xl bg-white dark:bg-neocentra-bg-cardDark border border-slate-200 dark:border-slate-800 items-center justify-center shadow-sm active:opacity-70"
          hitSlop={8}
        >
          <Settings size={18} color={isDark ? "#94A3B8" : "#64748B"} />
        </Pressable>
        <Pressable
          className="w-10 h-10 rounded-xl bg-white dark:bg-neocentra-bg-cardDark border border-slate-200 dark:border-slate-800 items-center justify-center shadow-sm active:opacity-70"
          hitSlop={8}
        >
          <Bell size={18} color={isDark ? "#94A3B8" : "#64748B"} />
        </Pressable>
        <Pressable
          onPress={onLogout}
          className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 items-center justify-center shadow-sm active:opacity-70"
          hitSlop={8}
        >
          <LogOut size={18} color="#EF4444" />
        </Pressable>
      </View>
    </View>
  );
};
