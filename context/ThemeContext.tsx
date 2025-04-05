import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";
// Consider adding AsyncStorage for persistence later:
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

interface ThemeContextProps {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface AppThemeProviderProps {
	children: ReactNode;
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
	// Default to device theme initially
	const deviceTheme = useDeviceColorScheme() ?? "light";
	const [theme, setThemeState] = useState<Theme>(deviceTheme);

	// Optional: Load saved theme from storage on mount
	useEffect(() => {
		const loadTheme = async () => {
			try {
				const savedTheme = await AsyncStorage.getItem("appTheme");
				if (savedTheme === "light" || savedTheme === "dark") {
					setThemeState(savedTheme);
				} else {
					setThemeState(deviceTheme); // Fallback to device theme
				}
			} catch (error) {
				console.error("Failed to load theme from storage", error);
				setThemeState(deviceTheme); // Fallback on error
			}
		};
		loadTheme();
	}, [deviceTheme]);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		// Optional: Save theme to storage
		AsyncStorage.setItem("appTheme", newTheme).catch((error) => {
			console.error("Failed to save theme to storage", error);
		});
	};

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useAppTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useAppTheme must be used within an AppThemeProvider");
	}
	return context;
};
