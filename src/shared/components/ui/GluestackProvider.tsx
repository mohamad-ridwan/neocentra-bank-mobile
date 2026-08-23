import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useThemeStore } from "@/shared/stores/useThemeStore";

export interface GluestackProviderProps {
  children: React.ReactNode;
}

export function GluestackProvider({ children }: GluestackProviderProps) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);

  // Sync theme mode with NativeWind via React effect safely
  useEffect(() => {
    if (themeMode && colorScheme !== themeMode) {
      setColorScheme(themeMode);
    }
  }, [themeMode, colorScheme, setColorScheme]);

  const isDark = colorScheme === "dark";

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
