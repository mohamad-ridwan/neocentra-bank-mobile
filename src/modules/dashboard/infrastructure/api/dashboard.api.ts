import { api } from "@/shared/infrastructure/http-client";
import { HybridCryptoService } from "@/shared/security/hybridCryptoService";
import { BankAccount } from "../../domain/entities/account.entity";
import { AccountBackendDTO, mapAccountDtoToEntity } from "../mappers/account.mapper";

export const dashboardApi = {
  getAccounts: async (customerId: string): Promise<BankAccount[]> => {
    // Call POST /api/v1/accounts with customer_id payload
    // Expect binary encrypted server envelope application/octet-stream response
    const response = await api.post<ArrayBuffer>(
      "/api/v1/accounts",
      { customer_id: customerId },
      {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/octet-stream",
        },
      }
    );

    const decryptedJsonStr = HybridCryptoService.decryptServerEnvelope(
      new Uint8Array(response.data)
    );
    const result = JSON.parse(decryptedJsonStr);

    // Backend responds with { status: "success", data: AccountBackendDTO[] } or direct array
    const accountsData: AccountBackendDTO[] = Array.isArray(result)
      ? result
      : result?.data || [];

    return accountsData.map(mapAccountDtoToEntity);
  },
};
