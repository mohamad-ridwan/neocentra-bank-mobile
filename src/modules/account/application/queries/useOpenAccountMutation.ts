import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountApi, OpenAccountResponse } from "../../infrastructure/api/account.api";
import { OpenAccountPayload } from "../../domain/entities/account.entity";
import { useDashboardStore } from "@/modules/dashboard/application/store/useDashboardStore";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";
import { httpClient } from "@/shared/infrastructure/http-client";
import { secureTokenStorage } from "@/shared/infrastructure/storage";

export const useOpenAccountMutation = () => {
  const queryClient = useQueryClient();
  const { setActiveAccount, accounts, setAccounts } = useDashboardStore();
  const { user, setUser } = useAuthStore();

  return useMutation<OpenAccountResponse, Error, OpenAccountPayload>({
    mutationFn: (payload: OpenAccountPayload) => AccountApi.openAccount(payload),
    onSuccess: (response) => {
      // 1. Perbarui state akun di Dashboard Store secara instan
      setActiveAccount(response.account);
      setAccounts([...accounts, response.account]);

      // 2. Elevasi Sesi Pengguna jika menerima elevated token baru
      if (response.elevatedToken) {
        httpClient.setAuthToken(response.elevatedToken);
        secureTokenStorage.saveAccessToken(response.elevatedToken, 1440);
      }

      if (user) {
        setUser({
          ...user,
          status: "ACTIVE",
          accountNumber: response.account.accountNumber,
          balance: response.account.balance,
        });
      }

      // 3. Invalidate query cache agar data sinkron dengan server
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
