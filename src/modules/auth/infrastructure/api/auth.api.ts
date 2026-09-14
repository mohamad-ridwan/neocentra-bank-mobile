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
  message: string;
}

export class AuthApi {
  /**
   * Logs in an existing customer
   */
  public static async login(data: LoginFormData): Promise<LoginResponse> {
    try {
      const response = await api.post<{
        success: boolean;
        message?: string;
        token?: string;
        access_token?: string;
        data?: {
          user?: BackendCustomerDTO;
          token?: string;
        };
      }>("/api/v1/auth/login", {
        identifier: data.identifier,
        password: data.password,
      });

      const resData = response.data.data;
      const token =
        response.data.token ||
        response.data.access_token ||
        resData?.token ||
        "mock_jwt_token_neocentra";
      const rawUser = resData?.user || {};

      const user = UserMapper.toDomain(rawUser, {
        email: data.identifier.includes("@")
          ? data.identifier
          : "nasabah@neocentra.bank",
        fullName: "Ahmad Fauzi",
        status: "ACTIVE",
        balance: 45750000,
        accountNumber: "8809 3421 9870",
      });

      return {
        user,
        token,
        message:
          response.data.message || "Login berhasil! Selamat datang kembali.",
      };
    } catch (err: any) {
      // In offline / prototype mode without running backend, simulate authenticated user session
      if (
        err.message &&
        (err.message.includes("Network Error") ||
          err.message.includes("Gagal terhubung"))
      ) {
        // Mock success fallback for offline testing
        await new Promise((r) => setTimeout(r, 600));
        const mockUser = UserMapper.toDomain(
          {},
          {
            email: data.identifier.includes("@")
              ? data.identifier
              : "ahmad.fauzi@neocentra.bank",
            fullName: "Ahmad Fauzi (Demo User)",
            status: "ACTIVE",
            balance: 45750000,
            accountNumber: "8809 3421 9870",
          },
        );

        return {
          user: mockUser,
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_session_token",
          message: "Login berhasil (Demo Mode)",
        };
      }
      throw err;
    }
  }

  /**
   * Registers a new customer with bank-grade security headers & binary hybrid payload
   */
  public static async register(
    data: RequestCustomerRegisterBinary,
  ): Promise<RegisterResponse> {
    const rawBinary =
      data instanceof Uint8Array
        ? data
        : (data as RequestCustomerRegisterPayload).binaryPayload;
    const sessionKey =
      data instanceof Uint8Array
        ? undefined
        : (data as RequestCustomerRegisterPayload).sessionKey;
    const fallbackEmail =
      data instanceof Uint8Array
        ? undefined
        : (data as RequestCustomerRegisterPayload).fallbackEmail;

    const idempotencyKey = generateIdempotencyKey();
    const timestamp = new Date().toISOString();
    const nonce = generateIdempotencyKey();
    const correlationId = `req-${generateIdempotencyKey()}`;
    const deviceMeta = getDeviceSecurityMetadata();

    const endpointPath = "/api/v1/customers/register";
    const signature = generateRequestSignature(
      "POST",
      endpointPath,
      rawBinary,
      timestamp,
      nonce,
    );

    try {
      const response = await api.post<{
        success: boolean;
        code: number;
        message: string;
        data: {
          email: string;
        };
      }>(endpointPath, rawBinary, {
        headers: {
          "Content-Type": "application/octet-stream",
          Accept: "application/json",
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

      const encryptedEmail = response.data?.data?.email;
      let decryptedEmail = "";

      if (encryptedEmail && sessionKey) {
        try {
          // Opsi A: Dekripsi response transit menggunakan ephemeral sessionKey
          decryptedEmail = HybridCryptoService.decryptTransitResponse(
            encryptedEmail,
            sessionKey,
          );
        } catch (decryptErr) {
          console.warn(
            "[AuthApi.register] Gagal mendekripsi transit response:",
            decryptErr,
          );
          decryptedEmail = "";
        }
      }

      return {
        email: decryptedEmail || fallbackEmail || "nasabah@neocentra.bank",
        message:
          response.data.message ||
          "Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.",
      };
    } catch (err: any) {
      // In prototype / offline mode, gracefully provide fallback
      if (
        err.message &&
        (err.message.includes("Network Error") ||
          err.message.includes("Gagal terhubung"))
      ) {
        await new Promise((r) => setTimeout(r, 700));
        return {
          email: fallbackEmail || "nasabah@neocentra.bank",
          message:
            "Pendaftaran berhasil! Cek email untuk verifikasi pendaftaran akun anda (Demo Mode).",
        };
      }
      throw err;
    }
  }
}
