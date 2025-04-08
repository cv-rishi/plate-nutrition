import React from "react";
import { StyleSheet } from "react-native";
import { Link } from "expo-router"; // Import Link
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "react-native"; // Or use a custom ThemedButton if you have one

export default function HomeScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Welcome!</ThemedText>
			<ThemedText>Please log in or sign up to continue.</ThemedText>

			{/* Use Link for navigation */}
			<Link href="/login" asChild>
				<Button title="Log In" />
			</Link>

			<Link href="/signup" asChild>
				<Button title="Sign Up" />
			</Link>

			{/* Add some spacing if needed */}
			<ThemedView style={{ height: 20 }} />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	// Add other styles as needed
});
