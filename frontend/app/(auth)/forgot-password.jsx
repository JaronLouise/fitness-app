import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../backend/config/supabase.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "fitnessapp://reset-password", // deep link
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert(
          "Success", 
          "Password reset link sent! Check your email and click the link to reset your password.",
          [
            {
              text: "OK",
              onPress: () => router.back()
            }
          ]
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to send reset link. Please try again.");
      console.error("Password reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to reset your password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Sending..." : "Send Reset Link"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#262B3C" },
  title: { fontSize: 28, fontWeight: "700", color: "#F7F7F7", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#ccc", marginBottom: 30, textAlign: "center" },
  input: { width: "100%", height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, backgroundColor: "rgba(238,238,238,0.6)", marginBottom: 20 },
  button: { width: "100%", height: 50, backgroundColor: "#6EACDA", borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  buttonText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  backText: { fontSize: 16, color: "#F7F7F7", textDecorationLine: "underline" },
});
