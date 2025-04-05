import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	FlatList,
	Alert,
	TouchableOpacity,
	Modal,
	TextInput,
	ScrollView, // Use ScrollView for Modal content if it gets long
	Platform,
	KeyboardAvoidingView, // Handle keyboard overlap
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";

// Define the structure for a food item
interface FoodItem {
	id: string;
	name: string;
	description?: string; // Optional description
	// Add other relevant fields later e.g., imageUrl, calories etc.
}

// Generate some fake initial data
const generateInitialData = (count: number): FoodItem[] => {
	const items: FoodItem[] = [];
	const sampleNames = [
		"Dal Makhani",
		"Paneer Butter Masala",
		"Chicken Curry",
		"Vegetable Biryani",
		"Roti",
		"Rice",
		"Gulab Jamun",
		"Salad",
		"Samosa",
		"Idli",
		"Dosa",
		"Upma",
		"Chole Bhature",
		"Aloo Gobi",
		"Mixed Veg",
	];
	for (let i = 0; i < count; i++) {
		const name =
			sampleNames[i % sampleNames.length] +
			(count > sampleNames.length
				? ` ${Math.floor(i / sampleNames.length) + 1}`
				: "");
		items.push({
			id: `item-${Date.now()}-${i}`, // Simple unique ID
			name: name,
			description: `Description for ${name}`,
		});
	}
	return items;
};

