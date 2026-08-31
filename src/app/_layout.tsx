if (__DEV__) {
  require("../../ReactotronConfig");
}
import { install } from "react-native-quick-crypto";
// Polyfill global.crypto for full compatibility
install();

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GluestackProvider } from "@/shared/components/ui";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import Reactotron from "reactotron-react-native";
import "@/shared/styles/global.css";

// Configure Reanimated Logger to disable strict mode checks that conflict with NativeWind runtime
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      }),
  );

  useEffect(() => {
    if (__DEV__) {
      console.log("Mencoba kirim log ke Reactotron...");
      Reactotron.log("Reactotron Berhasil Terhubung!");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </GluestackProvider>
    </QueryClientProvider>
  );
}
