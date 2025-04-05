import React, { useState } from "react";
import {
	View,
	FlatList,
	StyleSheet,
	Modal,
	Button,
	Alert,
	TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput"; // Assuming you create/have this
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router"; // For logout if needed

// Define the structure for food item data including nutrition
interface FoodItem {
	id: string;
	name: string;
	calories: number;
	protein: number; // grams
	carbs: number; // grams
	fat: number; // grams
}

// Fake data for now
const initialFoodData: FoodItem[] = [
	{ id: "1", name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
	{
		id: "2",
		name: "Chicken Breast (100g)",
		calories: 165,
		protein: 31,
		carbs: 0,
		fat: 3.6,
	},
	{
		id: "3",
		name: "Brown Rice (cooked, 1 cup)",
		calories: 215,
		protein: 5,
		carbs: 45,
		fat: 1.8,
	},
	{
		id: "4",
		name: "Broccoli (1 cup)",
		calories: 55,
		protein: 3.7,
		carbs: 11,
		fat: 0.6,
	},
];

export default function NutritionistDashboardScreen() {
	const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodData);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
	// State for the input fields in the modal
	const [editName, setEditName] = useState("");
	const [editCalories, setEditCalories] = useState("");
	const [editProtein, setEditProtein] = useState("");
	const [editCarbs, setEditCarbs] = useState("");
	const [editFat, setEditFat] = useState("");

	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const iconColor = useThemeColor({}, "icon");
	const separatorColor = useThemeColor({}, "separator");
	const inputBackgroundColor = useThemeColor({}, "inputBackground"); // Add this color to your theme setup

	const handleEditPress = (item: FoodItem) => {
		setSelectedItem(item);
		setEditName(item.name); // Pre-fill modal fields
		setEditCalories(item.calories.toString());
		setEditProtein(item.protein.toString());
		setEditCarbs(item.carbs.toString());
		setEditFat(item.fat.toString());
		setModalVisible(true);
	};

	const handleSave = () => {
		if (!selectedItem) return;

		// Basic validation (can be improved)
		const calories = parseFloat(editCalories);
		const protein = parseFloat(editProtein);
		const carbs = parseFloat(editCarbs);
		const fat = parseFloat(editFat);

		if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
			Alert.alert("Invalid Input", "Nutritional values must be numbers.");
			return;
		}
		if (!editName.trim()) {
			Alert.alert("Invalid Input", "Food item name cannot be empty.");
			return;
		}

		setFoodItems((prevItems) =>
			prevItems.map((item) =>
				item.id === selectedItem.id
					? { ...item, name: editName, calories, protein, carbs, fat }
					: item,
			),
		);
		setModalVisible(false);
		setSelectedItem(null); // Clear selection
	};

	const handleLogout = () => {
		// Add actual logout logic here (clear tokens/state) if implemented
		console.log("Logging out...");
		router.replace("/"); // Navigate to login screen
	};

	const renderItem = ({ item }: { item: FoodItem }) => (
		<View style={[styles.itemContainer, { borderBottomColor: separatorColor }]}>
			<View style={styles.itemTextContainer}>
				<ThemedText style={styles.itemName}>{item.name}</ThemedText>
				<ThemedText style={styles.itemDetail}>
					Cal: {item.calories} | P: {item.protein}g | C: {item.carbs}g | F:{" "}
					{item.fat}g
				</ThemedText>
			</View>
			<TouchableOpacity
				onPress={() => handleEditPress(item)}
				style={styles.iconButton}
			>
				<MaterialIcons name="edit" size={24} color={iconColor} />
			</TouchableOpacity>
		</View>
	);

	return (
		<ThemedView style={styles.container}>
			<View style={styles.header}>
				<ThemedText style={styles.title}>Nutritionist Dashboard</ThemedText>
				{/* Optional Logout Button */}
				<TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
					<MaterialIcons name="logout" size={24} color={iconColor} />
				</TouchableOpacity>
			</View>

			<FlatList
				data={foodItems}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				style={styles.list}
			/>

			{/* Edit Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
					setSelectedItem(null);
				}}
			>
				<View style={styles.modalCenteredView}>
					<ThemedView style={styles.modalView}>
						<ThemedText style={styles.modalTitle}>
							Edit Nutritional Info
						</ThemedText>

						<ThemedText style={styles.label}>Name</ThemedText>
						<ThemedTextInput
							style={styles.input} // Use ThemedTextInput
							placeholder="Food Item Name"
							value={editName}
							onChangeText={setEditName}
							// placeholderTextColor={useThemeColor({}, 'secondaryText')} // Optional: finer theme control
						/>

						<ThemedText style={styles.label}>Calories</ThemedText>
						<ThemedTextInput
							style={styles.input}
							placeholder="e.g., 150"
							value={editCalories}
							onChangeText={setEditCalories}
							keyboardType="numeric"
						/>

						<ThemedText style={styles.label}>Protein (g)</ThemedText>
						<ThemedTextInput
							style={styles.input}
							placeholder="e.g., 25"
							value={editProtein}
							onChangeText={setEditProtein}
							keyboardType="numeric"
						/>

						<ThemedText style={styles.label}>Carbs (g)</ThemedText>
						<ThemedTextInput
							style={styles.input}
							placeholder="e.g., 10"
							value={editCarbs}
							onChangeText={setEditCarbs}
							keyboardType="numeric"
						/>

						<ThemedText style={styles.label}>Fat (g)</ThemedText>
						<ThemedTextInput
							style={styles.input}
							placeholder="e.g., 5"
							value={editFat}
							onChangeText={setEditFat}
							keyboardType="numeric"
						/>

						<View style={styles.modalButtonContainer}>
							<Button
								title="Cancel"
								onPress={() => {
									setModalVisible(false);
									setSelectedItem(null);
								}}
								color="#ff6347"
							/>
							<Button title="Save" onPress={handleSave} />
						</View>
					</ThemedView>
				</View>
			</Modal>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingTop: 50, // Adjust for status bar height if needed (use SafeAreaView or react-native-safe-area-context)
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc", // Use theme color later
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	logoutButton: {
		padding: 5,
	},
	list: {
		flex: 1,
	},
	itemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		// borderBottomColor set dynamically
	},
	itemTextContainer: {
		flex: 1, // Allows text to take available space
		marginRight: 10, // Space before the button
	},
	itemName: {
		fontSize: 18,
		fontWeight: "500",
	},
	itemDetail: {
		fontSize: 14,
		opacity: 0.8,
		marginTop: 4,
	},
	iconButton: {
		padding: 8, // Increase touch area slightly
	},
	// Modal Styles (similar to adminDashboard)
	modalCenteredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
	},
	modalView: {
		margin: 20,
		borderRadius: 20,
		padding: 35,
		alignItems: "stretch", // Make items stretch
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: "90%", // Control modal width
	},
	modalTitle: {
		marginBottom: 20,
		textAlign: "center",
		fontSize: 20,
		fontWeight: "bold",
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
		// fontWeight: '500', // Optional
	},
	input: {
		// Using ThemedTextInput now, style it as needed or rely on ThemedTextInput's internal styles
		// Example styles if ThemedTextInput doesn't have them:
		// height: 40,
		// borderWidth: 1,
		// padding: 10,
		marginBottom: 15,
		// borderRadius: 5,
		// Specify themed border/background in ThemedTextInput or here
	},
	modalButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-around", // Space out buttons
		marginTop: 20,
	},
});
