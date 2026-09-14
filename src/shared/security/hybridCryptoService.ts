import crypto from "react-native-quick-crypto";
import { Buffer } from "@craftzdog/react-native-buffer";

// Default / Staging Server RSA-2048 Public Key (X.509 SubjectPublicKeyInfo PEM format)
const DEFAULT_SERVER_RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1nsNYGlHjszj0lMm3d6X
R8A2WBPWJiAN8weB4Tw7Rpozo74vA61yLAeWYr+J7S30Rwb5xjbhPCx1FvYeo/mJ
F2WM1ejSIfA+vbdcaIupxlsfYk9KON4R6kx764x+4HLeV2xgZu0iCnoIDn9Evmvv
tRHMSbW5pGCazFyJaYJwOwO/2K82xhgooF4VqklKOw3YnkKEmu37DUZ+B5pggsrI
XMxIosz1Kp8wCenX6kHzMYo7wXapHR3LHWIOheadEp7oE/YBA+zbuOw4nmxG/wDf
nwBtNkJ235vUfpan0NVI7+ovUZUdtjSxCzucAfR3ecj+O9j6v7PNJ3NruVgHHVt0
9QIDAQAB
-----END PUBLIC KEY-----`;

export function getServerPublicKey(): string {
  const envKey = process.env.EXPO_PUBLIC_SERVER_RSA_PUBLIC_KEY;
  if (envKey && envKey.trim()) {
    return envKey.replace(/\\n/g, "\n").trim();
  }
  return DEFAULT_SERVER_RSA_PUBLIC_KEY;
}

export const HYBRID_CONSTANTS = {
  RSA_ENCRYPTED_KEY_LENGTH: 256,
  GCM_NONCE_LENGTH: 12,
  GCM_TAG_LENGTH: 16,
  MIN_TRANSIT_PAYLOAD_SIZE: 284,
} as const;

export interface HybridEncryptResult {
  binaryPayload: Uint8Array;
  sessionKey: Uint8Array; // Ephemeral 32-byte session key for decrypting transit response
}

export class HybridCryptoService {
  /**
   * Enkripsi payload plaintext (JSON string atau Uint8Array) menggunakan
   * Hybrid Encryption Pola 1:
   * [ 256-Byte RSA-OAEP Encrypted Key ] + [ 12-Byte IV ] + [ Ciphertext ] + [ 16-Byte Auth Tag ]
   * Mengembalikan binary payload beserta ephemeral sessionKey untuk mendekripsi respons transit.
   */
  public static encryptPayloadWithKey(
    data: string | Uint8Array,
  ): HybridEncryptResult {
    if (!data || data.length === 0) {
      return {
        binaryPayload: new Uint8Array(0),
        sessionKey: new Uint8Array(0),
      };
    }

    const pubKeyPEM = getServerPublicKey();

    // 1. Generate Ephemeral 32-Byte (256-bit) AES Key & 12-Byte IV
    const sessionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(HYBRID_CONSTANTS.GCM_NONCE_LENGTH);

    // 2. Enkripsi Data dengan AES-256-GCM
    const cipher = crypto.createCipheriv("aes-256-gcm", sessionKey, iv);
    const plaintextBuffer =
      typeof data === "string" ? Buffer.from(data, "utf8") : Buffer.from(data);

    const ciphertext = cipher.update(plaintextBuffer);
    cipher.final();
    const authTag = cipher.getAuthTag(); // 16-Byte Auth Tag

    // 3. Enkripsi Ephemeral Session Key dengan RSA-OAEP SHA-256 (256 Bytes)
    const encryptedKey = crypto.publicEncrypt(
      {
        key: pubKeyPEM,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      sessionKey,
    );

    if (encryptedKey.length !== HYBRID_CONSTANTS.RSA_ENCRYPTED_KEY_LENGTH) {
      throw new Error(
        `CRYPTO_ERROR: RSA encrypted key length must be exactly ${HYBRID_CONSTANTS.RSA_ENCRYPTED_KEY_LENGTH} bytes, got ${encryptedKey.length}`,
      );
    }

    // 4. Gabungkan ke Wire Format Pola 1:
    // [ 256B EncKey ] + [ 12B IV ] + [ Ciphertext ] + [ 16B Tag ]
    const finalBuffer = Buffer.concat([
      encryptedKey,
      iv,
      ciphertext,
      authTag,
    ]);

    return {
      binaryPayload: new Uint8Array(finalBuffer),
      sessionKey: new Uint8Array(sessionKey),
    };
  }

  /**
   * Helper kompatibilitas lama yang mengembalikan hanya Uint8Array
   */
  public static encryptPayload(data: string | Uint8Array): Uint8Array {
    return this.encryptPayloadWithKey(data).binaryPayload;
  }

  /**
   * Mendekripsi respons transit dari backend (Opsi A: Per-Request Shared Secret)
   * Format input data: [ 12-Byte IV ] + [ Ciphertext ] + [ 16-Byte Tag ]
   * Mendukung input berupa string Base64 (misal dari response JSON) maupun raw binary Uint8Array.
   */
  public static decryptTransitResponse(
    data: string | Uint8Array,
    sessionKey: Uint8Array,
  ): string {
    if (!data || !sessionKey || sessionKey.length !== 32) {
      return "";
    }

    // Konversi input ke Buffer
    const buffer =
      typeof data === "string"
        ? Buffer.from(data, "base64")
        : Buffer.from(data);

    // Minimum wire size: 12B IV + 16B Tag = 28 Bytes
    const minSize =
      HYBRID_CONSTANTS.GCM_NONCE_LENGTH + HYBRID_CONSTANTS.GCM_TAG_LENGTH;
    if (buffer.length < minSize) {
      throw new Error(
        `SECURITY_ERROR: Transit response ciphertext is too short (got ${buffer.length}, min ${minSize})`,
      );
    }

    // Ekstrak IV (12B pertama), Auth Tag (16B terakhir), dan Ciphertext (tengah)
    // Bungkus eksplisit ke Buffer.from untuk memastikan kompatibilitas penuh dengan C++ quick-crypto binding
    const iv = Buffer.from(buffer.subarray(0, HYBRID_CONSTANTS.GCM_NONCE_LENGTH));
    const authTag = Buffer.from(
      buffer.subarray(buffer.length - HYBRID_CONSTANTS.GCM_TAG_LENGTH),
    );
    const ciphertext = Buffer.from(
      buffer.subarray(
        HYBRID_CONSTANTS.GCM_NONCE_LENGTH,
        buffer.length - HYBRID_CONSTANTS.GCM_TAG_LENGTH,
      ),
    );
    const keyBuf = Buffer.from(sessionKey);

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      keyBuf,
      iv,
    );
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  }
}
