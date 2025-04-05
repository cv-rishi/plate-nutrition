import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/context/ThemeContext"; // Adjust import path if needed
import { useThemeColor } from "@/hooks/useThemeColor"; // Adjust import path if needed

export const ThemeToggleButton = () => {
	const { toggleTheme, theme } = useAppTheme();
	const iconColor = useThemeColor({}, "icon");
	const iconName = theme === "light" ? "dark-mode" : "light-mode";

	return (
		<TouchableOpacity
			onPress={toggleTheme}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Adds 10 points of slop on each side
			style={styles.button} // Keep your existing styles like marginRight
		>
			<MaterialIcons name={iconName} size={24} color={iconColor} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		// marginRight: 15,
		// padding: -10,
	},
});
