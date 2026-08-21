import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useThemeStore } from "@/shared/stores/useThemeStore";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativeWindColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const resolvedScheme = colorScheme ?? "light";
  const isDark = resolvedScheme === "dark";

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
