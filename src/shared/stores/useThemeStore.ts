import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "@/shared/infrastructure/storage";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: "system",

      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
      },

      toggleTheme: () => {
        const current = get().themeMode;
        let next: ThemeMode = "dark";
        if (current === "dark") {
          next = "light";
        } else if (current === "light") {
          next = "dark";
        } else {
          next = "dark";
        }
        set({ themeMode: next });
      },
    }),
    {
      name: "neocentra-theme-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
