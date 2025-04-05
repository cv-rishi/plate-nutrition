import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";

const ImageTakerScreen = () => {
	const router = useRouter();

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Image Taker</ThemedText>
			<ThemedText style={styles.description}>
				Welcome to the image taker interface
			</ThemedText>
			<Button title="Logout" onPress={() => router.push("/login")} />
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	description: {
		marginVertical: 20,
		textAlign: "center",
	},
});

export default ImageTakerScreen;
