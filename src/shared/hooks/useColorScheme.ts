import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useThemeStore, ThemeMode } from "@/shared/stores/useThemeStore";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativeWindColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeModeStore = useThemeStore((state) => state.setThemeMode);

  const resolvedScheme = colorScheme ?? "light";
  const isDark = resolvedScheme === "dark";

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeStore(mode);
    setColorScheme(mode);
  };

  const toggleTheme = () => {
    const next: ThemeMode = isDark ? "light" : "dark";
    setThemeModeStore(next);
    setColorScheme(next);
  };

  return {
    colorScheme: resolvedScheme,
    themeMode,
    isDark,
    setColorScheme,
    setThemeMode,
    toggleTheme,
    toggleColorScheme,
  };
}
