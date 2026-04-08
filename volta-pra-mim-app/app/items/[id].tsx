import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockItems } from "@/data/mock-items";
import { getAccessMode } from "@/services/auth.storage";
import { useEffect, useState } from "react";

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [accessMode, setAccessMode] = useState<"authenticated" | "guest" | null>(
    null,
  );

  useEffect(() => {
    getAccessMode().then(setAccessMode);
  }, []);

  const item = mockItems.find((currentItem) => currentItem.id === id);

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Item nao encontrado</Text>
        <Text style={styles.emptyText}>
          Volte para a lista e escolha um item valido para visualizar.
        </Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace({ pathname: "/items" })}
        >
          <Text style={styles.primaryButtonText}>Voltar para lista</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: item.color }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.status}>{item.status}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.heroSubtitle}>{item.location}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Descricao</Text>
        <Text style={styles.sectionText}>{item.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informacoes principais</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Categoria</Text>
          <Text style={styles.metaValue}>{item.category}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Publicado em</Text>
          <Text style={styles.metaValue}>{item.dateLabel}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Responsavel</Text>
          <Text style={styles.metaValue}>{item.reporterName}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Retirada e contato</Text>
        <Text style={styles.sectionText}>{item.contactHint}</Text>
      </View>

      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>
          {accessMode === "guest"
            ? "Entre com seu RA para continuar"
            : "Fluxo visual de acao"}
        </Text>
        <Text style={styles.ctaText}>
          {accessMode === "guest"
            ? "No modo visitante, voce pode apenas consultar os detalhes. Para solicitar contato ou registrar um item, faca login institucional."
            : "Aqui depois vamos conectar as acoes reais de interesse, retirada ou acompanhamento do item."}
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: accessMode === "guest" ? "/login" : "/home",
            })
          }
        >
          <Text style={styles.primaryButtonText}>
            {accessMode === "guest" ? "Entrar com RA" : "Voltar para home"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },
  content: {
    paddingBottom: 28,
  },
  hero: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  status: {
    alignSelf: "flex-start",
    color: "#16213E",
    backgroundColor: "#F9D12B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 14,
  },
  title: {
    fontSize: 29,
    lineHeight: 35,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  heroSubtitle: {
    marginTop: 10,
    color: "#E6EDFF",
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
  },
  sectionTitle: {
    color: "#16213E",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  sectionText: {
    color: "#5E6678",
    fontSize: 14,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F7",
  },
  metaLabel: {
    color: "#6A7282",
    fontSize: 13,
  },
  metaValue: {
    color: "#16213E",
    fontSize: 13,
    fontWeight: "700",
  },
  ctaCard: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: "#EAF0FF",
    borderRadius: 22,
    padding: 18,
  },
  ctaTitle: {
    color: "#203469",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },
  ctaText: {
    color: "#42506B",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  primaryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#3552B2",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  emptyTitle: {
    color: "#16213E",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },
  emptyText: {
    color: "#5E6678",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 18,
  },
});
