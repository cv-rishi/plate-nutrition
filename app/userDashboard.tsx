import { Platform } from "react-native";

// Import both the native and web dashboard components
// Adjust the import paths based on where you save the files
import UserDashboardNative from "./userDashNative"; // Assuming you renamed the original
import UserDashboardWeb from "./userDashWeb"; // The web component created earlier

export default function UserDashboard() {
	// Check the platform
	if (Platform.OS === "web") {
		// If the platform is web, render the web-specific dashboard
		return <UserDashboardWeb />;
	} else {
		// Otherwise (iOS, Android), render the native dashboard
		return <UserDashboardNative />;
	}
}

// No styles needed here usually, as the styling is within the specific components.
