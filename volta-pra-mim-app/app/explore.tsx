import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AccessMode, getAccessMode } from "@/services/auth.storage";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const categories = ["Todos", "Perdidos", "Achados", "Recentes"];

const items = [
  {
    id: "1",
    title: "Black School Bag",
    date: "Jan 17, 2024",
    location: "Lapaz",
    status: "Perdido",
  },
  {
    id: "2",
    title: "Black School Bag",
    date: "Jan 17, 2024",
    location: "Lapaz",
    status: "Achado",
  },
  {
    id: "3",
    title: "Black School Bag",
    date: "Jan 17, 2024",
    location: "Lapaz",
    status: "Perdido",
  },
  {
    id: "4",
    title: "Black School Bag",
    date: "Jan 17, 2024",
    location: "Lapaz",
    status: "Perdido",
  },
  {
    id: "5",
    title: "Black School Bag",
    date: "Jan 17, 2024",
    location: "H15",
    status: "Perdido",
  },
  {
    id: "6",
    title: "Black School Bag",
    date: "Jan 17, 2024",
    location: "Lapaz",
    status: "Perdido",
  },
];

const navItems = [
  { label: "Inicio", icon: "home-outline" as const, active: false },
  { label: "Explorar", icon: "grid-outline" as const, active: true },
  { label: "Publicar", icon: "add-circle-outline" as const, active: false },
  { label: "Perfil", icon: "person-outline" as const, active: false },
];

const bagImage = require("../assets/images/mochila.png");

function getBadgeStyle(status: string) {
  if (status === "Achado") {
    return {
      color: "#12B76A",
      backgroundColor: "#FFFFFF",
    };
  }

  return {
    color: "#3552B2",
    backgroundColor: "#FFFFFF",
  };
}

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);

  useEffect(() => {
    getAccessMode().then(setAccessMode);
  }, []);

  const isGuest = accessMode === "guest";

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
                Como visitante, voce pode explorar os itens normalmente, mas
                publicar e acessar recursos restritos exigem login institucional.
              </Text>
            </View>
          </View>
        ) : null}

        {showFilters ? (
          <View style={styles.filtersCard}>
            <Text style={styles.filterLabel}>Categoria</Text>
            <View style={styles.selectBox}>
              <Text style={styles.selectText}>Mochila</Text>
              <Ionicons name="chevron-down-outline" size={18} color="#555" />
            </View>

            <Text style={[styles.filterLabel, styles.filterSpacing]}>
              Select Location
            </Text>
            <View style={styles.selectBox}>
              <Text style={styles.selectText}>Predio H15</Text>
              <Ionicons name="chevron-down-outline" size={18} color="#555" />
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() =>
                Alert.alert("Visual", "Os filtros ainda sao apenas mock.")
              }
            >
              <Text style={styles.applyButtonText}>Aplicar Filtro</Text>
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

        <Text style={styles.resultsTitle}>Resultados da busca</Text>

        <View style={styles.grid}>
          {items.map((item) => {
            const badgeStyle = getBadgeStyle(item.status);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert(
                    "Visual",
                    "O detalhe do item sera ligado depois.",
                  )
                }
              >
                <View style={styles.imageWrap}>
                  <View style={styles.badgeWrap}>
                    <Text
                      style={[
                        styles.badge,
                        {
                          color: badgeStyle.color,
                          backgroundColor: badgeStyle.backgroundColor,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>

                  <Image
                    source={bagImage}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>

                <View style={styles.locationRow}>
                  <Ionicons name="location" size={12} color="#3552B2" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => {
              if (item.label === "Inicio") {
                router.push({ pathname: "/home" });
                return;
              }

              if (item.label === "Publicar") {
                router.push({ pathname: "/publish" });
                return;
              }

              if (item.label === "Perfil") {
                router.push({ pathname: "/profile" });
                return;
              }

              Alert.alert(
                "Visual",
                `A aba ${item.label} sera ajustada depois.`,
              );
            }}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={item.active ? "#FFC726" : "#F4F7FF"}
            />
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    paddingTop: 16,
    paddingBottom: 14,
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
  selectBox: {
    height: 42,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  selectText: {
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
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
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
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#3552B2",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 14,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  navLabel: {
    marginTop: 3,
    color: "#F4F7FF",
    fontSize: 10,
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#FFC726",
    fontWeight: "700",
  },
});
