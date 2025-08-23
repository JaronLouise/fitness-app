// app/home.js
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/config/supabase';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { CalendarList } from 'react-native-calendars'; // ✅ Month view calendar

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [calendarVisible, setCalendarVisible] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/(auth)');
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };

        getSession();

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

    // Get current week's days (Sun → Sat)
    const getWeekDays = () => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sun
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - currentDay);

        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            return {
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                num: d.getDate(),
                isToday: d.toDateString() === today.toDateString(),
            };
        });
    };

    const nutritionData = [
        { label: "Calories", value: "1,847" },
        { label: "Fats", value: "142g" },
        { label: "Carbs", value: "189g" },
        { label: "Protein", value: "67g" },
    ];

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#EEEEEE" }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={styles.welcome}>Welcome Back 👋</Text>
                    <Text style={styles.fullname}>
                        {user?.user_metadata?.full_name || user?.email || 'Guest'}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/notification")}>
                    <Ionicons
                        name="notifications-outline"
                        size={28}
                        color="black"
                        style={styles.bell}
                    />
                </TouchableOpacity>            
                </View>

            {/* Calendar Preview (Week Row) */}
            <View style={styles.calendar}>
                <Text style={styles.progresslabel}>Your Progress this Week</Text>

                <TouchableOpacity onPress={() => setCalendarVisible(true)}>
                    <View style={styles.daysRow}>
                        {getWeekDays().map((d, index) => (
                            <View
                                key={index}
                                style={[styles.dayContainer, d.isToday && styles.todayDay]}
                            >
                                <Text style={styles.dayLabel}>{d.day}</Text>
                                <Text style={[styles.dayNumber, d.isToday && styles.todayDayNumber]}>
                                    {d.num}
                                </Text>
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Modal Full Calendar */}
            <Modal visible={calendarVisible} animationType="slide">
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    {/* Close button */}
                    <TouchableOpacity
                        style={{ padding: 15, alignSelf: "flex-end" }}
                        onPress={() => setCalendarVisible(false)}
                    >
                        <Ionicons name="close" size={28} color="black" />
                    </TouchableOpacity>

                    {/* Full Calendar (Jan–Dec) */}
                    <CalendarList
                        pastScrollRange={12}   // 12 months back
                        futureScrollRange={12} // 12 months ahead
                        scrollEnabled
                        showScrollIndicator
                        onDayPress={(day) => {
                            console.log("Selected date", day.dateString);
                            setCalendarVisible(false);
                        }}
                    />
                </View>
            </Modal>

            {/* Nutrition Section */}
            <View style={styles.nutritionSection}>
                <Text style={styles.nutritionTitle}>Nutrition</Text>
                <View style={styles.nutritionGrid}>
                    {nutritionData.map((item, index) => (
                        <View key={index} style={styles.nutritionCard}>
                            <Text style={styles.nutritionValue}>{item.value}</Text>
                            <Text style={styles.nutritionLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Workout Summary Section */}
            {/* Workout Summary Section */}
            <View style={styles.workoutSummary}>
                <Text style={styles.summaryTitle}>Workout Summary</Text>

                <BarChart
                    data={{
                        labels: ["Volume", "Reps", "Duration"],
                        datasets: [
                            {
                                data: [12450, 120, 45],
                                colors: [
                                    (opacity = 1) => `rgba(255, 179, 71, ${opacity})`,   // Orange
                                    (opacity = 1) => `rgba(110, 198, 255, ${opacity})`, // Blue
                                    (opacity = 1) => `rgba(129, 199, 132, ${opacity})`, // Green
                                ],
                            },
                        ],
                    }}
                    width={Dimensions.get("window").width - 55}
                    height={220}
                    fromZero
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        barPercentage: 0.6,
                    }}
                    style={{
                        marginVertical: 10,
                        borderRadius: 12,
                    }}
                    showValuesOnTopOfBars={true}
                    withCustomBarColorFromData={true}
                    flatColor={true}
                />
            </View>



            <View style={styles.recentWorkouts}>
                <Text style={styles.recentTitle}>Recent Workouts</Text>

                {[
                    { title: "Upper Body", details: "4 exercises | Intermediate" },
                    { title: "Upper Body", details: "4 exercises | Intermediate" },
                    { title: "Upper Body", details: "4 exercises | Intermediate" },
                ].map((workout, index) => (
                    <TouchableOpacity key={index} style={styles.workoutCard}>
                        <View style={styles.workoutImage} />
                        <View style={styles.workoutTextContainer}>
                            <Text style={styles.workoutTitle}>{workout.title}</Text>
                            <Text style={styles.workoutDetails}>{workout.details}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>



        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'flex-start', alignItems: 'flex-start' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 30 },
    calendar: { flexDirection: 'column', alignItems: 'flex-start', marginTop: 20, width: '100%' },
    progresslabel: { fontSize: 13, color: '#393E46', fontWeight: 'bold' },
    daysRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginTop: 10, width: '100%' },
    dayContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    dayLabel: { fontSize: 12, color: '#393E46', marginBottom: 4 },
    dayNumber: { fontSize: 14, color: '#888', backgroundColor: '#eaeaea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50, textAlign: 'center' },
    todayDay: { borderRadius: 10 },
    todayDayNumber: { backgroundColor: '#000', color: '#fff', fontWeight: 'bold' },
    avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
    textContainer: { flex: 1 },
    welcome: { fontSize: 15, fontWeight: '400', color: '#393E46' },
    fullname: { marginTop: 2, fontSize: 20, fontWeight: 'bold', color: '#393E46' },
    bell: { marginLeft: 10 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    nutritionSection: { marginTop: 20, width: '100%', backgroundColor: '#262B3C', padding: 12, borderRadius: 15 },
    nutritionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#F7F7F7' },
    nutritionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    nutritionCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    nutritionValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    },
    nutritionLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4

    },

    recentWorkouts: {
        marginTop: 20,
        width: "100%",
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#393E46",
        marginBottom: 10,
    },
    workoutCard: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    workoutImage: {
        width: 60,
        height: 60,
        backgroundColor: "#D9D9D9", // Placeholder gray box
        borderRadius: 12,
        marginRight: 12,
    },
    workoutTextContainer: {
        flex: 1,
    },
    workoutTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    workoutDetails: {
        fontSize: 12,
        color: "#666",
    },
    workoutSummary: {
        marginTop: 20,
        width: "100%",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#393E46",
    },
    summaryGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    summaryCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    summaryLabel: {
        fontSize: 12,
        color: "#fff",
        marginTop: 4,
    },

});
