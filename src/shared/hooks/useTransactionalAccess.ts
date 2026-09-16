import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";
import { useDashboardStore } from "@/modules/dashboard/application/store/useDashboardStore";

export const useTransactionalAccess = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeAccount } = useDashboardStore();
  const [isGuardModalVisible, setIsGuardModalVisible] = useState(false);
  const [guardedActionName, setGuardedActionName] = useState("Transaksi");

  const hasActiveAccount = Boolean(
    activeAccount &&
    activeAccount.status === "ACTIVE" &&
    activeAccount.accountNumber
  );

  const executeGuardedAction = (
    targetRoute?: string,
    actionName: string = "Transaksi",
    onBlockedPrompt?: () => void
  ): boolean => {
    if (!hasActiveAccount) {
      if (onBlockedPrompt) {
        onBlockedPrompt();
      } else {
        setGuardedActionName(actionName);
        setIsGuardModalVisible(true);
      }
      return false;
    }

    if (targetRoute) {
      router.push(targetRoute as any);
    }
    return true;
  };

  const closeGuardModal = () => setIsGuardModalVisible(false);

  return {
    hasActiveAccount,
    executeGuardedAction,
    isGuardModalVisible,
    guardedActionName,
    closeGuardModal,
  };
};
