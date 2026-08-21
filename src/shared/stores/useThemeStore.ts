import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { colorScheme } from "nativewind";
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
        // Sync immediately with NativeWind runtime
        colorScheme.set(mode);
      },

      toggleTheme: () => {
        const current = get().themeMode;
        // If current is system or light, toggle to dark; otherwise toggle to light
        let next: ThemeMode = "dark";
        if (current === "dark") {
          next = "light";
        } else if (current === "light") {
          next = "dark";
        } else {
          // If system, check currently resolved or toggle to dark/light
          const currentResolved = colorScheme.get();
          next = currentResolved === "dark" ? "light" : "dark";
        }
        set({ themeMode: next });
        colorScheme.set(next);
      },
    }),
    {
      name: "neocentra-theme-storage",
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.themeMode) {
          colorScheme.set(state.themeMode);
        }
      },
    }
  )
);
