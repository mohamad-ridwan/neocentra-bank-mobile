import crypto from "react-native-quick-crypto";
import { Buffer } from "@craftzdog/react-native-buffer";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Secret client signing key (atau asymmetric private key dari Hardware Keystore)
export const APP_SIGNING_SECRET = process.env.EXPO_PUBLIC_APP_SIGNING_KEY || "";

/**
 * Menghitung HMAC-SHA256 Signature atas data biner sesuai standar SNAP BI:
 * StringToSign = METHOD:PATH:SHA256(BODY):TIMESTAMP:NONCE
 */
export function generateRequestSignature(
  method: string,
  path: string,
  bodyBinary: Uint8Array,
  timestamp: string,
  nonce: string,
): string {
  // 1. Hash payload body biner ke Hex
  const bodyHash = crypto
    .createHash("sha256")
    .update(Buffer.from(bodyBinary))
    .digest("hex");

  // 2. Format String to Sign SNAP BI
  const stringToSign = `${method.toUpperCase()}:${path}:${bodyHash}:${timestamp}:${nonce}`;

  // 3. HMAC-SHA256 Base64
  return crypto
    .createHmac("sha256", APP_SIGNING_SECRET)
    .update(stringToSign)
    .digest("base64");
}

/**
 * Mengambil metadata keamanan & atribut perangkat mobile
 */
export function getDeviceSecurityMetadata() {
  const deviceModel =
    Device.modelName ||
    `${Device.manufacturer || ""} ${Device.brand || ""}`.trim() ||
    (Platform.OS === "ios" ? "iPhone" : "Android Device");

  const deviceOS =
    `${Platform.OS.toUpperCase()} ${Device.osVersion || ""}`.trim();
  const appVersion =
    Constants.expoConfig?.version ||
    Constants.manifest2?.extra?.expoClient?.version ||
    "1.0.0";
  const appBuild =
    Constants.expoConfig?.ios?.buildNumber ||
    Constants.expoConfig?.android?.versionCode?.toString() ||
    "1";
  const channelId = Platform.OS === "ios" ? "MBK-IOS" : "MBK-AND";

  // Fallback Device ID deterministik/persist
  const deviceId =
    Constants.installationId ||
    `dev-${Platform.OS}-${Device.osInternalBuildId || "sec-hw-uuid"}`;

  return {
    deviceId,
    deviceModel,
    deviceOS,
    appVersion,
    appBuild,
    channelId,
  };
}
