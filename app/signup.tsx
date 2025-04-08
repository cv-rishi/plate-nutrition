import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Button } from "react-native";

export default function SignUpScreen() {
	const router = useRouter();

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Sign Up</ThemedText>
			{/* Add your sign-up form fields here */}
			<ThemedText>Sign Up Form Will Go Here</ThemedText>
			<Button title="Back to Home" onPress={() => router.back()} />
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
});