export default function AdminScreen() {
	const router = useRouter();
	const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentItem, setCurrentItem] = useState<FoodItem | null>(null); // For editing
	const [itemName, setItemName] = useState("");
	const [itemDescription, setItemDescription] = useState("");

	const cardBackground = useThemeColor({}, "headerBackground");
	const textColor = useThemeColor({}, "text");
	const iconColor = useThemeColor({}, "icon");
	const primaryColor = useThemeColor({}, "primary");
	const buttonTextColor = useThemeColor({}, "background");
	const borderColor = useThemeColor({}, "border"); // For input borders

	// Load initial data on mount
	useEffect(() => {
		setFoodItems(generateInitialData(12)); // Generate 10-15 items as requested for fake data
	}, []);

	// --- CRUD Handlers ---

	const handleAddNew = () => {
		setCurrentItem(null); // Ensure we are adding, not editing
		setItemName("");
		setItemDescription("");
		setModalVisible(true);
	};

	const handleEdit = (item: FoodItem) => {
		setCurrentItem(item);
		setItemName(item.name);
		setItemDescription(item.description || "");
		setModalVisible(true);
	};

	const handleDelete = (id: string) => {
		Alert.alert(
			"Confirm Delete",
			"Are you sure you want to delete this item?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						setFoodItems((prevItems) =>
							prevItems.filter((item) => item.id !== id),
						);
					},
				},
			],
		);
	};

	const handleSave = () => {
		if (!itemName.trim()) {
			Alert.alert("Error", "Item name cannot be empty.");
			return;
		}

		if (currentItem) {
			// Editing existing item
			setFoodItems((prevItems) =>
				prevItems.map((item) =>
					item.id === currentItem.id
						? {
								...item,
								name: itemName.trim(),
								description: itemDescription.trim(),
							}
						: item,
				),
			);
		} else {
			// Adding new item
			const newItem: FoodItem = {
				id: `item-${Date.now()}`, // Simple unique ID
				name: itemName.trim(),
				description: itemDescription.trim(),
			};
			setFoodItems((prevItems) => [newItem, ...prevItems]); // Add to the top
		}

		setModalVisible(false);
		// Clear form state
		setCurrentItem(null);
		setItemName("");
		setItemDescription("");
	};

	// Function to handle logout (similar to UserScreen)
	const handleLogout = () => {
		router.replace("/"); // Navigate back to login
	};

	// --- Render Item ---
	const renderItem = ({ item }: { item: FoodItem }) => (
		<View style={[styles.itemContainer, { backgroundColor: cardBackground }]}>
			<View style={styles.itemTextContainer}>
				<ThemedText style={styles.itemName}>{item.name}</ThemedText>
				{item.description && (
					<ThemedText style={styles.itemDescription} numberOfLines={2}>
						{item.description}
					</ThemedText>
				)}
			</View>
			<View style={styles.itemActions}>
				<TouchableOpacity
					onPress={() => handleEdit(item)}
					style={styles.actionButton}
				>
					<MaterialIcons name="edit" size={24} color={iconColor} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => handleDelete(item.id)}
					style={styles.actionButton}
				>
					<MaterialIcons name="delete" size={24} color={"red"} />{" "}
					{/* Use red for delete */}
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen
				options={{
					title: "Admin Dashboard",
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

			<FlatList
				data={foodItems}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				style={styles.list}
				ListHeaderComponent={
					// Button to add new item at the top
					<TouchableOpacity
						style={[styles.addButton, { backgroundColor: primaryColor }]}
						onPress={handleAddNew}
					>
						<MaterialIcons name="add" size={24} color={buttonTextColor} />
						<ThemedText
							style={[styles.addButtonText, { color: buttonTextColor }]}
						>
							Add New Food Item
						</ThemedText>
					</TouchableOpacity>
				}
				ListEmptyComponent={
					<ThemedText style={styles.emptyListText}>
						No food items found. Add some!
					</ThemedText>
				}
				contentContainerStyle={styles.listContentContainer}
			/>

			{/* Add/Edit Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
					// Optionally reset state if modal is closed via back button etc.
					setCurrentItem(null);
					setItemName("");
					setItemDescription("");
				}}
			>
				{/* Use KeyboardAvoidingView for better input handling */}
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalOverlay}
				>
					<View style={[styles.modalView, { backgroundColor: cardBackground }]}>
						<ScrollView>
							<ThemedText style={styles.modalTitle}>
								{currentItem ? "Edit Food Item" : "Add New Food Item"}
							</ThemedText>

							<ThemedText style={styles.inputLabel}>Name *</ThemedText>
							<TextInput
								style={[
									styles.input,
									{ color: textColor, borderColor: borderColor },
								]}
								placeholder="Enter item name"
								placeholderTextColor={iconColor} // Use iconColor for placeholder contrast
								value={itemName}
								onChangeText={setItemName}
							/>

							<ThemedText style={styles.inputLabel}>Description</ThemedText>
							<TextInput
								style={[
									styles.input,
									styles.textArea,
									{ color: textColor, borderColor: borderColor },
								]}
								placeholder="Enter item description (optional)"
								placeholderTextColor={iconColor}
								value={itemDescription}
								onChangeText={setItemDescription}
								multiline={true}
								numberOfLines={3}
							/>

							<View style={styles.modalActions}>
								<TouchableOpacity
									style={[styles.modalButton, styles.cancelButton]}
									onPress={() => setModalVisible(false)}
								>
									<ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.modalButton,
										styles.saveButton,
										{ backgroundColor: primaryColor },
									]}
									onPress={handleSave}
								>
									<ThemedText
										style={[styles.modalButtonText, { color: buttonTextColor }]}
									>
										Save
									</ThemedText>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		</ThemedView>
	);
}

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerButton: {
		marginRight: 15,
		padding: 5,
	},
	list: {
		flex: 1,
	},
	listContentContainer: {
		padding: 16,
	},
	addButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		borderRadius: 8,
		marginBottom: 16, // Space below add button
	},
	addButtonText: {
		marginLeft: 8,
		fontSize: 16,
		fontWeight: "bold",
	},
	emptyListText: {
		textAlign: "center",
		marginTop: 50,
		fontSize: 16,
		color: "#888", // Use a subtle color
	},
	itemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 15,
		marginBottom: 10,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	itemTextContainer: {
		flex: 1, // Allow text to take available space
		marginRight: 10, // Space between text and actions
	},
	itemName: {
		fontSize: 16,
		fontWeight: "bold",
	},
	itemDescription: {
		fontSize: 13,
		opacity: 0.8,
		marginTop: 4,
	},
	itemActions: {
		flexDirection: "row",
	},
	actionButton: {
		marginLeft: 15, // Space between edit/delete buttons
		padding: 5, // Increase touch area
	},
	// Modal Styles
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
	},
	modalView: {
		margin: 20,
		borderRadius: 12,
		padding: 25, // Increased padding
		width: "90%", // Modal width
		maxHeight: "80%", // Prevent modal from being too tall
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		marginBottom: 20, // Increased spacing
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
	},
	inputLabel: {
		fontSize: 14,
		marginBottom: 5,
		marginLeft: 2, // Align with input border
		opacity: 0.9,
	},
	input: {
		height: 45, // Increased height
		borderWidth: 1,
		borderRadius: 8, // More rounded corners
		paddingHorizontal: 12, // Increased padding
		marginBottom: 15, // Increased spacing
		fontSize: 15,
	},
	textArea: {
		height: 80, // Height for description
		textAlignVertical: "top", // Align text to top for multiline
		paddingTop: 10, // Padding top for multiline
	},
	modalActions: {
		flexDirection: "row",
		justifyContent: "flex-end", // Align buttons to the right
		marginTop: 20,
	},
	modalButton: {
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginLeft: 10,
		minWidth: 80, // Ensure minimum button width
		alignItems: "center", // Center text
	},
	cancelButton: {
		backgroundColor: "#ccc", // A standard cancel color
	},
	saveButton: {
		// backgroundColor set by primaryColor
	},
	modalButtonText: {
		fontWeight: "bold",
		fontSize: 15,
	},
});
