import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function LoginScreen() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	// Get theme colors
	const textColor = useThemeColor({}, "text");
	const backgroundColor = useThemeColor({}, "background");
	const borderColor = useThemeColor({}, "icon");
	const placeholderColor = useThemeColor({}, "icon");

	const handleLogin = () => {
		// Basic client-side check (replace with real auth later)
		if (username === "admin" && password === "password") {
			// Use a placeholder password
			router.replace("/adminDashboard");
		} else if (username === "user" && password === "password") {
			router.replace("/userDashboard");
		} else if (username === "mess Staff" && password === "password") {
			router.replace("/staffDashboard");
		} else if (username === "nutrition" && password === "password") {
			router.replace("/nutritionDashboard");
		} else {
			Alert.alert("Login Failed", "Invalid username or password");
		}
	};

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Login</ThemedText>
			<TextInput
				style={[
					styles.input,
					{
						color: textColor,
						backgroundColor: backgroundColor,
						borderColor: borderColor,
					},
				]}
				placeholder="Username"
				value={username}
				onChangeText={setUsername}
				placeholderTextColor={placeholderColor}
			/>
			<TextInput
				style={[
					styles.input,
					{
						color: textColor,
						backgroundColor: backgroundColor,
						borderColor: borderColor,
					},
				]}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				placeholderTextColor={placeholderColor}
			/>
			<Button
				title="Login"
				onPress={handleLogin}
				color={useThemeColor({}, "primary")}
			/>
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
	input: {
		width: "100%",
		marginVertical: 10,
		padding: 15,
		borderWidth: 1,
		borderRadius: 5,
	},
});
