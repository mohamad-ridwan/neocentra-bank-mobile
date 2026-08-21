import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/shared/hooks/useColorScheme";
import { useThemeStore } from "@/shared/stores/useThemeStore";
import { colorScheme as nwColorScheme } from "nativewind";

export interface GluestackProviderProps {
  children: React.ReactNode;
}

export function GluestackProvider({ children }: GluestackProviderProps) {
  const { isDark } = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);

  // Sync theme mode on mount and when changed
  useEffect(() => {
    nwColorScheme.set(themeMode);
  }, [themeMode]);

  return (
    <SafeAreaProvider>
      <View
        className={`flex-1 ${isDark ? "dark bg-[#0B0F19]" : "bg-[#F8FAFC]"}`}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? "#0B0F19" : "#F8FAFC"}
          animated
        />
        {children}
      </View>
    </SafeAreaProvider>
  );
}
