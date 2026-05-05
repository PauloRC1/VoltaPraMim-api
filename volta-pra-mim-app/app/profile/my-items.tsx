import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { AppBottomNav } from "@/components/app-bottom-nav";
import { AccessMode, getAccessMode } from "@/services/auth.storage";
import { getItemStatusStyle } from "@/utils/item-status";
import {
  ApiItem,
  deleteItem,
  formatItemDate,
  listMyItems,
  markItemAsReturned,
} from "@/services/items";
import { ItemImage } from "@/components/item-image";

export default function MyItemsScreen() {
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);
  const [items, setItems] = useState<ApiItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadSession() {
        const storedAccessMode = await getAccessMode();

        if (isActive) {
          setAccessMode(storedAccessMode);
        }

        if (storedAccessMode === "authenticated") {
          try {
            setIsLoadingItems(true);
            setErrorMessage("");
            const apiItems = await listMyItems();
            if (isActive) {
              setItems(apiItems);
            }
          } catch {
            if (isActive) {
              setErrorMessage("Não foi possível carregar seus itens agora.");
            }
          } finally {
            if (isActive) {
              setIsLoadingItems(false);
            }
          }
        } else {
          if (isActive) {
            setIsLoadingItems(false);
          }
        }
      }

      loadSession();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const openItemsCount = items.filter((item) => item.status !== "DEVOLVIDO").length;
  const resolvedItemsCount = items.length - openItemsCount;

  function handleResolve(itemId: string) {
    Alert.alert(
      "Marcar como resolvido?",
      "Use essa ação quando o item já tiver sido devolvido ou encontrado.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Marcar",
          onPress: async () => {
            try {
              const updatedItem = await markItemAsReturned(itemId);
              setItems((currentItems) =>
                currentItems.map((item) =>
                  item.id === itemId
                    ? { ...item, status: updatedItem.status }
                    : item,
                ),
              );
            } catch (error: any) {
              const message =
                error.response?.data?.message ||
                "Não foi possível marcar este item como resolvido.";
              Alert.alert("Erro", message);
            }
          },
        },
      ],
    );
  }

  function handleDelete(itemId: string) {
    Alert.alert(
      "Excluir publicação?",
      "Essa ação remove o item da lista e não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteItem(itemId);
              setItems((currentItems) =>
                currentItems.filter((item) => item.id !== itemId),
              );
            } catch (error: any) {
              const message =
                error.response?.data?.message ||
                "Não foi possível excluir este item.";
              Alert.alert("Erro", message);
            }
          },
        },
      ],
    );
  }

  if (accessMode === null) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="small" color="#3552B2" />
      </View>
    );
  }

  if (accessMode === "guest") {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus itens</Text>
        </View>

        <View style={styles.restrictedCard}>
          <View style={styles.restrictedIcon}>
            <Ionicons name="lock-closed-outline" size={28} color="#3552B2" />
          </View>
          <Text style={styles.restrictedTitle}>Entre para gerenciar itens</Text>
          <Text style={styles.restrictedText}>
            Visitantes podem explorar publicações, mas apenas alunos autenticados
            conseguem acompanhar e resolver seus itens.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/login")}>
            <Text style={styles.primaryButtonText}>Entrar com RA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus itens</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Acompanhe suas publicações</Text>
          <Text style={styles.summaryText}>
            Quando um item for devolvido ou recuperado, marque como resolvido
            para encerrar a publicação.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{openItemsCount}</Text>
              <Text style={styles.statLabel}>Em aberto</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{resolvedItemsCount}</Text>
              <Text style={styles.statLabel}>Resolvidos</Text>
            </View>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Publicados por você</Text>
          <TouchableOpacity onPress={() => router.push("/publish")}>
            <Text style={styles.publishLink}>Novo item</Text>
          </TouchableOpacity>
        </View>

        {isLoadingItems ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator size="small" color="#3552B2" />
            <Text style={styles.emptyTitle}>Carregando seus itens</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cloud-offline-outline" size={28} color="#3552B2" />
            <Text style={styles.emptyTitle}>Ops, algo falhou</Text>
            <Text style={styles.emptyText}>{errorMessage}</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="albums-outline" size={28} color="#3552B2" />
            <Text style={styles.emptyTitle}>Nenhum item publicado</Text>
            <Text style={styles.emptyText}>
              Quando você publicar um item, ele aparece aqui para acompanhamento.
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {items.map((item) => {
              const statusStyle = getItemStatusStyle(item.status);
              const isResolved = item.status === "DEVOLVIDO";

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  activeOpacity={0.86}
                  onPress={() =>
                    router.push({
                      pathname: "/items/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <ItemImage
                    imageUrl={item.imageUrl}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />

                  <View style={styles.itemContent}>
                    <View style={styles.itemTopRow}>
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: statusStyle.backgroundColor },
                        ]}
                      >
                        <Text style={[styles.badgeText, { color: statusStyle.color }]}>
                          {statusStyle.label}
                        </Text>
                      </View>
                      <Text style={styles.itemDate}>{formatItemDate(item.date)}</Text>
                    </View>

                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={12} color="#3552B2" />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={styles.secondaryAction}
                        onPress={() =>
                          router.push({
                            pathname: "/items/[id]",
                            params: { id: item.id },
                          })
                        }
                      >
                        <Text style={styles.secondaryActionText}>Ver detalhes</Text>
                      </TouchableOpacity>

                      {!isResolved ? (
                        <TouchableOpacity
                          style={styles.editAction}
                          onPress={() =>
                            router.push({
                              pathname: "/items/[id]/edit",
                              params: { id: item.id },
                            })
                          }
                        >
                          <Ionicons name="create-outline" size={15} color="#3552B2" />
                        </TouchableOpacity>
                      ) : null}
                    
                      <TouchableOpacity
                        style={styles.deleteAction}
                        onPress={() => handleDelete(item.id)}
                      >
                        <Ionicons name="trash-outline" size={15} color="#D92D20" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.resolveRow}>
                      {!isResolved ? (
                        <TouchableOpacity
                          style={styles.resolveAction}
                          onPress={() => handleResolve(item.id)}
                        >
                          <Text style={styles.resolveActionText}>Resolver</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <AppBottomNav activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  container: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 126,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    color: "#151922",
    fontSize: 29,
    fontWeight: "800",
  },
  summaryCard: {
    backgroundColor: "#EAF0FF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
  },
  summaryTitle: {
    color: "#1A2B59",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  summaryText: {
    color: "#42506B",
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
  },
  statValue: {
    color: "#3552B2",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 3,
  },
  statLabel: {
    color: "#5D6678",
    fontSize: 12.5,
    fontWeight: "700",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#151922",
    fontSize: 17,
    fontWeight: "800",
  },
  publishLink: {
    color: "#3552B2",
    fontSize: 13,
    fontWeight: "800",
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
  },
  itemImage: {
    width: 104,
    minHeight: 142,
    borderRadius: 16,
    backgroundColor: "#D8DDE8",
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 2,
  },
  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  itemDate: {
    color: "#667085",
    fontSize: 11,
    fontWeight: "700",
  },
  itemTitle: {
    color: "#151922",
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "800",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },
  locationText: {
    flex: 1,
    color: "#5D6678",
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: "auto",
  },
  resolveRow: {
    marginTop: 8,
  },
  secondaryAction: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D4D8DF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    color: "#344054",
    fontSize: 12,
    fontWeight: "800",
  },
  editAction: {
    width: 40,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteAction: {
    width: 40,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#FFECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  resolveAction: {
    height: 38,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  resolveActionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#151922",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    color: "#667085",
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: "center",
  },
  restrictedCard: {
    marginHorizontal: 18,
    backgroundColor: "#EAF0FF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  restrictedIcon: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  restrictedTitle: {
    color: "#203469",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  restrictedText: {
    color: "#42506B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
