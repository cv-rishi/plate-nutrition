import { useAppTheme } from "@/context/ThemeContext"; // Import the hook

/**
 * Hook that provides the current color scheme preference (light or dark).
 * Prioritizes the user's choice from ThemeContext.
 */
export function useColorScheme(): "light" | "dark" {
	const { theme } = useAppTheme(); // Get the theme from context
	return theme;
}

// You might not need the .web.ts variant anymore, or it should also use the context.
