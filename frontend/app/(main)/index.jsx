import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/config/supabase';
import { fetchUserProfile } from "../../backend/api/fetch_user_data.js";
import { router } from 'expo-router';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // No user session, go to login
        router.replace('/(auth)/login');
      } else {
        setUser(session.user);
        console.log('User session:', session.user.id);
        const profile = await fetchUserProfile(session.user.id);
        if (
          !profile ||
          !profile.step_1_data?.gender ||
          !profile.step_2_data?.goals ||
          !profile.step_3_data?.fitness_level ||
          !profile.step_4_data?.meal_plans ||
          !profile.step_5_data?.height_value ||
          !profile.step_6_data?.weight_value ||
          !profile.step_7_data?.age
        ) {
          router.replace('/(post-signup)/post-signup');
        } else {
          setUserData(profile);
        }
      }
      setLoading(false);
    };

    getSession();

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/(auth)/login');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Show full_name if available, else email */}
      <Text style={styles.welcome}>
        Welcome {userData?.full_name || user?.email || 'Guest'} 👋
      </Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: { fontSize: 20, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
