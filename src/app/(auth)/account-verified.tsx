import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AccountVerifiedScreen } from "@/modules/auth/presentation/screens/AccountVerifiedScreen";

export default function AccountVerifiedPage() {
  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-[#0B0F19]"
      edges={["top", "left", "right"]}
    >
      <AccountVerifiedScreen />
    </SafeAreaView>
  );
}
