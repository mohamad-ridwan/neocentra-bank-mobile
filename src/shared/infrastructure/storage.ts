import { createMMKV, MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

let mmkvInstance: MMKV | null = null;

try {
  mmkvInstance = createMMKV({ id: "neocentra-storage" });
} catch {
  // Safe fallback for environments where native nitro JSI is not available (e.g. testing or web)
}

const memoryStorage = new Map<string, string>();

export const mmkvStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    if (mmkvInstance) {
      mmkvInstance.set(name, value);
      return;
    }
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(name, value);
        return;
      } catch {
        // ignore localStorage error
      }
    }
    memoryStorage.set(name, value);
  },

  getItem: (name: string) => {
    if (mmkvInstance) {
      const val = mmkvInstance.getString(name);
      return val ?? null;
    }
    if (typeof localStorage !== "undefined") {
      try {
        return localStorage.getItem(name);
      } catch {
        // ignore localStorage error
      }
    }
    return memoryStorage.get(name) ?? null;
  },

  removeItem: (name: string) => {
    if (mmkvInstance) {
      mmkvInstance.remove(name);
      return;
    }
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.removeItem(name);
        return;
      } catch {
        // ignore localStorage error
      }
    }
    memoryStorage.delete(name);
  },
};

export const getMMKVInstance = () => mmkvInstance;

const ACCESS_TOKEN_KEY = "neocentra_secure_access_token";
const TOKEN_EXPIRY_KEY = "neocentra_secure_token_expiry";

function getRawItem(key: string): string | null {
  if (mmkvInstance) {
    return mmkvInstance.getString(key) ?? null;
  }
  if (typeof localStorage !== "undefined") {
    try {
      return localStorage.getItem(key);
    } catch {
      // ignore
    }
  }
  return memoryStorage.get(key) ?? null;
}

function setRawItem(key: string, value: string) {
  if (mmkvInstance) {
    mmkvInstance.set(key, value);
    return;
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(key, value);
      return;
    } catch {
      // ignore
    }
  }
  memoryStorage.set(key, value);
}

function removeRawItem(key: string) {
  if (mmkvInstance) {
    mmkvInstance.remove(key);
    return;
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.removeItem(key);
      return;
    } catch {
      // ignore
    }
  }
  memoryStorage.delete(key);
}

export const secureTokenStorage = {
  saveAccessToken: (token: string, expiresInMinutes: number = 15) => {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    setRawItem(ACCESS_TOKEN_KEY, token);
    setRawItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
  },
  getAccessToken: (): string | null => {
    const expiryStr = getRawItem(TOKEN_EXPIRY_KEY);
    if (expiryStr) {
      const expiresAt = parseInt(expiryStr, 10);
      if (Date.now() >= expiresAt) {
        secureTokenStorage.clearAccessToken();
        return null;
      }
    }
    return getRawItem(ACCESS_TOKEN_KEY);
  },
  isTokenExpired: (): boolean => {
    const expiryStr = getRawItem(TOKEN_EXPIRY_KEY);
    if (!expiryStr) return true;
    const expiresAt = parseInt(expiryStr, 10);
    return Date.now() >= expiresAt;
  },
  clearAccessToken: () => {
    removeRawItem(ACCESS_TOKEN_KEY);
    removeRawItem(TOKEN_EXPIRY_KEY);
  },
};
