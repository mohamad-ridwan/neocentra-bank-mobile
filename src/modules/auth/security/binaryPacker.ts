import { Buffer } from "@craftzdog/react-native-buffer";
import { FIELD_TAG } from "./securityConstants";

export interface EncryptedCustomerPayload {
  encryptedNik: Uint8Array;
  encryptedFullName: Uint8Array;
  encryptedEmail: Uint8Array;
  encryptedPhone: Uint8Array;
  encryptedAddress: Uint8Array;
  passwordRaw: string; // Dikirim untuk di-hash backend (Argon2id/Bcrypt)
}

/**
 * Binary Framing Protocol (TLV: Tag-Length-Value)
 * Format per field: [ 1-Byte Tag ] + [ 2-Byte Big-Endian Length ] + [ Raw Binary Data ]
 */
export function packToBinaryStream(
  payload: EncryptedCustomerPayload,
): Uint8Array {
  const chunks: Buffer[] = [];

  const appendField = (tag: number, data: Uint8Array | string) => {
    const rawData =
      typeof data === "string" ? Buffer.from(data, "utf8") : Buffer.from(data);
    const header = Buffer.allocUnsafe(3);
    header.writeUInt8(tag, 0);
    header.writeUInt16BE(rawData.length, 1);
    chunks.push(header, rawData);
  };

  appendField(FIELD_TAG.NIK, payload.encryptedNik);
  appendField(FIELD_TAG.FULL_NAME, payload.encryptedFullName);
  appendField(FIELD_TAG.EMAIL, payload.encryptedEmail);
  appendField(FIELD_TAG.PHONE_NUMBER, payload.encryptedPhone);
  appendField(FIELD_TAG.ADDRESS, payload.encryptedAddress);
  appendField(FIELD_TAG.PASSWORD_HASH, payload.passwordRaw);

  return new Uint8Array(Buffer.concat(chunks));
}
