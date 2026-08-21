import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginScreen } from "@/modules/auth/presentation/screens/LoginScreen";

export default function LoginPage() {
  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-[#0B0F19]"
      edges={["top", "left", "right"]}
    >
      <LoginScreen />
    </SafeAreaView>
  );
}
