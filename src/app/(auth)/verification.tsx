import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { VerificationScreen } from "@/modules/auth/presentation/screens/VerificationScreen";

export default function VerificationPage() {
  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-[#0B0F19]"
      edges={["top", "left", "right"]}
    >
      <VerificationScreen />
    </SafeAreaView>
  );
}
