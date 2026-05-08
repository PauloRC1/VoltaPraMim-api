import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AccessMode, getAccessMode } from "@/services/auth.storage";
import { AppBottomNav } from "@/components/app-bottom-nav";
import { getItemStatusStyle } from "@/utils/item-status";
import {
  ApiItem,
  ApiItemCategory,
  ApiItemStatus,
  formatItemCategory,
  formatItemDate,
  listItems,
} from "@/services/items";
import { ItemImage } from "@/components/item-image";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const categories = ["Todos", "Procurando", "Encontrados", "Recentes"];
const categoryFilters: (ApiItemCategory | "TODOS")[] = [
  "TODOS",
  "ELETRONICOS",
  "MOCHILA",
  "DOCUMENTOS",
  "ACESSORIOS",
  "OUTROS",
];

function getStatusFilter(category: string): ApiItemStatus | undefined {
  if (category === "Procurando") return "PERDIDO";
  if (category === "Encontrados") return "ENCONTRADO";
  return undefined;
}

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedItemCategory, setSelectedItemCategory] =
    useState<ApiItemCategory | "TODOS">("TODOS");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);
  const [items, setItems] = useState<ApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getAccessMode().then(setAccessMode);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadItems() {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const apiItems = await listItems({
            status: getStatusFilter(selectedCategory),
            category:
              selectedItemCategory === "TODOS" ? undefined : selectedItemCategory,
            search: debouncedSearch || undefined,
            location: locationFilter.trim() || undefined,
          });
          if (isActive) {
            setItems(apiItems);
          }
        } catch {
          if (isActive) {
            setErrorMessage("Não foi possível carregar os itens agora.");
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      loadItems();

      return () => {
        isActive = false;
      };
    }, [debouncedSearch, locationFilter, selectedCategory, selectedItemCategory]),
  );

  const isGuest = accessMode === "guest";
  const hasActiveFilters =
    selectedItemCategory !== "TODOS" || locationFilter.trim().length > 0;

  function clearFilters() {
    setSelectedItemCategory("TODOS");
    setLocationFilter("");
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Explorar</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search-outline" size={18} color="#9AA0A6" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar item..."
              placeholderTextColor="#8D939B"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters((current) => !current)}
          >
            <Ionicons
              name={showFilters ? "close-outline" : "options-outline"}
              size={20}
              color="#C63FEA"
            />
          </TouchableOpacity>
        </View>

        {isGuest ? (
          <View style={styles.guestBanner}>
            <View style={styles.guestBannerIcon}>
              <Ionicons name="shield-outline" size={18} color="#3552B2" />
            </View>
            <View style={styles.guestBannerTextWrap}>
              <Text style={styles.guestBannerTitle}>
                Entre com seu RA para continuar
              </Text>
              <Text style={styles.guestBannerText}>
                Como visitante, você pode explorar os itens normalmente, mas
                publicar e acessar recursos restritos exigem login institucional.
              </Text>
            </View>
          </View>
        ) : null}

        {showFilters ? (
          <View style={styles.filtersCard}>
            <Text style={styles.filterLabel}>Categoria</Text>
            <View style={styles.filterChips}>
              {categoryFilters.map((category) => {
                const isActive = selectedItemCategory === category;
                const label =
                  category === "TODOS" ? "Todas" : formatItemCategory(category);

                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedItemCategory(category)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.filterLabel, styles.filterSpacing]}>
              Local
            </Text>
            <View style={styles.locationInputWrap}>
              <Ionicons name="location-outline" size={17} color="#667085" />
              <TextInput
                style={styles.locationInput}
                placeholder="Ex.: Prédio H15"
                placeholderTextColor="#8D939B"
                value={locationFilter}
                onChangeText={setLocationFilter}
                returnKeyType="search"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.applyButton,
                !hasActiveFilters && styles.applyButtonDisabled,
              ]}
              onPress={clearFilters}
              disabled={!hasActiveFilters}
            >
              <Text
                style={[
                  styles.applyButtonText,
                  !hasActiveFilters && styles.applyButtonTextDisabled,
                ]}
              >
                Limpar filtros
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.categoriesRow}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.resultsTitle}>
          {debouncedSearch || hasActiveFilters
            ? "Resultados filtrados"
            : "Resultados da busca"}
        </Text>

        {isLoading ? (
          <View style={styles.feedbackCard}>
            <ActivityIndicator size="small" color="#3552B2" />
            <Text style={styles.feedbackText}>Carregando itens...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.feedbackCard}>
            <Ionicons name="cloud-offline-outline" size={24} color="#3552B2" />
            <Text style={styles.feedbackTitle}>Ops, algo falhou</Text>
            <Text style={styles.feedbackText}>{errorMessage}</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.feedbackCard}>
            <Ionicons name="search-outline" size={24} color="#3552B2" />
            <Text style={styles.feedbackTitle}>Nenhum item por aqui</Text>
            <Text style={styles.feedbackText}>
              Ajuste a busca ou os filtros para tentar novamente.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {items.map((item) => {
            const badgeStyle = getItemStatusStyle(item.status);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/items/[id]",
                    params: { id: item.id },
                  })
                }
              >
                <View style={styles.imageWrap}>
                  <View style={styles.badgeWrap}>
                    <Text
                      style={[
                        styles.badge,
                        {
                          color: badgeStyle.color,
                        },
                      ]}
                    >
                      {badgeStyle.label}
                    </Text>
                  </View>

                  <ItemImage
                    imageUrl={item.imageUrl}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{formatItemDate(item.date)}</Text>

                <View style={styles.locationRow}>
                  <Ionicons name="location" size={12} color="#3552B2" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            );
            })}
          </View>
        )}
      </ScrollView>

      <AppBottomNav activeTab="explore" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3552B2",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  content: {
    paddingBottom: 106,
  },
  topBar: {
    backgroundColor: "#3552B2",
    paddingHorizontal: 18,
    paddingTop: 46,
    paddingBottom: 16,
  },
  topBarTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#D9DCE1",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    color: "#111111",
    fontSize: 13,
  },
  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: "#D9DCE1",
    alignItems: "center",
    justifyContent: "center",
  },
  guestBanner: {
    marginHorizontal: 18,
    marginTop: 12,
    backgroundColor: "#EAF0FF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap: 12,
  },
  guestBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  guestBannerTextWrap: {
    flex: 1,
  },
  guestBannerTitle: {
    color: "#203469",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  guestBannerText: {
    color: "#42506B",
    fontSize: 12.5,
    lineHeight: 18,
  },
  filtersCard: {
    marginHorizontal: 18,
    marginTop: 10,
    backgroundColor: "#FFF1F1",
    borderRadius: 10,
    padding: 12,
  },
  filterLabel: {
    color: "#555",
    fontSize: 11,
    marginBottom: 6,
  },
  filterSpacing: {
    marginTop: 10,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: "#EAF0FF",
    borderColor: "#3552B2",
  },
  filterChipText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#3552B2",
  },
  locationInputWrap: {
    height: 42,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  locationInput: {
    flex: 1,
    marginLeft: 6,
    color: "#111111",
    fontSize: 13,
  },
  applyButton: {
    marginTop: 16,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonDisabled: {
    backgroundColor: "#E3E6EE",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  applyButtonTextDisabled: {
    color: "#8D939B",
  },
  categoriesRow: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  categoryText: {
    color: "#222222",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#27C1D7",
  },
  resultsTitle: {
    color: "#161616",
    fontSize: 13,
    fontWeight: "800",
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  grid: {
    paddingHorizontal: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  feedbackCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  feedbackTitle: {
    color: "#151922",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 4,
  },
  feedbackText: {
    color: "#667085",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },
  card: {
    width: "48%",
    backgroundColor: "#ECECEC",
    borderRadius: 12,
    padding: 6,
    paddingBottom: 10,
  },
  imageWrap: {
    height: 106,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#DADDE5",
  },
  badgeWrap: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 2,
  },
  badge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: "hidden",
    fontSize: 9,
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardTitle: {
    color: "#111111",
    fontSize: 12.5,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardDate: {
    color: "#333333",
    fontSize: 11,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationText: {
    color: "#333333",
    fontSize: 10.5,
  },
});
