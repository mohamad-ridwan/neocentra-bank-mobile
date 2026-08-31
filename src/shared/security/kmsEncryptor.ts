import crypto from "react-native-quick-crypto";
import { Buffer } from "@craftzdog/react-native-buffer";

const MASTER_KEY_RAW = process.env.EXPO_PUBLIC_LOCAL_KMS_MASTER_KEY || "";

/**
 * Derivasi Master Key ke 32-Byte (256-bit) via SHA-256
 * Kompatibel 100% dengan SHA-256 KDF pada kms_encryptor.go
 */
export function deriveMasterKey(): Buffer {
  if (!MASTER_KEY_RAW) {
    throw new Error(
      "SECURITY_ERROR: Master Key environment variable is missing.",
    );
  }
  return crypto.createHash("sha256").update(MASTER_KEY_RAW).digest();
}

/**
 * Enkripsi AEAD AES-256-GCM dengan Context Binding AAD
 * Output Binary Wire Format: [ 12-Byte IV ] + [ Ciphertext ] + [ 16-Byte Auth Tag ]
 */
export function encryptPII(plaintext: string, aadContext: string): Uint8Array {
  if (!plaintext) {
    return new Uint8Array(0);
  }

  const key = deriveMasterKey();
  // 12-Byte Nonce/IV sesuai standar GCM RFC 5116
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aadContext, "utf8"));

  const ciphertext = cipher.update(plaintext, "utf8");
  cipher.final();
  const authTag = cipher.getAuthTag(); // 16-Byte MAC

  // Gabungkan [IV (12B)] + [Ciphertext] + [AuthTag (16B)]
  const encryptedPayload = Buffer.concat([iv, ciphertext, authTag]);
  return new Uint8Array(encryptedPayload);
}

/**
 * Dekripsi AEAD AES-256-GCM dengan Context Binding AAD
 * Input Binary Wire Format: [ 12-Byte IV ] + [ Ciphertext ] + [ 16-Byte Auth Tag ]
 */
export function decryptPII(
  ciphertextWithIvAndTag: Uint8Array,
  aadContext: string,
): string {
  if (!ciphertextWithIvAndTag || ciphertextWithIvAndTag.length === 0) {
    return "";
  }

  const key = deriveMasterKey();
  const buffer = Buffer.from(ciphertextWithIvAndTag);

  // Validasi ukuran buffer minimum: 12-Byte IV + 16-Byte Auth Tag
  if (buffer.length < 28) {
    throw new Error("SECURITY_ERROR: Ciphertext is too short to be valid.");
  }

  // Ekstrak IV (12B pertama), Auth Tag (16B terakhir), dan Ciphertext (sisanya)
  const iv = buffer.subarray(0, 12);
  const authTag = buffer.subarray(buffer.length - 16);
  const ciphertext = buffer.subarray(12, buffer.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAAD(Buffer.from(aadContext, "utf8"));
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
