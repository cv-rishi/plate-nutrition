import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { AppThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Colors } from "@/constants/Colors";

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Inner component that uses the theme context
function RootNavigation() {
	const { theme } = useAppTheme();
	const headerBackgroundColor =
		theme === "light"
			? Colors.light.headerBackground
			: Colors.dark.headerBackground;
	const headerTintColor =
		theme === "light" ? Colors.light.text : Colors.dark.text;

	return (
		<NavigationThemeProvider
			value={theme === "dark" ? DarkTheme : DefaultTheme}
		>
			<Stack
				screenOptions={{
					// Apply header options globally
					headerStyle: {
						backgroundColor: headerBackgroundColor,
					},
					headerTintColor: headerTintColor,
					headerRight: () => <ThemeToggleButton />,
				}}
			>
				<Stack.Screen
					name="index"
					options={{ title: "Home", headerShown: true }}
				/>
				<Stack.Screen
					name="login"
					options={{ title: "Login", headerShown: true }}
				/>
                <Stack.Screen
                    name="signup"
                    options={{ title: "Sign Up", headerShown: true }}
                />
				<Stack.Screen
					name="adminDashboard"
					options={{ title: "Admin Dashboard" }}
				/>
				<Stack.Screen name="userDashboard" options={{ title: "User Screen" }} />
				<Stack.Screen
					name="staffDashboard"
					options={{ title: "Image Taker" }}
				/>
				<Stack.Screen
					name="nutritionDashboard"
					options={{ title: "Nutrition Dashboard" }}
				/>

				{/* +not-found screen */}
				<Stack.Screen name="+not-found" />
			</Stack>
		</NavigationThemeProvider>
	);
}

export default function RootLayout() {
	// Font loading logic remains the same
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	// Wrap the entire navigation structure with your theme provider
	return (
		<AppThemeProvider>
			<RootNavigation />
		</AppThemeProvider>
	);
}
