import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Button,
	Alert,
	TouchableOpacity,
	ScrollView,
	Image,
	Text,
	Modal,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { CameraComponent } from "@/components/CameraComponent";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";

// --- Data Structure and Fake Data ---
interface FoodItem {
	id: string;
	name: string;
	mealCategory?: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
}

// Food database (available items to choose from)
const availableFoodItems: FoodItem[] = [
	{ id: "1", name: "Apple" },
	{ id: "2", name: "Chicken Breast (100g)" },
	{ id: "3", name: "Brown Rice (cooked, 1 cup)" },
	{ id: "4", name: "Broccoli (1 cup)" },
	{ id: "5", name: "Whole Wheat Bread" },
	{ id: "6", name: "Scrambled Eggs" },
	{ id: "7", name: "Greek Yogurt" },
	{ id: "8", name: "Grilled Salmon" },
	{ id: "9", name: "Quinoa Salad" },
	{ id: "10", name: "Mixed Nuts" },
	{ id: "11", name: "Banana" },
	{ id: "12", name: "Oatmeal" },
	{ id: "13", name: "Sweet Potato" },
	{ id: "14", name: "Tofu" },
	{ id: "15", name: "Avocado" },
];

type CameraMode = "buffet" | "plate" | "container" | null;
type MealCategory = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export default function StaffDashboardScreen() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [trackedFoodItems, setTrackedFoodItems] = useState<FoodItem[]>([]);
	const [expandedMeals, setExpandedMeals] = useState<
		Record<MealCategory, boolean>
	>({
		Breakfast: true,
		Lunch: false,
		Dinner: false,
		Snacks: false,
	});

	// Food selection modal state
	const [showFoodModal, setShowFoodModal] = useState(false);
	const [selectedMeal, setSelectedMeal] = useState<MealCategory | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Camera & measurement states
	const [showCamera, setShowCamera] = useState(false);
	const [cameraMode, setCameraMode] = useState<CameraMode>(null);
	const [activeFoodItem, setActiveFoodItem] = useState<FoodItem | null>(null);
	const [weight, setWeight] = useState("");
	const [volume, setVolume] = useState("");
	const [density, setDensity] = useState<number | null>(null);

	// Image states
	const [imageData, setImageData] = useState<
		Record<
			string,
			{
				buffet: string[];
				plate: string[];
				container: string[];
			}
		>
	>({});

	// Theme colors
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const iconColor = useThemeColor({}, "icon");
	const separatorColor = useThemeColor({}, "separator");
	const headerColor = useThemeColor({}, "header");
	const accentColor = useThemeColor({}, "primary");
	const secondaryColor = useThemeColor({}, "secondary");

	// Navigation for date
	const goToPreviousDay = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(currentDate.getDate() - 1);
		setCurrentDate(newDate);
	};

	const goToNextDay = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(currentDate.getDate() + 1);
		setCurrentDate(newDate);
	};

	const formatDate = () => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const month = months[currentDate.getMonth()];
		const day = currentDate.getDate();
		return `${month} ${day}`;
	};

	const handleLogout = () => {
		console.log("Logging out...");
		router.replace("/");
	};

	const toggleMealExpansion = (meal: MealCategory) => {
		setExpandedMeals((prev) => ({
			...prev,
			[meal]: !prev[meal],
		}));
	};

	const openFoodItemSelection = (mealCategory: MealCategory) => {
		setSelectedMeal(mealCategory);
		setShowFoodModal(true);
		setSearchTerm("");
	};

	const addFoodToMeal = (foodItem: FoodItem) => {
		if (!selectedMeal) return;

		const newItem = {
			...foodItem,
			id: `${foodItem.id}-${Date.now()}`, // Make unique ID
			mealCategory: selectedMeal,
		};

		setTrackedFoodItems((prev) => [...prev, newItem]);
		setShowFoodModal(false);

		// Initialize image data structure for this item
		setImageData((prev) => ({
			...prev,
			[newItem.id]: { buffet: [], plate: [], container: [] },
		}));
	};

	const openFoodItemDetails = (item: FoodItem) => {
		setActiveFoodItem(item);
		// Reset measurement data
		setWeight("");
		setVolume("");
		setDensity(null);
	};

	const closeFoodItemDetails = () => {
		setActiveFoodItem(null);
	};

	const openCamera = (mode: CameraMode) => {
		if (!activeFoodItem) {
			Alert.alert("No Food Item Selected", "Please select a food item first.");
			return;
		}
		setCameraMode(mode);
		setShowCamera(true);
	};

	const handlePictureTaken = (uri: string | null) => {
		setShowCamera(false);
		if (uri && cameraMode && activeFoodItem) {
			const itemId = activeFoodItem.id;
			setImageData((prev) => {
				const updatedItem = { ...prev[itemId] };
				updatedItem[cameraMode] = [...updatedItem[cameraMode], uri];
				return { ...prev, [itemId]: updatedItem };
			});
		}
		setCameraMode(null);
	};

	const calculateDensity = () => {
		const w = parseFloat(weight);
		const v = parseFloat(volume);
		if (!isNaN(w) && !isNaN(v) && v > 0) {
			setDensity(w / v);
			Alert.alert(
				"Density Calculated",
				`Density: ${(w / v).toFixed(2)} g/mL (or g/cm³)`,
			);
		} else if (!isNaN(w) && volume === "") {
			Alert.alert("Weight Recorded", `Weight: ${w.toFixed(2)} g`);
			setDensity(null);
		} else {
			Alert.alert(
				"Invalid Input",
				"Please enter valid numeric weight and optional positive volume.",
			);
			setDensity(null);
		}
	};

	const renderImageThumbnails = (images: string[], title: string) => (
		<View style={styles.thumbnailContainer}>
			<ThemedText style={styles.subHeader}>{title}</ThemedText>
			{images.length === 0 ? (
				<ThemedText style={styles.noImagesText}>No images taken yet</ThemedText>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.thumbnailScroll}
				>
					{images.map((uri, index) => (
						<Image key={index} source={{ uri }} style={styles.thumbnail} />
					))}
				</ScrollView>
			)}
		</View>
	);

	// Food selection modal
	const renderFoodSelectionModal = () => {
		const filteredItems = availableFoodItems.filter((item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);

		return (
			<Modal
				visible={showFoodModal}
				animationType="slide"
				transparent={false}
				onRequestClose={() => setShowFoodModal(false)}
			>
				<ThemedView style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<TouchableOpacity onPress={() => setShowFoodModal(false)}>
							<MaterialIcons name="close" size={24} color={iconColor} />
						</TouchableOpacity>
						<ThemedText style={styles.modalTitle}>
							Select Food Item for {selectedMeal}
						</ThemedText>
						<View style={{ width: 24 }} />
					</View>

					<ThemedTextInput
						style={styles.searchInput}
						placeholder="Search food items..."
						value={searchTerm}
						onChangeText={setSearchTerm}
					/>

					<ScrollView style={styles.foodItemList}>
						{filteredItems.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.foodItemSelection}
								onPress={() => addFoodToMeal(item)}
							>
								<View style={styles.foodIcon}>
									<MaterialIcons
										name="restaurant"
										size={24}
										color={iconColor}
									/>
								</View>
								<ThemedText style={styles.foodItemName}>{item.name}</ThemedText>
								<MaterialIcons name="add" size={24} color={accentColor} />
							</TouchableOpacity>
						))}
						{filteredItems.length === 0 && (
							<ThemedText style={styles.noResultsText}>
								No food items found
							</ThemedText>
						)}
					</ScrollView>
				</ThemedView>
			</Modal>
		);
	};

	// If camera is active, show only the camera component
	if (showCamera) {
		return <CameraComponent onPictureTaken={handlePictureTaken} />;
	}

	// Food Item Detail View
	if (activeFoodItem) {
		const itemImages = imageData[activeFoodItem.id] || {
			buffet: [],
			plate: [],
			container: [],
		};

		return (
			<ThemedView style={styles.container}>
				<View style={styles.detailHeader}>
					<TouchableOpacity onPress={closeFoodItemDetails}>
						<MaterialIcons name="arrow-back" size={24} color={iconColor} />
					</TouchableOpacity>
					<ThemedText style={styles.detailTitle}>
						{activeFoodItem.name}
					</ThemedText>
					<View style={{ width: 24 }} />
				</View>

				<ScrollView style={styles.detailContent}>
					{/* Weight & Density Section */}
					<View style={styles.section}>
						<ThemedText style={styles.subHeader}>Weight & Density</ThemedText>
						<ThemedTextInput
							style={styles.input}
							placeholder="Weight (grams)"
							value={weight}
							onChangeText={setWeight}
							keyboardType="numeric"
						/>
						<ThemedTextInput
							style={styles.input}
							placeholder="Volume (mL or cm³, optional)"
							value={volume}
							onChangeText={setVolume}
							keyboardType="numeric"
						/>
						<Button
							title="Record Weight / Calculate Density"
							onPress={calculateDensity}
						/>
						{density !== null && (
							<ThemedText style={styles.densityText}>
								Calculated Density: {density.toFixed(2)} g/mL
							</ThemedText>
						)}
					</View>

					{/* Image Capture Section */}
					<View style={styles.section}>
						<ThemedText style={styles.subHeader}>Capture Images</ThemedText>
						<View style={styles.buttonRow}>
							<Button
								title="Take Buffet Photo"
								onPress={() => openCamera("buffet")}
							/>
							<Button
								title="Take Plate Photo"
								onPress={() => openCamera("plate")}
							/>
							<Button
								title="Take Container Photo"
								onPress={() => openCamera("container")}
							/>
						</View>
					</View>

					{/* Image Thumbnails Display */}
					{renderImageThumbnails(itemImages.buffet, "Buffet Images")}
					{renderImageThumbnails(itemImages.plate, "Plate Images")}
					{renderImageThumbnails(itemImages.container, "Container Images")}
				</ScrollView>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			{/* Date navigation header - Cronometer Style */}
			<View style={[styles.dateHeader, { backgroundColor: headerColor }]}>
				<TouchableOpacity onPress={goToPreviousDay} style={styles.dateArrow}>
					<MaterialIcons name="chevron-left" size={28} color={textColor} />
				</TouchableOpacity>

				<ThemedText style={styles.dateTitle}>{formatDate()}</ThemedText>

				<TouchableOpacity onPress={goToNextDay} style={styles.dateArrow}>
					<MaterialIcons name="chevron-right" size={28} color={textColor} />
				</TouchableOpacity>

				<TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
					<MaterialIcons name="logout" size={24} color={textColor} />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.mealList}>
				{/* Breakfast Section */}
				<View style={styles.mealSection}>
					<TouchableOpacity
						style={styles.mealHeader}
						onPress={() => toggleMealExpansion("Breakfast")}
					>
						<ThemedText style={styles.mealTitle}>Breakfast</ThemedText>
						<MaterialIcons
							name={expandedMeals.Breakfast ? "expand-less" : "expand-more"}
							size={24}
							color={iconColor}
						/>
					</TouchableOpacity>

					{expandedMeals.Breakfast && (
						<View style={styles.mealContent}>
							{/* List food items for breakfast */}
							{trackedFoodItems
								.filter((item) => item.mealCategory === "Breakfast")
								.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={styles.foodItem}
										onPress={() => openFoodItemDetails(item)}
									>
										<View style={styles.foodItemContent}>
											<View style={styles.foodIcon}>
												<MaterialIcons
													name="restaurant"
													size={24}
													color={iconColor}
												/>
											</View>
											<ThemedText style={styles.foodItemName}>
												{item.name}
											</ThemedText>
											<MaterialIcons
												name="chevron-right"
												size={24}
												color={iconColor}
											/>
										</View>
									</TouchableOpacity>
								))}

							{/* Add food button */}
							<TouchableOpacity
								style={styles.addFoodButton}
								onPress={() => openFoodItemSelection("Breakfast")}
							>
								<MaterialIcons name="add" size={24} color={accentColor} />
								<ThemedText style={styles.addFoodText}>Add Food</ThemedText>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* Lunch Section */}
				<View style={styles.mealSection}>
					<TouchableOpacity
						style={styles.mealHeader}
						onPress={() => toggleMealExpansion("Lunch")}
					>
						<ThemedText style={styles.mealTitle}>Lunch</ThemedText>
						<MaterialIcons
							name={expandedMeals.Lunch ? "expand-less" : "expand-more"}
							size={24}
							color={iconColor}
						/>
					</TouchableOpacity>

					{expandedMeals.Lunch && (
						<View style={styles.mealContent}>
							{/* List food items for lunch */}
							{trackedFoodItems
								.filter((item) => item.mealCategory === "Lunch")
								.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={styles.foodItem}
										onPress={() => openFoodItemDetails(item)}
									>
										<View style={styles.foodItemContent}>
											<View style={styles.foodIcon}>
												<MaterialIcons
													name="restaurant"
													size={24}
													color={iconColor}
												/>
											</View>
											<ThemedText style={styles.foodItemName}>
												{item.name}
											</ThemedText>
											<MaterialIcons
												name="chevron-right"
												size={24}
												color={iconColor}
											/>
										</View>
									</TouchableOpacity>
								))}

							{/* Add food button */}
							<TouchableOpacity
								style={styles.addFoodButton}
								onPress={() => openFoodItemSelection("Lunch")}
							>
								<MaterialIcons name="add" size={24} color={accentColor} />
								<ThemedText style={styles.addFoodText}>Add Food</ThemedText>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* Dinner Section */}
				<View style={styles.mealSection}>
					<TouchableOpacity
						style={styles.mealHeader}
						onPress={() => toggleMealExpansion("Dinner")}
					>
						<ThemedText style={styles.mealTitle}>Dinner</ThemedText>
						<MaterialIcons
							name={expandedMeals.Dinner ? "expand-less" : "expand-more"}
							size={24}
							color={iconColor}
						/>
					</TouchableOpacity>

					{expandedMeals.Dinner && (
						<View style={styles.mealContent}>
							{/* List food items for dinner */}
							{trackedFoodItems
								.filter((item) => item.mealCategory === "Dinner")
								.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={styles.foodItem}
										onPress={() => openFoodItemDetails(item)}
									>
										<View style={styles.foodItemContent}>
											<View style={styles.foodIcon}>
												<MaterialIcons
													name="restaurant"
													size={24}
													color={iconColor}
												/>
											</View>
											<ThemedText style={styles.foodItemName}>
												{item.name}
											</ThemedText>
											<MaterialIcons
												name="chevron-right"
												size={24}
												color={iconColor}
											/>
										</View>
									</TouchableOpacity>
								))}

							{/* Add food button */}
							<TouchableOpacity
								style={styles.addFoodButton}
								onPress={() => openFoodItemSelection("Dinner")}
							>
								<MaterialIcons name="add" size={24} color={accentColor} />
								<ThemedText style={styles.addFoodText}>Add Food</ThemedText>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* Snacks Section */}
				<View style={styles.mealSection}>
					<TouchableOpacity
						style={styles.mealHeader}
						onPress={() => toggleMealExpansion("Snacks")}
					>
						<ThemedText style={styles.mealTitle}>Snacks</ThemedText>
						<MaterialIcons
							name={expandedMeals.Snacks ? "expand-less" : "expand-more"}
							size={24}
							color={iconColor}
						/>
					</TouchableOpacity>

					{expandedMeals.Snacks && (
						<View style={styles.mealContent}>
							{/* List food items for snacks */}
							{trackedFoodItems
								.filter((item) => item.mealCategory === "Snacks")
								.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={styles.foodItem}
										onPress={() => openFoodItemDetails(item)}
									>
										<View style={styles.foodItemContent}>
											<View style={styles.foodIcon}>
												<MaterialIcons
													name="restaurant"
													size={24}
													color={iconColor}
												/>
											</View>
											<ThemedText style={styles.foodItemName}>
												{item.name}
											</ThemedText>
											<MaterialIcons
												name="chevron-right"
												size={24}
												color={iconColor}
											/>
										</View>
									</TouchableOpacity>
								))}

							{/* Add food button */}
							<TouchableOpacity
								style={styles.addFoodButton}
								onPress={() => openFoodItemSelection("Snacks")}
							>
								<MaterialIcons name="add" size={24} color={accentColor} />
								<ThemedText style={styles.addFoodText}>Add Food</ThemedText>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</ScrollView>

			{/* Food Selection Modal */}
			{renderFoodSelectionModal()}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	// Date Header - Cronometer Style
	dateHeader: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingTop: 50,
		paddingBottom: 15,
	},
	dateArrow: {
		padding: 10,
	},
	dateTitle: {
		fontSize: 24,
		fontWeight: "bold",
		flex: 1,
		textAlign: "center",
	},
	logoutButton: {
		padding: 10,
	},
	// Meal Sections
	mealList: {
		flex: 1,
	},
	mealSection: {
		marginBottom: 1, // Minimal gap between sections
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	mealHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 15,
		backgroundColor: "rgba(0,0,0,0.05)",
	},
	mealTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	mealContent: {
		paddingBottom: 10,
	},
	// Food Items
	foodItem: {
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	foodItemContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 15,
	},
	foodIcon: {
		marginRight: 10,
	},
	foodItemName: {
		flex: 1,
		fontSize: 16,
	},
	// Add Food Button
	addFoodButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 15,
	},
	addFoodText: {
		marginLeft: 10,
		fontSize: 16,
		color: "#2196F3", // Blue color for add action
	},
	// Modal for food selection
	modalContainer: {
		flex: 1,
		paddingTop: 40,
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	modalTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
	},
	searchInput: {
		margin: 15,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
	},
	foodItemList: {
		flex: 1,
	},
	foodItemSelection: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	noResultsText: {
		textAlign: "center",
		padding: 20,
		fontStyle: "italic",
		color: "#888",
	},
	// Detail View
	detailHeader: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingTop: 50,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
	},
	detailTitle: {
		flex: 1,
		fontSize: 20,
		fontWeight: "600",
		textAlign: "center",
	},
	detailContent: {
		flex: 1,
	},
	// Sections
	section: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	subHeader: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 15,
	},
	input: {
		marginBottom: 15,
	},
	densityText: {
		marginTop: 10,
		fontSize: 16,
		fontStyle: "italic",
		textAlign: "center",
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 15,
		flexWrap: "wrap",
		gap: 10,
	},
	// Thumbnails
	thumbnailContainer: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	thumbnailScroll: {
		marginTop: 5,
	},
	thumbnail: {
		width: 100,
		height: 100,
		borderRadius: 8,
		marginRight: 10,
		borderWidth: 1,
		borderColor: "#ccc",
	},
	noImagesText: {
		fontSize: 14,
		color: "#888",
		fontStyle: "italic",
	},
});
