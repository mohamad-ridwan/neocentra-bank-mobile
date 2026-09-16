import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { dashboardApi } from "../../infrastructure/api/dashboard.api";
import { useDashboardStore } from "../store/useDashboardStore";

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
    if (query.data) {
      setAccounts(query.data);
    }
  }, [query.isLoading, query.data, setAccounts, setIsLoadingAccounts]);

  return query;
};
