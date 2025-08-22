// app/signup.js - SignUp screen with Expo Router
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    Modal,
    Linking,
    Image,
    Button
} from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { ImageBackground } from 'react-native';
import { supabase } from '../../backend/config/supabase.js';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!formData.email.includes('@')) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                },
            });

            if (error) {
                Alert.alert('Error', error.message);
                return;
            }

            Alert.alert('Success', 'Account created successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        setFormData({
                            fullName: '',
                            email: '',
                            password: '',
                            confirmPassword: ''
                        });
                        setErrors({});
                        router.replace('/(main)'); // or your post-login route
                    }
                }
            ]);

        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        console.log("Trying to signup google.");
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'fitnessapp://auth/callback'
                },
            });

            if (error) {
                console.log("Error: ", error);
                Alert.alert('Error', error.message);
                return;
            }

            console.log("OAuth data:", data); // Debug log

            // If data.url exists, manually open it
            if (data?.url) {
                await Linking.openURL(data.url);
            }

        } catch (error) {
            Alert.alert('Error', 'Google sign-in failed. Please try again.');
            console.error("Google signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = () => {
        // Navigate back to login screen
        router.push('/');
    };

    const TermsModal = () => (
        <Modal
            visible={showTermsModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowTermsModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Terms of Service</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowTermsModal(false)}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalBody}>
                        <Text style={styles.modalText}>
                            By using this fitness application, you agree to the following terms:
                            {'\n\n'}
                            1. You will provide accurate and truthful information about your health and fitness.
                            {'\n\n'}
                            2. You understand that this app is not a substitute for professional medical advice.
                            {'\n\n'}
                            3. You are responsible for your own health and safety during exercise.
                            {'\n\n'}
                            4. The app may collect and store your personal data as outlined in our Privacy Policy.
                            {'\n\n'}
                            5. You must be at least 13 years old to use this application.
                        </Text>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => {
                            setAcceptedTerms(true);
                            setShowTermsModal(false);
                            if (errors.terms) {
                                setErrors(prev => ({ ...prev, terms: '' }));
                            }
                        }}
                    >
                        <Text style={styles.acceptButtonText}>I Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <ImageBackground
            source={require('../../assets/background.jpg')}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 0.9 }}
        >
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Create Account</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Full Name Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={[styles.input, errors.fullName && styles.inputError]}
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChangeText={(text) => handleInputChange('fullName', text)}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChangeText={(text) => handleInputChange('email', text.toLowerCase())}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[styles.passwordInput, errors.password && styles.inputError]}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChangeText={(text) => handleInputChange('password', text)}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                                    </TouchableOpacity>
                                </View>
                                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            </View>

                            {/* Confirm Password Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChangeText={(text) => handleInputChange('confirmPassword', text)}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <Text style={styles.eyeText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                                    </TouchableOpacity>
                                </View>
                                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                            </View>

                            {/* Terms and Conditions Checkbox */}
                            <View style={styles.termsContainer}>
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                                >
                                    <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                                        {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                    <Text style={styles.termsText}>
                                        I agree to the{' '}
                                        <Text
                                            style={styles.termsLink}
                                            onPress={() => setShowTermsModal(true)}
                                        >
                                            Terms of Service
                                        </Text>
                                        {' '}and{' '}
                                        <Text
                                            style={styles.termsLink}
                                            onPress={() => setShowTermsModal(true)}
                                        >
                                            Privacy Policy
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                                {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
                            </View>

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                                onPress={handleSignUp}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.signUpButtonText}>Create Account</Text>
                                )}
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or log in with</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity
                                style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
                                //onPress={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image
                                        source={require('../../assets/google.png')}
                                        style={{ width: 20, height: 20, marginRight: 8 }}
                                    />
                                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={handleSignIn}>
                                <Text style={styles.signInText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <TermsModal />
            </SafeAreaView>
        </ImageBackground>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },

    container: {
        flex: 1,
        //backgroundColor: '#f8f9fa',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'medium',
        color: '#f7f7f7',
        marginTop: 20,
        marginBottom: -10,
    },
    form: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f7f7f7',
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        //borderColor: '#F7F7F7',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: 'rgba(238, 238, 238, 0.6)',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        //borderColor: '#F7F7F7',
        borderRadius: 12,
        backgroundColor: 'rgba(238, 238, 238, 0.6)',
    },
    passwordInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    eyeButton: {
        padding: 15,
    },
    eyeText: {
        fontSize: 18,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        marginTop: 5,
    },
    termsContainer: {
        marginBottom: 30,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#757575',
        borderRadius: 4,
        marginRight: 12,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    checkboxChecked: {
        backgroundColor: '#007AFF',
    },
    checkmark: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    termsText: {
        fontSize: 14,
        color: '#929AAB',
        flex: 1,
        lineHeight: 20,
    },
    termsLink: {
        color: '#6EACDA',
        fontWeight: '500',
    },
    signUpButton: {
        height: 50,
        backgroundColor: '#262B3C',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpButtonDisabled: {
        backgroundColor: '#B0B0B0',
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 16,
        color: '#666666',
    },
    signInText: {
        fontSize: 16,
        color: '#6EACDA',
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#f7f7f7',
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#f7f7f7',
    },
    googleButton: {
        height: 50,
        backgroundColor: '#262B3C',
        borderWidth: 1,
        //borderColor: '#e1e5e9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleButtonDisabled: {
        backgroundColor: '#f0f0f0',
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f7f7f7',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#262B3C',
        borderRadius: 16,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f7f7f7',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 20,
        color: '#eeeeee',
    },
    modalBody: {
        padding: 20,
        maxHeight: 300,
    },
    modalText: {
        fontSize: 16,
        color: '#eeeeee',
        lineHeight: 24,
    },
    acceptButton: {
        backgroundColor: '#f7f7f7',
        padding: 16,
        margin: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: '#262B3C',
        fontSize: 16,
        fontWeight: '600',
    },
});