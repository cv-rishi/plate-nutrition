import React, { useState, useRef, useEffect } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Alert,
	Platform,
	Button,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CameraComponentProps = {
	onPictureTaken: (uri: string) => void;
	onClose: () => void;
};

export function CameraComponent({
	onPictureTaken,
	onClose,
}: CameraComponentProps) {
	const [permission, requestPermission] = useCameraPermissions();
	const [facing, setFacing] = useState<CameraType>("back");
	const cameraRef = useRef<CameraView>(null); // Ref type updated to CameraView
	const iconColor = useThemeColor({}, "icon");
	const buttonBackgroundColor = useThemeColor({}, "primary");
	const buttonTextColor = useThemeColor({}, "background");

	useEffect(() => {
		const loadCameraType = async () => {
			const savedType = await AsyncStorage.getItem("cameraType");
			if (savedType === "front") {
				setFacing("front");
			} else {
				setFacing("back"); // Default to 'back'
			}
		};
		loadCameraType();
	}, []);

	if (!permission) {
		// Permissions are still loading
		return (
			<View style={styles.centered}>
				<Text>Requesting camera permissions...</Text>
			</View>
		);
	}

	if (!permission.granted) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Stack.Screen options={{ headerShown: false }} />{" "}
				{/* Optionally hide header */}
				<Text style={styles.message}>
					We need your permission to show the camera.
				</Text>
				<Button onPress={requestPermission} title="Grant Permission" />
				<Button onPress={onClose} title="Cancel" />
			</View>
		);
	}

	const toggleCameraFacing = async () => {
		const newFacing = facing === "back" ? "front" : "back";
		setFacing(newFacing);
		await AsyncStorage.setItem("cameraType", newFacing);
	};

	const takePicture = async () => {
		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync({
					quality: 0.7,
					base64: false,
				});
				if (photo?.uri) {
					onPictureTaken(photo.uri);
				} else {
					console.error("Failed to take picture: No URI returned");
					Alert.alert("Error", "Could not capture image.");
				}
			} catch (error) {
				console.error("Failed to take picture:", error);
				Alert.alert("Error", "Could not take picture.");
			}
		}
	};

	return (
		// Use CameraView instead of Camera
		<View style={styles.cameraContainer}>
			<CameraView
				ref={cameraRef}
				style={styles.camera}
				facing={facing} // Use facing prop
				// FlashMode might be handled differently or via props if needed
				// ratio="16:9" // Ratio might not be needed or set differently
			>
				{/* Keep controls within the CameraView or overlay them */}
				<View style={styles.cameraControls}>
					{/* Close Button */}
					<TouchableOpacity style={styles.controlButton} onPress={onClose}>
						<MaterialIcons name="close" size={30} color={iconColor} />
					</TouchableOpacity>
					{/* Flip Camera Button */}
					<TouchableOpacity
						style={styles.controlButton}
						onPress={toggleCameraFacing}
					>
						<MaterialIcons name="flip-camera-ios" size={30} color={iconColor} />
					</TouchableOpacity>
				</View>
			</CameraView>

			{/* Capture Button outside CameraView for positioning */}
			<TouchableOpacity
				style={[
					styles.captureButton,
					{ backgroundColor: buttonBackgroundColor },
				]}
				onPress={takePicture}
			>
				<MaterialIcons name="camera" size={40} color={buttonTextColor} />
			</TouchableOpacity>
		</View>
	);
}

// Styles remain largely the same, adjust as needed
const styles = StyleSheet.create({
	container: {
		// Added for permission screen
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	centered: {
		// Added for centering content
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	message: {
		// Added for permission screen
		textAlign: "center",
		marginBottom: 20,
		fontSize: 16,
	},
	cameraContainer: {
		flex: 1,
		width: "100%",
		backgroundColor: "#000",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	camera: {
		// Adjust camera style: Make it cover most of the screen, leave space for controls maybe?
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 120, // Adjust space for the capture button area
	},
	cameraControls: {
		// Position controls at the top within the CameraView bounds or overlay
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "transparent",
		width: "100%", // Ensure controls span width
		paddingHorizontal: 20,
		paddingTop: Platform.OS === "ios" ? 50 : 30, // Adjust for status bar/notch
		position: "absolute", // Position controls over the camera view
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1, // Ensure controls are above the camera preview layer if needed
	},
	controlButton: {
		padding: 10,
		borderRadius: 50,
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	captureButton: {
		width: 70,
		height: 70,
		borderRadius: 35,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 40, // Adjusted margin
		position: "absolute", // Position capture button absolutely at the bottom center
		bottom: 10,
		alignSelf: "center",
		zIndex: 2, // Ensure capture button is easily pressable
	},
});
