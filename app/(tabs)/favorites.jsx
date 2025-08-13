import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { API_URL } from "../../assets/constants/api.js";
import { favoritesStyles } from "../../assets/style/favorites.styles.js";
import { COLORS } from "../../assets/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";

const FavoritesScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/favorites/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch favorites");

      const favorites = await response?.json();

      // transform the data to match the RecipeCard component's expected format
      const transformedFavorites = favorites.map((favorite) => ({
        ...favorite,
        id: favorite.recipeId,
      }));

      setFavoriteRecipes(transformedFavorites);
    } catch (error) {
      console.log("Error loading favorites", error);
      Alert.alert("Error", "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavorites();
    }, [])
  );

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default FavoritesScreen;
