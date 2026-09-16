import { api } from "@/shared/infrastructure/http-client";
import { generateIdempotencyKey } from "@/shared/utils/idempotency";
import { HybridCryptoService } from "@/shared/security/hybridCryptoService";
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
   * Mengirimkan permohonan pembukaan rekening baru dengan enkripsi PIN & Idempotency Key
   */
  public static async openAccount(payload: OpenAccountPayload): Promise<OpenAccountResponse> {
    let encryptedPin = "";
    try {
      const cryptoResult = HybridCryptoService.encryptPayloadWithKey(payload.pin);
      if (cryptoResult.binaryPayload && cryptoResult.binaryPayload.length > 0) {
        encryptedPin = Buffer.from(cryptoResult.binaryPayload).toString("base64");
      }
    } catch (e) {
      console.warn("[AccountApi] Warning: Gagal mengenkripsi PIN via HybridCryptoService, mengirim fallback:", e);
    }

    const idempotencyKey = generateIdempotencyKey();

    const requestBody = {
      product_type: payload.productType,
      branch_code: payload.branchCode || "001",
      encrypted_pin: encryptedPin,
      pin: payload.pin, // plain fallback jika gateway lokal
      employment_data: {
        occupation: payload.employmentData.occupation,
        monthly_income: payload.employmentData.monthlyIncome,
        source_of_funds: payload.employmentData.sourceOfFunds,
      },
    };

    const response = await api.post<{
      success: boolean;
      message: string;
      data: AccountApiResponseDTO;
      session?: {
        elevated_token: string;
        role: string;
      };
    }>("/api/v1/accounts/open", requestBody, {
      headers: {
        "X-Idempotency-Key": idempotencyKey,
      },
    });

    const account = AccountMapper.toDomain(response.data.data);

    return {
      account,
      elevatedToken: response.data.session?.elevated_token,
      role: response.data.session?.role,
      message: response.data.message,
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
