import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { api } from "../services/api";

type Item = {
  id: string;
  title: string;
  description: string;
  location: string;
};

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      try {
        const response = await api.get("/items");
        setItems(response.data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar os itens.");
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.loadingText}>Carregando itens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VoltaPraMim</Text>
      <Text style={styles.subtitle}>Itens encontrados</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardLocation}>Local: {item.location}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#444",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2F4E9E",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2D5A",
    marginBottom: 8,
  },
  cardLocation: {
    fontSize: 14,
    color: "#2F4E9E",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },
});
