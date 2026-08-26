"use client";
import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useThemeStore } from "@/shared/stores/useThemeStore";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";

export interface GluestackProviderProps {
  children: React.ReactNode;
  mode?: "light" | "dark" | "system";
}

export function GluestackProvider({ children, mode }: GluestackProviderProps) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);

  const activeMode = mode || themeMode;

  // Sync theme mode with NativeWind via React effect safely
  useEffect(() => {
    if (activeMode && colorScheme !== activeMode) {
      setColorScheme(activeMode);
    }
  }, [activeMode, colorScheme, setColorScheme]);

  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#0B0F19" : "#F8FAFC";

  return (
    <SafeAreaProvider>
      <View
        // className={isDark ? "dark" : ""}
        style={{ flex: 1, backgroundColor }}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? "#0B0F19" : "#F8FAFC"}
          animated
        />
        <OverlayProvider>
          <ToastProvider>{children}</ToastProvider>
        </OverlayProvider>
      </View>
    </SafeAreaProvider>
  );
}

// GluestackUIProvider alias for Gluestack UI v4 convention
export const GluestackUIProvider = GluestackProvider;
