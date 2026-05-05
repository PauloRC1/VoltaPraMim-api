import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { getItemStatusLabel } from "@/utils/item-status";
import { ApiItem, formatItemCategory, formatItemDate, listItems } from "@/services/items";

export default function ItemsScreen() {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      try {
        const apiItems = await listItems();
        setItems(apiItems);
      } finally {
        setIsLoading(false);
      }
    }

    loadItems();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Lista completa</Text>
        <Text style={styles.title}>Itens publicados</Text>
        <Text style={styles.subtitle}>
          Lista completa com as publicações carregadas da API.
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color="#3552B2" />
          <Text style={styles.loadingText}>Carregando itens...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/items/[id]",
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.iconBlock}>
                <Text style={styles.iconText}>
                  {formatItemCategory(item.category).slice(0, 2)}
                </Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.row}>
                  <Text style={styles.badge}>{getItemStatusLabel(item.status)}</Text>
                  <Text style={styles.date}>{formatItemDate(item.date)}</Text>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardLocation}>{item.location}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    paddingTop: 28,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3552B2",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#16213E",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#5E6678",
  },
  listContent: {
    paddingBottom: 28,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    gap: 14,
  },
  iconBlock: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    textTransform: "uppercase",
  },
  cardContent: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    color: "#3552B2",
    backgroundColor: "#E8EEFF",
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  date: {
    color: "#7B8496",
    fontSize: 12,
    fontWeight: "600",
  },
  cardTitle: {
    color: "#16213E",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardLocation: {
    color: "#3552B2",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDescription: {
    color: "#5E6678",
    fontSize: 13,
    lineHeight: 19,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#667085",
    fontSize: 13,
    marginTop: 8,
  },
});
