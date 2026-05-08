import { Ionicons } from "@expo/vector-icons";
import { AppBottomNav } from "@/components/app-bottom-nav";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getItemStatusStyle } from "@/utils/item-status";
import {
  AccessMode,
  getAccessMode,
  getUser,
  User,
} from "@/services/auth.storage";
import { ApiItem, formatItemDate, listItems } from "@/services/items";
import { ItemImage } from "@/components/item-image";

const guestProfile = {
  name: "Visitante",
  email: "Entre com seu RA para publicar itens",
};

function getCardTitle(title: string) {
  if (title.toLowerCase().includes("mochila")) return "Mochila preta";
  if (title.toLowerCase().includes("carteira")) return "Carteira marrom";
  if (title.toLowerCase().includes("fone")) return "Fone bluetooth";
  if (title.toLowerCase().includes("cracha")) return "Cracha institucional";
  if (title.toLowerCase().includes("garrafa")) return "Garrafa termica";
  return title;
}

function ItemCard({ item }: { item: ApiItem }) {
  const badgeStyle = getItemStatusStyle(item.status);

  return (
    <Pressable
      style={styles.itemCard}
      onPress={() =>
        router.push({
          pathname: "/items/[id]",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.thumbnail}>
        <View style={styles.thumbnailBadgeWrap}>
          <Text
            style={[
              styles.thumbnailBadge,
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
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.itemTitle} numberOfLines={2}>
        {getCardTitle(item.title)}
      </Text>
      <Text style={styles.itemDate}>{formatItemDate(item.date)}</Text>

      <View style={styles.locationRow}>
        <Ionicons name="location" size={12} color="#3552B2" />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.location}
        </Text>
      </View>
    </Pressable>
  );
}

function ItemSection({ title, items }: { title: string; items: ApiItem[] }) {
  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          hitSlop={8}
          onPress={() => router.push({ pathname: "/explore" })}
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
  const [items, setItems] = useState<ApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadHome() {
        try {
          setIsLoading(true);
          const [storedAccessMode, storedUser, apiItems] = await Promise.all([
            getAccessMode(),
            getUser(),
            listItems(),
          ]);
          if (isActive) {
            setAccessMode(storedAccessMode);
            setUser(storedAccessMode === "authenticated" ? storedUser : null);
            setItems(apiItems);
          }
        } catch {
          if (isActive) {
            const [storedAccessMode, storedUser] = await Promise.all([
              getAccessMode(),
              getUser(),
            ]);
            setAccessMode(storedAccessMode);
            setUser(storedAccessMode === "authenticated" ? storedUser : null);
            setItems([]);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      loadHome();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const recentItems = items.slice(0, 4);
  const lookingItems = items.filter((item) => item.status === "PERDIDO").slice(0, 4);
  const isGuest = accessMode === "guest";
  const profileName = isGuest ? guestProfile.name : user?.name || "Olá";
  const profileEmail = isGuest
    ? guestProfile.email
    : user?.email || "Bem-vindo ao VoltaPraMim";

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
              onPress={() => router.push("/settings")}
            >
              <Ionicons
                name="settings-outline"
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
              onPress={() => router.push({ pathname: "/publish" })}
            >
              <Text style={styles.registerButtonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#3552B2" />
            <Text style={styles.loadingText}>Carregando itens...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.loadingCard}>
            <Ionicons name="albums-outline" size={24} color="#3552B2" />
            <Text style={styles.loadingText}>
              Nenhuma publicação ainda. Seja o primeiro a registrar um item.
            </Text>
          </View>
        ) : (
          <>
            <ItemSection title="Itens Recentes" items={recentItems} />
            <ItemSection title="Itens procurando dono" items={lookingItems} />
          </>
        )}
      </ScrollView>

      <AppBottomNav activeTab="home" />
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
    paddingBottom: 124,
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
  section: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  loadingCard: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#667085",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
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
    backgroundColor: "#FFFFFF",
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
});
