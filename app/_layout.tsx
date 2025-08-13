import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { COLORS } from "../assets/constants/Colors.js";
import SafeScreen from "../components/safeScreen.jsx";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
