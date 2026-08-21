import React from "react";
import { View } from "react-native";
import { Landmark, ShieldCheck } from "lucide-react-native";
import { Badge, Caption, Heading, Text } from "@/shared/components/ui";

export interface AuthHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
}

export function AuthHeader({
  title,
  subtitle,
  badgeText = "Neocentra Digital Banking",
}: AuthHeaderProps) {
  return (
    <View className="items-center mb-6 pt-4">
      {/* Brand Icon Badge */}
      <View className="relative mb-3">
        <View className="w-16 h-16 rounded-2xl bg-gradient-to-br bg-[#0066FF] items-center justify-center shadow-lg shadow-blue-500/30">
          <Landmark size={32} color="#FFFFFF" />
        </View>
        <View className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white dark:border-slate-900">
          <ShieldCheck size={12} color="#FFFFFF" />
        </View>
      </View>

      {/* Security Level Badge */}
      <Badge
        label={badgeText}
        variant="info"
        className="mb-3"
      />

      {/* Main Title & Subtitle */}
      <Heading className="text-center text-2xl font-bold mb-1.5">
        {title}
      </Heading>
      <Text className="text-center text-sm text-slate-500 dark:text-slate-400 max-w-[320px]">
        {subtitle}
      </Text>
    </View>
  );
}
