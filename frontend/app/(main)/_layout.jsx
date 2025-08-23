import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: "Settings", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="notification"
        options={{
          title: "Notification",
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/settings")} // ✅ correct usage in expo-router
              style={{ marginRight: 16 }}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}