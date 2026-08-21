import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterScreen } from "@/modules/auth/presentation/screens/RegisterScreen";

export default function RegisterPage() {
  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-[#0B0F19]"
      edges={["top", "left", "right"]}
    >
      <RegisterScreen />
    </SafeAreaView>
  );
}
