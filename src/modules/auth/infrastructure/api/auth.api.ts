import { api } from "@/shared/infrastructure/http-client";
import { generateIdempotencyKey } from "@/shared/utils/idempotency";
import { User } from "@/modules/auth/domain/entities/user.entity";
import { LoginFormData } from "@/modules/auth/domain/schemas/login.schema";
import {
  generateRequestSignature,
  getDeviceSecurityMetadata,
} from "../../security/requestSigner";
import {
  BackendCustomerDTO,
  RequestCustomerLoginPayload,
  RequestCustomerRegisterBinary,
  RequestCustomerRegisterPayload,
  UserMapper,
} from "../mappers/user.mapper";
import { HybridCryptoService } from "@/shared/security/hybridCryptoService";

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface RegisterResponse {
  email: string;
  verificationToken: string;
  message: string;
}

export interface VerifyCustomerPayload {
  verificationToken: string;
  code: string;
}

export interface VerifyCustomerResponse {
  success: boolean;
  message: string;
}

export class AuthApi {
  /**
   * Logs in an existing customer via binary transit payload (Hybrid RSA-OAEP + AES-GCM)
   */
  public static async login(
    data: RequestCustomerLoginPayload,
  ): Promise<LoginResponse> {
    const timestamp = new Date().toISOString();
    const nonce = Math.random().toString(36).substring(2, 18);
    const idempotencyKey = generateIdempotencyKey();
    const correlationId =
      "corr_" + Math.random().toString(36).substring(2, 10);
    const deviceMeta = getDeviceSecurityMetadata();

    const signature = generateRequestSignature(
      "POST",
      "/api/v1/customers/login",
      data.binaryPayload,
      timestamp,
      nonce,
    );

    const response = await api.post(
      "/api/v1/customers/login",
      data.binaryPayload,
      {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/octet-stream",
          "Accept": "application/octet-stream",
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
        },
      },
    );

    const decryptedJsonStr = HybridCryptoService.decryptTransitResponse(
      new Uint8Array(response.data),
      data.sessionKey,
    );

    if (!decryptedJsonStr) {
      throw new Error("Gagal mendekripsi respons otentikasi dari server");
    }

    const payload = JSON.parse(decryptedJsonStr);
    const token = payload.access_token || payload.token || "";
    const rawUser: BackendCustomerDTO = {
      customer_id: payload.customer_id,
      nik: payload.nik,
      full_name: payload.full_name,
      email: payload.email,
      phone_number: payload.phone_number,
      status: payload.status,
      account_number: payload.account_number,
      balance: payload.balance,
      created_at: payload.created_at,
    };

    const user = UserMapper.toDomain(rawUser);

    return {
      user,
      token,
      message: "Login berhasil!",
    };
  }

  /**
   * Registers a new customer
   */
  public static async register(
    data: RequestCustomerRegisterBinary,
  ): Promise<RegisterResponse> {
    const isStructured = "binaryPayload" in data;
    const binaryPayload = isStructured ? data.binaryPayload : data;
    const fallbackEmail = isStructured ? data.fallbackEmail : undefined;

    try {
      const timestamp = new Date().toISOString();
      const nonce = Math.random().toString(36).substring(2, 18);
      const idempotencyKey = generateIdempotencyKey();
      const correlationId =
        "corr_" + Math.random().toString(36).substring(2, 10);
      const deviceMeta = getDeviceSecurityMetadata();

      const signature = generateRequestSignature(
        "POST",
        "/api/v1/customers/register",
        binaryPayload,
        timestamp,
        nonce,
      );

      const response = await api.post<{
        success: boolean;
        message?: string;
        data?: {
          email?: string;
          verificationToken?: string;
        };
      }>("/api/v1/customers/register", binaryPayload, {
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
        },
      });

      const maskedEmail =
        response.data?.data?.email ||
        (fallbackEmail
          ? fallbackEmail.replace(/^(.)(.*)(.@.*)$/, "$1***$3")
          : "u***r@domain.com");
      const verificationToken =
        response.data?.data?.verificationToken || "mock_verification_jwt_token";

      return {
        email: maskedEmail,
        verificationToken,
        message:
          response.data.message ||
          "Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.",
      };
    } catch (err: any) {
      if (
        err.message &&
        (err.message.includes("Network Error") ||
          err.message.includes("Gagal terhubung"))
      ) {
        await new Promise((r) => setTimeout(r, 700));
        return {
          email: fallbackEmail
            ? fallbackEmail.replace(/^(.)(.*)(.@.*)$/, "$1***$3")
            : "b***o@neocentra.bank",
          verificationToken: "mock_demo_verification_token",
          message:
            "Pendaftaran berhasil! Cek email untuk verifikasi pendaftaran akun anda (Demo Mode).",
        };
      }
      throw err;
    }
  }

  /**
   * Verifies customer account using 5-digit OTP and verificationToken
   */
  public static async verifyAccount(
    payload: VerifyCustomerPayload,
  ): Promise<VerifyCustomerResponse> {
    try {
      const response = await api.post<VerifyCustomerResponse>(
        "/api/v1/customers/verification",
        payload,
      );
      return response.data;
    } catch (err: any) {
      if (
        err.message &&
        (err.message.includes("Network Error") ||
          err.message.includes("Gagal terhubung"))
      ) {
        await new Promise((r) => setTimeout(r, 500));
        return {
          success: true,
          message: "Akun anda berhasil di verifikasi (Demo Mode)",
        };
      }
      throw err;
    }
  }
}
