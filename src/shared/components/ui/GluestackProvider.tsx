import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/shared/hooks/useColorScheme";

export interface GluestackProviderProps {
  children: React.ReactNode;
}

export function GluestackProvider({ children }: GluestackProviderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaProvider>
      <View className={`flex-1 ${isDark ? "dark bg-[#0B0F19]" : "bg-[#F8FAFC]"}`}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? "#0B0F19" : "#F8FAFC"}
        />
        {children}
      </View>
    </SafeAreaProvider>
  );
}
