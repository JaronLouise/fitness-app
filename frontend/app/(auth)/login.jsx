import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Image,
    Linking
} from 'react-native';
import { Link, router } from 'expo-router';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { supabase } from '../../backend/config/supabase.js';

const LoginScreen = () => {
    const IP_ADDRESS = Constants.expoConfig.extra.LOCAL_IP;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        console.log(JSON.stringify({ email, password }));
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Success', 'Login successful!');
                console.log(data);
                router.push('/(main)/');
            }

            setEmail('');
            setPassword('');
        } catch (error) {
            Alert.alert('Error', 'Login failed. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'fitnessapp://auth/callback',
            },
            });

            if (error) {
            Alert.alert('Error', error.message);
            return;
            }

            if (data?.url) {
            await Linking.openURL(data.url);
            }
        } catch (err) {
            Alert.alert('Error', 'Google login failed');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
        };



    const handleForgotPassword = () => {
        router.push('/forgot-password');
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

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
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Log In</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChangeText={setPassword}
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
                            </View>

                            <TouchableOpacity onPress={handleForgotPassword}>
                                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.loginButtonText}>Log In</Text>
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
                                onPress={handleGoogleLogin}
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
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={handleSignUp}>
                                <Text style={styles.signUpText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
};

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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'medium',
        color: '#F7F7F7',
        marginBottom: 8,
    },
    form: {
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F7F7F7',
        marginBottom: 8,
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
    forgotPassword: {
        color: '#929AAB',
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 30,
        fontWeight: '500',
    },
    loginButton: {
        height: 50,
        backgroundColor: '#262B3C',
        borderWidth: 1,
        //borderColor: '#e1e5e9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonDisabled: {
        backgroundColor: '#B0B0B0',
    },
    loginButtonText: {
        color: '#F7F7F7',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#F7F7F7',
    },
    signUpText: {
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

});

export default LoginScreen;