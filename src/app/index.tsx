import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";
import { DashboardScreen } from "@/modules/dashboard/presentation/screens/DashboardScreen";
import { LandingScreen } from "@/modules/dashboard/presentation/screens/LandingScreen";

export default function EntryScreen() {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Hide splash once the initial layout is ready
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  if (isAuthenticated && user) {
    return <DashboardScreen />;
  }

  return <LandingScreen />;
}
