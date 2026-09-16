import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { dashboardApi } from "../../infrastructure/api/dashboard.api";
import { useDashboardStore } from "../store/useDashboardStore";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";

export const useAccountsQuery = (customerId: string | undefined) => {
  const { setAccounts, setIsLoadingAccounts } = useDashboardStore();

  const query = useQuery({
    queryKey: ["accounts", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      return await dashboardApi.getAccounts(customerId);
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  useEffect(() => {
    setIsLoadingAccounts(query.isLoading);
  }, [query.isLoading, setIsLoadingAccounts]);

  useEffect(() => {
    if (query.data) {
      setAccounts(query.data);

      // Sinkronisasi RBAC & Status Rekening:
      // Hanya update jika terdapat perubahan status/accountNumber/balance
      const active = query.data.find((a) => a.status === "ACTIVE");
      const currentUser = useAuthStore.getState().user;
      if (
        active &&
        currentUser &&
        (currentUser.status !== "ACTIVE" ||
          currentUser.accountNumber !== active.accountNumber ||
          currentUser.balance !== active.balance)
      ) {
        useAuthStore.getState().setUser({
          ...currentUser,
          status: "ACTIVE",
          accountNumber: active.accountNumber,
          balance: active.balance,
        });
      }
    }
  }, [query.data, setAccounts]);

  return query;
};
