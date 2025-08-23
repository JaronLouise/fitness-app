import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const theme = darkModeEnabled ? darkTheme : lightTheme;

  const handleLogout = () => {
    // TODO: Replace with your actual logout logic
    console.log("User logged out");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Section: Account */}
      <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>
        Account
      </Text>
      <TouchableOpacity style={[styles.row, { backgroundColor: theme.card }]}>
        <Ionicons name="person-outline" size={22} color={theme.icon} />
        <Text style={[styles.rowText, { color: theme.text }]}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.row, { backgroundColor: theme.card }]}>
        <Ionicons name="lock-closed-outline" size={22} color={theme.icon} />
        <Text style={[styles.rowText, { color: theme.text }]}>Privacy</Text>
      </TouchableOpacity>

      {/* Section: Preferences */}
      <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>
        Preferences
      </Text>
      <View style={[styles.row, { backgroundColor: theme.card }]}>
        <Ionicons name="notifications-outline" size={22} color={theme.icon} />
        <Text style={[styles.rowText, { color: theme.text }]}>
          Push Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          style={{ marginLeft: "auto" }}
        />
      </View>

      <View style={[styles.row, { backgroundColor: theme.card }]}>
        <Ionicons name="log-in-outline" size={22} color={theme.icon} />
        <Text style={[styles.rowText, { color: theme.text }]}>
          Login Alerts
        </Text>
        <Switch
          value={loginAlertsEnabled}
          onValueChange={setLoginAlertsEnabled}
          style={{ marginLeft: "auto" }}
        />
      </View>

      <View style={[styles.row, { backgroundColor: theme.card }]}>
        <Ionicons
          name={darkModeEnabled ? "moon-outline" : "sunny-outline"}
          size={22}
          color={theme.icon}
        />
        <Text style={[styles.rowText, { color: theme.text }]}>
          Dark Mode
        </Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          style={{ marginLeft: "auto" }}
        />
      </View>

      {/* Section: Support */}
      <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>
        Support
      </Text>
      <TouchableOpacity style={[styles.row, { backgroundColor: theme.card }]}>
        <Ionicons name="help-circle-outline" size={22} color={theme.icon} />
        <Text style={[styles.rowText, { color: theme.text }]}>
          Help & Support
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.row, { backgroundColor: theme.card }]}>
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={theme.icon}
        />
        <Text style={[styles.rowText, { color: theme.text }]}>About</Text>
      </TouchableOpacity>

      {/* Logout button at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="exit-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const lightTheme = {
  background: "#F5F6F7",
  card: "#fff",
  text: "#333",
  icon: "#333",
  sectionTitle: "#666",
};

const darkTheme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#f5f5f5",
  icon: "#f5f5f5",
  sectionTitle: "#aaa",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowText: {
    fontSize: 15,
    marginLeft: 12,
  },
  footer: {
    marginTop: "auto", // pushes to bottom
    paddingVertical: 20,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
});
