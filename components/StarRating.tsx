import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native"; // Added TouchableOpacity
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

interface StarRatingProps {
	rating: number | null; // Current rating value (can be null if unrated)
	maxStars?: number;
	size?: number;
	onRate?: (rating: number) => void; // Optional: Callback function when user rates
	disabled?: boolean; // Optional: Disable interaction
}

export function StarRating({
	rating,
	maxStars = 5,
	size = 28, // Slightly larger default for interaction
	onRate,
	disabled = false, // Default to interactive if onRate is provided
}: StarRatingProps) {
	const starColor = useThemeColor({}, "tint");
	const emptyStarColor = useThemeColor({}, "icon");
	// Determine if the component should be interactive
	const isInteractive = !!onRate && !disabled;

	const handlePress = (index: number) => {
		if (isInteractive && onRate) {
			onRate(index + 1); // Rating is 1-based index + 1
		}
	};

	const filledStars = rating ? Math.floor(rating) : 0;
	const displayRating = rating ?? 0; 
	const fullStars = Math.floor(displayRating);
	const halfStar = !isInteractive && displayRating % 1 >= 0.5; 
	const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

	return (
		<View style={styles.container}>
			{[...Array(maxStars)].map((_, i) => {
				const starValue = i + 1;
				let iconName: "star" | "star-border" | "star-half" = "star-border";
				let color = emptyStarColor;

				if (rating !== null) {
					if (i < fullStars) {
						iconName = "star";
						color = starColor;
					} else if (i === fullStars && halfStar) {
						iconName = "star-half";
						color = starColor;
					}
				}

				return (
					<TouchableOpacity
						key={i}
						onPress={() => handlePress(i)}
						disabled={!isInteractive}
						style={styles.starTouchable} 
					>
						<MaterialIcons
							name={iconName}
							size={size}
							color={
								isInteractive && rating !== null && starValue <= rating
									? starColor
									: color
							} 
						/>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 5,
	},
	starTouchable: {
		paddingHorizontal: 3, 
	},
});
