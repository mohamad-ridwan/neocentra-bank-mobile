import { api } from "@/shared/infrastructure/http-client";
import { generateIdempotencyKey } from "@/shared/utils/idempotency";
import { normalizePhoneNumber } from "@/shared/utils/formatters";
import { User } from "@/modules/auth/domain/entities/user.entity";
import { LoginFormData } from "@/modules/auth/domain/schemas/login.schema";
import { RegisterFormData } from "@/modules/auth/domain/schemas/register.schema";
import { BackendCustomerDTO, UserMapper } from "../mappers/user.mapper";

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
  customerId: string;
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
      const token = response.data.token || response.data.access_token || resData?.token || "mock_jwt_token_neocentra";
      const rawUser = resData?.user || {};

      const user = UserMapper.toDomain(rawUser, {
        email: data.identifier.includes("@") ? data.identifier : "nasabah@neocentra.bank",
        fullName: "Ahmad Fauzi",
        status: "ACTIVE",
        balance: 45750000,
        accountNumber: "8809 3421 9870",
      });

      return {
        user,
        token,
        message: response.data.message || "Login berhasil! Selamat datang kembali.",
      };
    } catch (err: any) {
      // In offline / prototype mode without running backend, simulate authenticated user session
      if (err.message && (err.message.includes("Network Error") || err.message.includes("Gagal terhubung"))) {
        // Mock success fallback for offline testing
        await new Promise((r) => setTimeout(r, 600));
        const mockUser = UserMapper.toDomain({}, {
          email: data.identifier.includes("@") ? data.identifier : "ahmad.fauzi@neocentra.bank",
          fullName: "Ahmad Fauzi (Demo User)",
          status: "ACTIVE",
          balance: 45750000,
          accountNumber: "8809 3421 9870",
        });

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
   * Registers a new customer with idempotency protection
   */
  public static async register(data: RegisterFormData): Promise<RegisterResponse> {
    const idempotencyKey = generateIdempotencyKey();
    const normalizedPhone = normalizePhoneNumber(data.phoneNumber);

    const payload = {
      nik: data.nik,
      full_name: data.fullName,
      email: data.email,
      phone_number: normalizedPhone,
      address: data.address,
      password: data.password,
    };

    try {
      const response = await api.post<{
        success: boolean;
        code: number;
        message: string;
        data: BackendCustomerDTO;
      }>("/api/v1/customers/register", payload, {
        headers: {
          "X-Idempotency-Key": idempotencyKey,
        },
      });

      const rawData = response.data.data || {};
      const user = UserMapper.toDomain(rawData, {
        nik: data.nik,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: normalizedPhone,
        address: data.address,
        status: "PENDING_VERIFICATION",
      });

      return {
        user,
        message: response.data.message || "Pendaftaran berhasil! Akun Anda sedang dalam verifikasi.",
        customerId: user.id,
      };
    } catch (err: any) {
      // In prototype / offline mode, gracefully provide registered domain model
      if (err.message && (err.message.includes("Network Error") || err.message.includes("Gagal terhubung"))) {
        await new Promise((r) => setTimeout(r, 700));
        const mockUser = UserMapper.toDomain({}, {
          id: `cust_${Date.now()}`,
          nik: data.nik,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: normalizedPhone,
          address: data.address,
          status: "PENDING_VERIFICATION",
        });

        return {
          user: mockUser,
          message: "Pendaftaran berhasil! Data rekening Anda dalam tahap verifikasi KYC (Demo Mode).",
          customerId: mockUser.id,
        };
      }
      throw err;
    }
  }
}
