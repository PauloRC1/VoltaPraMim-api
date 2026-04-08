import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getAccessMode, getUser, AccessMode, User } from "@/services/auth.storage";
import { router } from "expo-router";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { mockItems, MockItem } from "@/data/mock-items";

const profile = {
  name: "Marcinho Branco",
  email: "marchinho.nbrc@gmail.com",
};

const recentItems = mockItems.slice(0, 4);
const lostItems = [mockItems[1], mockItems[4], mockItems[0], mockItems[3]];

const navItems = [
  { label: "Inicio", icon: "home-outline" as const, active: true },
  { label: "Explorar", icon: "grid-outline" as const, active: false },
  { label: "Publicar", icon: "add-circle-outline" as const, active: false },
  { label: "Perfil", icon: "person-outline" as const, active: false },
];

const defaultCardImage = require("../assets/images/mochila.png");

function getBadgeStyle(status: MockItem["status"]) {
  if (status === "Achado") {
    return {
      color: "#12B76A",
      backgroundColor: "#FFFFFF",
    };
  }

  if (status === "Devolvido") {
    return {
      color: "#7A5AF8",
      backgroundColor: "#FFFFFF",
    };
  }

  return {
    color: "#3552B2",
    backgroundColor: "#FFFFFF",
  };
}

function getCardTitle(title: MockItem["title"]) {
  if (title.toLowerCase().includes("mochila")) return "Black School Bag";
  if (title.toLowerCase().includes("carteira")) return "Brown Wallet";
  if (title.toLowerCase().includes("fone")) return "Bluetooth Earbuds";
  if (title.toLowerCase().includes("cracha")) return "ID Badge";
  if (title.toLowerCase().includes("garrafa")) return "Bottle";
  return "Lost Item";
}

function ItemCard({ item }: { item: MockItem }) {
  const badgeStyle = getBadgeStyle(item.status);

  return (
    <Pressable
      style={styles.itemCard}
      onPress={() =>
        Alert.alert(
          "Visual",
          "Essa tela esta sendo montada apenas como prototipo visual.",
        )
      }
    >
      <View style={styles.thumbnail}>
        <View style={styles.thumbnailBadgeWrap}>
          <Text
            style={[
              styles.thumbnailBadge,
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
          source={defaultCardImage}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.itemTitle} numberOfLines={2}>
        {getCardTitle(item.title)}
      </Text>
      <Text style={styles.itemDate}>Jan 17, 2024</Text>

      <View style={styles.locationRow}>
        <Ionicons name="location" size={12} color="#3552B2" />
        <Text style={styles.locationText}>Lapaz</Text>
      </View>
    </Pressable>
  );
}

function ItemSection({ title, items }: { title: string; items: MockItem[] }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          hitSlop={8}
          onPress={() =>
            Alert.alert(
              "Visual",
              "O botao 'Ver todos' e apenas ilustrativo por enquanto.",
            )
          }
        >
          <Text style={styles.sectionLink}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {items.map((item) => (
          <ItemCard key={`${title}-${item.id}`} item={item} />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadSession() {
      const [storedAccessMode, storedUser] = await Promise.all([
        getAccessMode(),
        getUser(),
      ]);

      setAccessMode(storedAccessMode);
      setUser(storedUser);
    }

    loadSession();
  }, []);

  const isGuest = accessMode === "guest";
  const profileName = isGuest ? "Modo visitante" : user?.name || profile.name;
  const profileEmail = isGuest
    ? "Visualizacao limitada"
    : user?.email || profile.email;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.profileWrap}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={22} color="#3552B2" />
              </View>

              <View>
                <Text style={styles.profileName}>{profileName}</Text>
                <Text style={styles.profileEmail}>{profileEmail}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() =>
                Alert.alert(
                  "Visual",
                  "Notificacoes ainda nao foram implementadas.",
                )
              }
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.ctaCard}>
            <View style={styles.ctaTextWrap}>
              <Text style={styles.ctaTitle}>Perdeu ou encontrou um item?</Text>
              <Text style={styles.ctaDescription}>
                Publique aqui para alguem recuperar ou encontrar um objeto
                perdido
              </Text>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                isGuest
                  ? router.push("/login")
                  : router.push("/publish")
              }
            >
              <Text style={styles.registerButtonText}>
                {isGuest ? "Entrar com RA" : "Registrar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isGuest ? (
          <View style={styles.guestBanner}>
            <View style={styles.guestBannerIcon}>
              <Ionicons name="lock-closed-outline" size={18} color="#3552B2" />
            </View>
            <View style={styles.guestBannerTextWrap}>
              <Text style={styles.guestBannerTitle}>
                Entre com seu RA para continuar
              </Text>
              <Text style={styles.guestBannerText}>
                No modo visitante, voce pode visualizar os itens, mas publicar e
                acessar o perfil completo continuam bloqueados.
              </Text>
            </View>
          </View>
        ) : null}

        <ItemSection title="Itens Recentes" items={recentItems} />
        <ItemSection title="Itens perdidos" items={lostItems} />
      </ScrollView>

      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => {
              if (item.label === "Explorar") {
                router.push({ pathname: "/explore" });
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

              Alert.alert("Visual", `A aba ${item.label} sera criada depois.`);
            }}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={item.active ? "#FFC726" : "#F4F7FF"}
            />
            <Text
              style={[styles.navLabel, item.active && styles.navLabelActive]}
            >
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
    backgroundColor: "#F3F4F8",
  },
  content: {
    paddingBottom: 106,
  },
  header: {
    backgroundColor: "#3552B2",
    paddingHorizontal: 18,
    paddingTop: 46,
    paddingBottom: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  profileWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  profileEmail: {
    color: "#DDE6FF",
    fontSize: 11,
    marginTop: 2,
  },
  notificationButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaCard: {
    backgroundColor: "#FFE9E4",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  ctaTextWrap: {
    flex: 1,
  },
  ctaTitle: {
    color: "#202020",
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "800",
    marginBottom: 6,
    maxWidth: 160,
  },
  ctaDescription: {
    color: "#4F4B4B",
    fontSize: 11.5,
    lineHeight: 16,
    maxWidth: 170,
  },
  registerButton: {
    borderWidth: 2,
    borderColor: "#D87537",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  registerButtonText: {
    color: "#3B2E2E",
    fontSize: 14,
    fontWeight: "700",
  },
  guestBanner: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: "#EAF0FF",
    borderRadius: 18,
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
  section: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: "#202020",
    fontSize: 15,
    fontWeight: "800",
  },
  sectionLink: {
    color: "#545454",
    fontSize: 12,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  itemCard: {
    width: "48.4%",
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    padding: 6,
    paddingBottom: 10,
  },
  thumbnail: {
    height: 118,
    borderRadius: 12,
    backgroundColor: "#DADDE5",
    overflow: "hidden",
    marginBottom: 8,
  },
  thumbnailBadgeWrap: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 2,
  },
  thumbnailBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: "hidden",
    fontSize: 9,
    fontWeight: "700",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  itemTitle: {
    color: "#101010",
    fontSize: 12.5,
    fontWeight: "800",
    marginBottom: 3,
    minHeight: 32,
  },
  itemDate: {
    color: "#303030",
    fontSize: 11,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationText: {
    color: "#303030",
    fontSize: 10.5,
    flex: 1,
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
