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
