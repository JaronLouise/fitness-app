import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../backend/config/supabase.js";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert(
          "Success", 
          "Password updated successfully! You can now log in with your new password.",
          [
            {
              text: "Login",
              onPress: () => router.replace("/")
            }
          ]
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update password. Please try again.");
      console.error("Password update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter and confirm your new password</Text>

      <TextInput
        style={styles.input}
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Updating..." : "Update Password"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#262B3C" },
  title: { fontSize: 28, fontWeight: "700", color: "#F7F7F7", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#ccc", marginBottom: 30, textAlign: "center" },
  input: { width: "100%", height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, backgroundColor: "rgba(238,238,238,0.6)", marginBottom: 20 },
  button: { width: "100%", height: 50, backgroundColor: "#6EACDA", borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  buttonText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  backText: { fontSize: 16, color: "#F7F7F7", textDecorationLine: "underline" },
});
