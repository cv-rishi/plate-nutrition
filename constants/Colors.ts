// constants/Colors.ts

// Ayu Dark (Dark Theme) Base Colors
const darkBackground = "#0b0e14"; // --bg-color
const darkForeground = "#ECEDEE"; // Default dark text for better contrast than #565b66
const darkPrimary = "#e6b450"; // --primary-color
const darkSecondary = "#39bae6"; // --secondary-color
const darkLink = "#ffb454"; // --link-color
const darkHeaderBg = "#131721"; // --header-bg
const darkIcon = "#9BA1A6"; // Default dark icon, adjust if needed

// Oldbook (Light Theme) Base Colors
const lightBackground = "#e9e2c9"; // --bg-color
const lightForeground = "#585148"; // --fg-color
const lightPrimary = "#7a1405"; // --primary-color
const lightSecondary = "#158f9c"; // --secondary-color
const lightLink = "#ffb454"; // --link-color (kept as specified)
const lightHeaderBg = "#dac9aa"; // --header-bg
const lightIcon = "#585148"; // --fg-color (adjust if needed)

export const Colors = {
	light: {
		text: lightForeground,
		background: lightBackground,
		tint: lightPrimary,
		icon: lightIcon,
		tabIconDefault: lightIcon,
		tabIconSelected: lightPrimary,

		primary: lightPrimary,
		secondary: lightSecondary,
		link: lightLink,
		headerBackground: lightHeaderBg,

		separator: "#ccc", // Example separator color
		inputBackground: "#f0f0f0", // Light theme input background
		inputBorder: "#ccc", // Light theme input border
		placeholderText: "#999", // Light theme placeholder text
	},
	dark: {
		text: darkForeground,
		background: darkBackground,
		tint: darkPrimary,
		icon: darkIcon,
		tabIconDefault: darkIcon,
		tabIconSelected: darkPrimary,

		primary: darkPrimary,
		secondary: darkSecondary,
		link: darkLink,
		headerBackground: darkHeaderBg,

		inputBackground: "#2c2c2e", // Dark theme input background
		inputBorder: "#444", // Dark theme input border
		placeholderText: "#777", // Dark theme placeholder text
	},
};
