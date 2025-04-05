import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	Button,
	Platform,
	Alert, // Added Alert
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { CameraComponent } from "@/components/CameraComponent";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { StarRating } from "@/components/StarRating";

export default function UserScreen() {
	const [photoUri, setPhotoUri] = useState<string | null>(null);
	const [showCamera, setShowCamera] = useState(false);
	const [nutritionalInfo, setNutritionalInfo] = useState<string | null>(null);
	// NEW: State for model's confidence score
	const [modelConfidence, setModelConfidence] = useState<number | null>(null);
	// REPURPOSED: State for the USER'S rating input
	const [userRating, setUserRating] = useState<number | null>(null);
	// State to track if results are being loaded
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const buttonColor = useThemeColor({}, "primary");
	const buttonTextColor = useThemeColor({}, "background");
	const cardBackground = useThemeColor({}, "headerBackground");
	const textColor = useThemeColor({}, "text");
	const iconColor = useThemeColor({}, "icon");

	const handlePictureTaken = (uri: string) => {
		setPhotoUri(uri);
		setShowCamera(false);
		setIsLoading(true); // Start loading indicator
		setNutritionalInfo(null); // Clear previous results
		setModelConfidence(null);
		setUserRating(null); // Reset user rating for new picture

		console.log("Photo URI:", uri);
		// --- Backend Interaction Placeholder ---
		// Simulate backend processing delay
		setTimeout(() => {
			// Assume backend returns nutritional info and model confidence
			setNutritionalInfo("Calories: 410, Protein: 18g, Carbs: 55g, Fat: 12g");
			setModelConfidence(0.85); // Example confidence score (e.g., 85%)
			setIsLoading(false); // Stop loading indicator
		}, 2000); // Simulate 2 second network delay
		// --- End Backend Interaction Placeholder ---
	};

	// Handler for the user setting their rating
	const handleSetUserRating = (rating: number) => {
		setUserRating(rating);
		// Optional: Send the user rating to the backend here
		console.log("User rated:", rating);
		Alert.alert(
			"Rating Submitted",
			`You rated ${rating} stars. Thank you for your feedback!`,
		); // Give feedback
	};

	const handleOpenCamera = () => {
		// Clear all previous results and states when opening camera
		setPhotoUri(null);
		setNutritionalInfo(null);
		setModelConfidence(null);
		setUserRating(null);
		setIsLoading(false);
		setShowCamera(true);
	};

	const handleCloseCamera = () => {
		setShowCamera(false);
	};

	const handleLogout = () => {
		router.replace("/");
	};

	if (showCamera) {
		return (
			<CameraComponent
				onPictureTaken={handlePictureTaken}
				onClose={handleCloseCamera}
			/>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen
				options={{
					title: "User Dashboard",
					headerRight: () => (
						<TouchableOpacity
							onPress={handleLogout}
							style={styles.headerButton}
						>
							<MaterialIcons name="logout" size={24} color={iconColor} />
						</TouchableOpacity>
					),
				}}
			/>

			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.contentContainer}
				keyboardShouldPersistTaps="handled" // Allow taps outside inputs to dismiss keyboard if needed later
			>
				{/* Card for Camera Action */}
				<View style={[styles.card, { backgroundColor: cardBackground }]}>
					<ThemedText type="subtitle" style={styles.cardTitle}>
						Analyze Meal
					</ThemedText>
					{/* ... (Image display or placeholder remains the same) ... */}
					{
						photoUri && !isLoading ? ( // Show image if not loading
							<View style={styles.photoContainer}>
								<ThemedText style={styles.infoLabel}>
									Captured Image:
								</ThemedText>
								<Image source={{ uri: photoUri }} style={styles.photo} />
							</View>
						) : !photoUri && !isLoading ? ( // Show placeholder if no photo and not loading
							<View style={styles.placeholder}>
								<MaterialIcons name="camera-alt" size={50} color={iconColor} />
								<ThemedText style={styles.placeholderText}>
									Press the button below to take a picture of your meal.
								</ThemedText>
							</View>
						) : null /* Or show a specific placeholder during loading if desired */
					}

					<TouchableOpacity
						style={[styles.button, { backgroundColor: buttonColor }]}
						onPress={handleOpenCamera}
						disabled={isLoading} // Disable button while loading
					>
						<MaterialIcons
							name="camera"
							size={20}
							color={buttonTextColor}
							style={{ marginRight: 8 }}
						/>
						<ThemedText style={[styles.buttonText, { color: buttonTextColor }]}>
							{photoUri ? "Analyze Another Meal" : "Take Picture"}
						</ThemedText>
					</TouchableOpacity>
				</View>

				{/* Card for Results (shown after photo is taken OR during loading) */}
				{(photoUri || isLoading) && (
					<View style={[styles.card, { backgroundColor: cardBackground }]}>
						<ThemedText type="subtitle" style={styles.cardTitle}>
							Analysis Results
						</ThemedText>

						{isLoading ? (
							<ThemedText style={styles.infoText}>
								Analyzing image...
							</ThemedText>
						) : nutritionalInfo ? (
							<>
								{/* Display Model Confidence */}
								{modelConfidence !== null && (
									<>
										<ThemedText style={styles.infoLabel}>
											Model Confidence:
										</ThemedText>
										<ThemedText style={styles.infoText}>
											{(modelConfidence * 100).toFixed(0)}%{" "}
											{/* Display as percentage */}
										</ThemedText>
									</>
								)}

								{/* Display Nutritional Values */}
								<ThemedText style={[styles.infoLabel, { marginTop: 15 }]}>
									Nutritional Values:
								</ThemedText>
								<ThemedText style={styles.infoText}>
									{nutritionalInfo}
								</ThemedText>

								{/* User Rating Section */}
								<ThemedText style={[styles.infoLabel, { marginTop: 15 }]}>
									Rate this Analysis:
								</ThemedText>
								<StarRating
									rating={userRating} // Pass the user's current rating state
									onRate={handleSetUserRating} // Pass the handler function
									size={32} // Make stars larger for interaction
								/>
							</>
						) : (
							// Handle case where loading finished but no info (e.g., error)
							<ThemedText style={styles.infoText}>
								Could not analyze image.
							</ThemedText>
						)}
					</View>
				)}
			</ScrollView>
		</ThemedView>
	);
}

// Styles (add or adjust as needed)
const styles = StyleSheet.create({
	// ... (Keep existing styles: container, headerButton, content, contentContainer, card, cardTitle) ...
	container: {
		flex: 1,
	},
	headerButton: {
		marginRight: 15,
		padding: 5,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		padding: 16,
		paddingBottom: 32, // Ensure space at the bottom
	},
	card: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	cardTitle: {
		marginBottom: 15,
		textAlign: "center",
	},
	photoContainer: {
		alignItems: "center",
		marginVertical: 16,
		width: "100%",
	},
	photo: {
		width: "90%",
		aspectRatio: 1,
		borderRadius: 8,
		marginTop: 8,
		resizeMode: "cover",
	},
	placeholder: {
		height: 180,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		marginVertical: 20,
		width: "90%",
		padding: 15,
	},
	placeholderText: {
		marginTop: 10,
		fontStyle: "italic",
		textAlign: "center",
		opacity: 0.8,
	},
	button: {
		flexDirection: "row",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 16,
		minWidth: 180,
		alignSelf: "center",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	infoLabel: {
		fontWeight: "bold",
		marginTop: 10,
		fontSize: 16,
	},
	infoText: {
		fontSize: 15,
		marginTop: 5,
		lineHeight: 22,
	},
});
