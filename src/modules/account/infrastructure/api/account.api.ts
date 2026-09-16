import { api } from "@/shared/infrastructure/http-client";
import { generateIdempotencyKey } from "@/shared/utils/idempotency";
import { HybridCryptoService } from "@/shared/security/hybridCryptoService";
import {
  generateRequestSignature,
  getDeviceSecurityMetadata,
} from "@/modules/auth/security/requestSigner";
import { Buffer } from "@craftzdog/react-native-buffer";
import { OpenAccountPayload, BankAccount } from "../../domain/entities/account.entity";
import { AccountMapper, AccountApiResponseDTO } from "../mappers/account.mapper";

export interface OpenAccountResponse {
  account: BankAccount;
  elevatedToken?: string;
  role?: string;
  message: string;
}

export interface VerifyPinResponse {
  isValid: boolean;
  transactionAuthToken?: string;
  expiresInSeconds?: number;
}

export class AccountApi {
  /**
   * Mengirimkan permohonan pembukaan rekening baru dengan enkripsi hybrid end-to-end,
   * security headers lengkap (SNAP BI signature, anti-replay, idempotency),
   * serta dekripsi respons biner server envelope.
   */
  public static async openAccount(payload: OpenAccountPayload): Promise<OpenAccountResponse> {
    const rawPayloadObj = {
      product_type: payload.productType,
      branch_code: payload.branchCode || "001",
      pin: payload.pin,
      employment_data: {
        occupation: payload.employmentData.occupation,
        monthly_income: payload.employmentData.monthlyIncome,
        source_of_funds: payload.employmentData.sourceOfFunds,
      },
    };

    // 1. Enkripsi hybrid data payload [RSA-OAEP 256B] + [IV 12B] + [Ciphertext] + [AuthTag 16B]
    const rawJsonStr = JSON.stringify(rawPayloadObj);
    const cryptoResult = HybridCryptoService.encryptPayloadWithKey(rawJsonStr);
    const binaryPayload = cryptoResult.binaryPayload;

    // 2. Siapkan security headers (Anti-Replay, HMAC-SHA256 Signature, Idempotency, Device Metadata)
    const timestamp = new Date().toISOString();
    const nonce = Math.random().toString(36).substring(2, 18);
    const idempotencyKey = generateIdempotencyKey();
    const correlationId = "corr_" + Math.random().toString(36).substring(2, 10);
    const deviceMeta = getDeviceSecurityMetadata();

    const signature = generateRequestSignature(
      "POST",
      "/api/v1/accounts/open",
      binaryPayload,
      timestamp,
      nonce
    );

    // 3. Kirim request dengan headers application/octet-stream
    const response = await api.post<ArrayBuffer>(
      "/api/v1/accounts/open",
      binaryPayload,
      {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/octet-stream",
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
      }
    );

    // 4. Dekripsi respons success biner melalui mekanisme Kunci Publik RSA Server (.env:L4)
    const decryptedJsonStr = HybridCryptoService.decryptServerEnvelope(
      new Uint8Array(response.data)
    );

    if (!decryptedJsonStr) {
      throw new Error("Gagal mendekripsi respons pembukaan rekening dari server");
    }

    const resObj = JSON.parse(decryptedJsonStr);
    const account = AccountMapper.toDomain(resObj.data);

    return {
      account,
      elevatedToken: resObj.session?.elevated_token,
      role: resObj.session?.role,
      message: resObj.message || "Rekening Neocentra berhasil dibuka",
    };
  }

  /**
   * Memverifikasi PIN transaksi sebelum eksekusi aksi finansial
   */
  public static async verifyPin(accountId: string, pin: string): Promise<VerifyPinResponse> {
    let encryptedPin = "";
    try {
      const cryptoResult = HybridCryptoService.encryptPayloadWithKey(pin);
      if (cryptoResult.binaryPayload && cryptoResult.binaryPayload.length > 0) {
        encryptedPin = Buffer.from(cryptoResult.binaryPayload).toString("base64");
      }
    } catch {
      // Ignored fallback
    }

    const response = await api.post<{
      success: boolean;
      message: string;
      data: {
        is_valid: boolean;
        transaction_auth_token?: string;
        expires_in_seconds?: number;
      };
    }>("/api/v1/accounts/verify-pin", {
      account_id: accountId,
      encrypted_pin: encryptedPin,
      pin: pin,
    });

    return {
      isValid: response.data.data.is_valid,
      transactionAuthToken: response.data.data.transaction_auth_token,
      expiresInSeconds: response.data.data.expires_in_seconds,
    };
  }
}
