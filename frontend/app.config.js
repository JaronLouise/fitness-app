import 'dotenv/config';

export default {
  expo: {
    scheme: "fitnessapp",
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
<<<<<<< HEAD
      package: "com.fit.fitnessapp",
=======
>>>>>>> be6adf8b899e3298c10c8274016fe9c1f79c0dd0
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    extra: {
      LOCAL_IP: process.env.LOCAL_IP,
      SUPABASE_URL: process.env.SUPABASE_URL,
<<<<<<< HEAD
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      eas: {
        projectId: "1ce3c901-d772-403e-a1f6-30ea58db6a77"
      }
=======
      SUPABASE_KEY: process.env.SUPABASE_KEY
>>>>>>> be6adf8b899e3298c10c8274016fe9c1f79c0dd0
    }
  }
};
