import {
  CustomerStatus,
  User,
} from "@/modules/auth/domain/entities/user.entity";
import { Buffer } from "@craftzdog/react-native-buffer";
import { decryptPII } from "@/shared/security/kmsEncryptor";
import { AAD_CONTEXT, FIELD_TAG } from "../../security/securityConstants";

export interface BackendCustomerDTO {
  customer_id?: string;
  id?: string;
  nik?: string;
  full_name?: string;
  fullName?: string;
  email?: string;
  phone_number?: string;
  phoneNumber?: string;
  address?: string;
  status?: string;
  account_number?: string;
  accountNumber?: string;
  balance?: number;
  created_at?: string;
  createdAt?: string;
}

export interface RequestCustomerRegisterPayload {
  binaryPayload: Uint8Array;
  sessionKey: Uint8Array;
  fallbackEmail?: string;
}

export type RequestCustomerRegisterBinary =
  | Uint8Array<ArrayBufferLike>
  | RequestCustomerRegisterPayload;

export interface RequestCustomerLoginPayload {
  binaryPayload: Uint8Array;
  sessionKey: Uint8Array;
  identifier: string;
  rememberMe?: boolean;
}

export type RequestCustomerLoginBinary =
  | Uint8Array<ArrayBufferLike>
  | RequestCustomerLoginPayload;

export interface DecryptedRegisterPayload {
  nik: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password?: string;
}

export class UserMapper {
  /**
   * Transforms raw backend DTO to domain User entity
   */
  public static toDomain(
    dto: BackendCustomerDTO,
    fallbackData?: Partial<User>,
  ): User {
    const rawStatus = (dto.status || "PENDING_VERIFICATION").toUpperCase();
    let status: CustomerStatus = "PENDING_VERIFICATION";

    if (rawStatus === "ACTIVE") status = "ACTIVE";
    else if (rawStatus === "BLOCKED") status = "BLOCKED";
    else if (rawStatus === "SUSPENDED") status = "SUSPENDED";

    return {
      id: dto.customer_id || dto.id || fallbackData?.id || `cust_${Date.now()}`,
      nik: dto.nik || fallbackData?.nik || "3201010101010001",
      fullName:
        dto.full_name ||
        dto.fullName ||
        fallbackData?.fullName ||
        "Nasabah Neocentra",
      email: dto.email || fallbackData?.email || "nasabah@neocentra.bank",
      phoneNumber:
        dto.phone_number ||
        dto.phoneNumber ||
        fallbackData?.phoneNumber ||
        "+6281234567890",
      address: dto.address || fallbackData?.address,
      status,
      accountNumber:
        dto.account_number || dto.accountNumber || "8809 1234 5678",
      balance: dto.balance ?? fallbackData?.balance ?? 25000000,
      createdAt:
        dto.created_at ||
        dto.createdAt ||
        fallbackData?.createdAt ||
        new Date().toISOString(),
    };
  }

  /**
   * Unpacks and decrypts a binary registration payload (TLV format)
   */
  public static unpackAndDecryptRegister(
    data: Uint8Array,
  ): DecryptedRegisterPayload {
    const emptyResult: DecryptedRegisterPayload = {
      nik: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
    };

    try {
      const buffer = Buffer.from(data);
      let offset = 0;

      let encryptedNik: Uint8Array | undefined;
      let encryptedFullName: Uint8Array | undefined;
      let encryptedEmail: Uint8Array | undefined;
      let encryptedPhone: Uint8Array | undefined;
      let encryptedAddress: Uint8Array | undefined;
      let passwordRaw: string | undefined;

      while (offset < buffer.length) {
        if (offset + 3 > buffer.length) break; // Tag (1B) + Length (2B)
        const tag = buffer.readUInt8(offset);
        const length = buffer.readUInt16BE(offset + 1);
        offset += 3;

        if (offset + length > buffer.length) break;
        const val = new Uint8Array(buffer.subarray(offset, offset + length));
        offset += length;

        switch (tag) {
          case FIELD_TAG.NIK:
            encryptedNik = val;
            break;
          case FIELD_TAG.FULL_NAME:
            encryptedFullName = val;
            break;
          case FIELD_TAG.EMAIL:
            encryptedEmail = val;
            break;
          case FIELD_TAG.PHONE_NUMBER:
            encryptedPhone = val;
            break;
          case FIELD_TAG.ADDRESS:
            encryptedAddress = val;
            break;
          case FIELD_TAG.PASSWORD_HASH:
            passwordRaw = Buffer.from(val).toString("utf8");
            break;
        }
      }

      return {
        nik: encryptedNik ? decryptPII(encryptedNik, AAD_CONTEXT.NIK) : "",
        fullName: encryptedFullName
          ? decryptPII(encryptedFullName, AAD_CONTEXT.FULL_NAME)
          : "",
        email: encryptedEmail
          ? decryptPII(encryptedEmail, AAD_CONTEXT.EMAIL)
          : "",
        phoneNumber: encryptedPhone
          ? decryptPII(encryptedPhone, AAD_CONTEXT.PHONE_NUMBER)
          : "",
        address: encryptedAddress
          ? decryptPII(encryptedAddress, AAD_CONTEXT.ADDRESS)
          : "",
        password: passwordRaw,
      };
    } catch {
      return emptyResult;
    }
  }
}
