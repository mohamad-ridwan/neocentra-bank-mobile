import { api } from "@/shared/infrastructure/http-client";
import { generateIdempotencyKey } from "@/shared/utils/idempotency";
import { HybridCryptoService } from "@/shared/security/hybridCryptoService";
import {
  generateRequestSignature,
  getDeviceSecurityMetadata,
} from "@/modules/auth/security/requestSigner";
import { Buffer } from "@craftzdog/react-native-buffer";
import { BankAccount } from "../../domain/entities/account.entity";
import {
  AccountBackendDTO,
  mapAccountDtoToEntity,
} from "../mappers/account.mapper";

export const dashboardApi = {
  getAccounts: async (customerId: string): Promise<BankAccount[]> => {
    // Siapkan raw JSON string & binary payload untuk signature calculation
    const payloadObj = { customer_id: customerId };
    const rawJsonStr = JSON.stringify(payloadObj);
    const bodyBinary = new Uint8Array(Buffer.from(rawJsonStr, "utf8"));

    const timestamp = new Date().toISOString();
    const nonce = Math.random().toString(36).substring(2, 18);
    const idempotencyKey = generateIdempotencyKey();
    const correlationId = "corr_" + Math.random().toString(36).substring(2, 10);
    const deviceMeta = getDeviceSecurityMetadata();

    const signature = generateRequestSignature(
      "POST",
      "/api/v1/accounts",
      bodyBinary,
      timestamp,
      nonce,
    );

    // Call POST /api/v1/accounts with customer_id payload and security headers
    // Expect binary encrypted server envelope application/octet-stream response
    const response = await api.post<ArrayBuffer>(
      "/api/v1/accounts",
      payloadObj,
      {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          "X-Signature": signature,
          "X-Timestamp": timestamp,
          "X-Nonce": nonce,
          "X-Key-Id": "KMS-LOCAL-KEY-V1",
          "X-Device-Id": deviceMeta.deviceId,
          "X-Device-Model": deviceMeta.deviceModel,
          "X-Device-OS": deviceMeta.deviceOS,
          "X-App-Version": deviceMeta.appVersion,
          "X-App-Build": deviceMeta.appBuild,
          "X-Channel-Id": deviceMeta.channelId,
          "X-Correlation-Id": correlationId,
          "X-Idempotency-Key": idempotencyKey,
          "Accept-Language": "id-ID",
          Accept: "application/octet-stream",
        },
      },
    );

    const decryptedJsonStr = HybridCryptoService.decryptServerEnvelope(
      new Uint8Array(response.data),
    );
    const result = JSON.parse(decryptedJsonStr);

    // Backend responds with { success: true, data: AccountBackendDTO[] } or direct array
    const accountsData: AccountBackendDTO[] = Array.isArray(result)
      ? result
      : result?.data || [];

    return accountsData.map(mapAccountDtoToEntity);
  },
};
