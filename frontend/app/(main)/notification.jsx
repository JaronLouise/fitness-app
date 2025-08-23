import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';


const notifications = [
  {
    id: "1",
    name: "Min An",
    message: "Wanna share my workout routine!",
    date: "June 08, 2025",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg", // sample avatar
  },
  {
    id: "2",
    name: "Min An",
    message: "Wanna share my workout routine!",
    date: "June 08, 2025",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  // Try making this [] to see the empty state
];

export default function NotificationsPage() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
                                    name="notifications-outline"
                                    size={100}
                                    color="black"
                                    style={styles.bell}
                                />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>
              When you get notifications, they’ll show up here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontWeight: "bold",
    color: "#393E46",
    fontSize: 14,
  },
  message: {
    fontSize: 13,
    color: "#393E46",
  },
  date: {
    fontSize: 11,
    fontWeight:200,
    color: "#393E46",
    marginLeft: 8,
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#393E46",
  },
  emptySubText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 30,
  },
});
