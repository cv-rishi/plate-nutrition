import React from "react";
import { TextInput, StyleSheet, type TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor"; // Ensure this path is correct

// Extend standard TextInputProps to accept all TextInput properties
// Add 'style' prop specifically for overriding/extending styles
export type ThemedTextInputProps = TextInputProps & {
	style?: object; // Allow passing custom styles
	lightColor?: string; // Optional overrides for light theme
	darkColor?: string; // Optional overrides for dark theme
};

export function ThemedTextInput({
	style,
	lightColor, // Not directly used for input background/border, but could be for text if needed
	darkColor, // Not directly used for input background/border, but could be for text if needed
	placeholderTextColor: customPlaceholderTextColor, // Allow overriding placeholder color specifically
	...rest // Pass all other TextInput props down
}: ThemedTextInputProps) {
	// Fetch theme-specific colors using your hook
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
	const backgroundColor = useThemeColor({}, "inputBackground"); // Use the inputBackground color defined in your theme
	const borderColor = useThemeColor({}, "inputBorder"); // Use the inputBorder color defined in your theme
	const placeholderTextColor =
		customPlaceholderTextColor ?? useThemeColor({}, "placeholderText"); // Use custom or theme's placeholder color

	return (
		<TextInput
			style={[
				styles.default, // Default styles first
				{
					color: color,
					backgroundColor: backgroundColor,
					borderColor: borderColor,
				},
				style, // Apply custom styles passed via props last (to override defaults)
			]}
			placeholderTextColor={placeholderTextColor} // Apply the determined placeholder color
			{...rest} // Spread the rest of the TextInput props
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		height: 45, // Default height
		borderWidth: 1, // Default border
		borderRadius: 8, // Default corner rounding
		paddingHorizontal: 12, // Default horizontal padding
		fontSize: 16, // Default font size
		marginBottom: 15, // Default bottom margin (adjust as needed)
	},
});
