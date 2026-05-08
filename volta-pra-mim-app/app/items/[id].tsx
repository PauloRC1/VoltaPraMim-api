import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { getAccessMode, getUser, User } from "@/services/auth.storage";
import { getItemStatusStyle } from "@/utils/item-status";
import {
  ApiItem,
  formatItemCategory,
  formatItemDate,
  getItemById,
  listItems,
  markItemAsReturned,
} from "@/services/items";
import { ItemImage } from "@/components/item-image";

function SimilarItemCard({ item }: { item: ApiItem }) {
  const statusStyle = getItemStatusStyle(item.status);

  return (
    <TouchableOpacity
      style={styles.similarCard}
      activeOpacity={0.86}
      onPress={() =>
        router.push({
          pathname: "/items/[id]",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.similarImageWrap}>
        <ItemImage
          imageUrl={item.imageUrl}
          style={styles.similarImage}
          resizeMode="cover"
        />
        <View
          style={[
            styles.similarBadge,
            { backgroundColor: statusStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.similarBadgeText, { color: statusStyle.color }]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>

      <Text style={styles.similarTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.similarDate}>{formatItemDate(item.date)}</Text>

      <View style={styles.similarLocationRow}>
        <Ionicons name="location" size={12} color="#3552B2" />
        <Text style={styles.similarLocation} numberOfLines={1}>
          {item.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [accessMode, setAccessMode] = useState<"authenticated" | "guest" | null>(
    null,
  );
  const [user, setUser] = useState<User | null>(null);
  const [item, setItem] = useState<ApiItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<ApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResolving, setIsResolving] = useState(false);

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

  useEffect(() => {
    async function loadItem() {
      if (!id) return;

      try {
        setIsLoading(true);
        setErrorMessage("");

        const [apiItem, apiItems] = await Promise.all([
          getItemById(id),
          listItems(),
        ]);

        setItem(apiItem);
        setRelatedItems(apiItems.filter((currentItem) => currentItem.id !== id).slice(0, 4));
      } catch {
        setErrorMessage("Não foi possível carregar este item.");
      } finally {
        setIsLoading(false);
      }
    }

    loadItem();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name="hourglass-outline" size={30} color="#3552B2" />
        </View>
        <Text style={styles.emptyTitle}>Carregando item</Text>
        <Text style={styles.emptyText}>Buscando as informações mais recentes.</Text>
      </View>
    );
  }

  if (!item || errorMessage) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name="search-outline" size={30} color="#3552B2" />
        </View>
        <Text style={styles.emptyTitle}>Item não encontrado</Text>
        <Text style={styles.emptyText}>
          {errorMessage || "Volte para explorar e escolha um item válido para visualizar."}
        </Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace({ pathname: "/explore" })}
        >
          <Text style={styles.primaryButtonText}>Voltar para explorar</Text>
        </Pressable>
      </View>
    );
  }

  const statusStyle = getItemStatusStyle(item.status);
  const isGuest = accessMode === "guest";
  const isOwner = Boolean(user?.id && (item.user?.id === user.id || item.userId === user.id));
  const canMarkResolved = isOwner && item.status !== "DEVOLVIDO";

  function handleContactPublisher() {
    const currentItem = item;

    if (!currentItem) return;

    const publisherPhone =
      currentItem.hidePhone ? null : currentItem.contactPhone;

    if (!currentItem?.user?.email && !publisherPhone) {
      Alert.alert(
        "Contato indisponível",
        "Não encontramos um email de contato para quem publicou este item.",
      );
      return;
    }

    const publisherEmail = currentItem.user?.email;

    if (!publisherEmail) {
      Alert.alert("Entrar em contato", publisherPhone || "Contato indisponível", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Copiar telefone",
          onPress: async () => {
            await Clipboard.setStringAsync(publisherPhone || "");
            Alert.alert("Telefone copiado", "O telefone foi copiado.");
          },
        },
      ]);
      return;
    }
    const subject = encodeURIComponent(`VoltaPraMim: ${currentItem.title}`);
    const body = encodeURIComponent(
      `Olá, vi sua publicação sobre "${currentItem.title}" no VoltaPraMim e gostaria de combinar a devolução/recuperação do item.`,
    );
    const mailtoUrl = `mailto:${publisherEmail}?subject=${subject}&body=${body}`;

    Alert.alert("Entrar em contato", publisherPhone || publisherEmail, [
      { text: "Cancelar", style: "cancel" },
      ...(publisherPhone
        ? [
            {
              text: "Copiar telefone",
              onPress: async () => {
                await Clipboard.setStringAsync(publisherPhone);
                Alert.alert("Telefone copiado", "O telefone foi copiado.");
              },
            },
          ]
        : []),
      {
        text: "Copiar email",
        onPress: async () => {
          await Clipboard.setStringAsync(publisherEmail);
          Alert.alert(
            "Email copiado",
            "O email foi copiado para a área de transferência.",
          );
        },
      },
      {
        text: "Enviar email",
        onPress: async () => {
          const canOpenEmail = await Linking.canOpenURL(mailtoUrl);

          if (!canOpenEmail) {
            Alert.alert(
              "Email indisponível",
              "Não encontramos um aplicativo de email configurado neste dispositivo.",
            );
            return;
          }

          await Linking.openURL(mailtoUrl);
        },
      },
    ]);
  }

  function handleMarkResolved() {
    if (!item) return;

    const itemId = item.id;

    Alert.alert(
      "Marcar como resolvido?",
      "Use essa ação quando o item já tiver sido devolvido ou recuperado.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Marcar",
          onPress: async () => {
            try {
              setIsResolving(true);
              const updatedItem = await markItemAsReturned(itemId);
              setItem((currentItem) =>
                currentItem ? { ...currentItem, status: updatedItem.status } : currentItem,
              );
            } catch (error: any) {
              const message =
                error.response?.data?.message ||
                "Não foi possível marcar este item como resolvido.";
              Alert.alert("Erro", message);
            } finally {
              setIsResolving(false);
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <ItemImage
          imageUrl={item.imageUrl}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.heroOverlay}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>

          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}
          >
            <Ionicons name={statusStyle.icon} size={14} color={statusStyle.color} />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.quickMetaGrid}>
          <View style={styles.quickMetaItem}>
            <Ionicons name="calendar-outline" size={18} color="#3552B2" />
            <Text style={styles.quickMetaLabel}>Data</Text>
            <Text style={styles.quickMetaValue}>{formatItemDate(item.date)}</Text>
          </View>

          <View style={styles.quickMetaItem}>
            <Ionicons name="pricetag-outline" size={18} color="#3552B2" />
            <Text style={styles.quickMetaLabel}>Categoria</Text>
            <Text style={styles.quickMetaValue}>{formatItemCategory(item.category)}</Text>
          </View>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.locationTextWrap}>
            <Text style={styles.locationLabel}>Local informado</Text>
            <Text style={styles.locationValue}>{item.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.sectionText}>{item.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Publicado por</Text>
        <View style={styles.publisherRow}>
          <View style={styles.publisherAvatar}>
            <Ionicons name="person" size={20} color="#3552B2" />
          </View>
          <View style={styles.publisherTextWrap}>
            <Text style={styles.publisherName}>{item.user?.name || "Usuário"}</Text>
            <Text style={styles.publisherHint}>Aluno cadastrado</Text>
          </View>
        </View>
      </View>

      <View style={styles.contactCard}>
        <View style={styles.contactIcon}>
          <Ionicons
            name={isGuest ? "lock-closed-outline" : "chatbubble-ellipses-outline"}
            size={24}
            color="#3552B2"
          />
        </View>

        <Text style={styles.contactTitle}>
          {isGuest ? "Entre com seu RA para continuar" : "Combine a devolução"}
        </Text>
        <Text style={styles.contactText}>
          {isGuest
            ? "Visitantes podem consultar os detalhes, mas precisam entrar para solicitar contato."
            : "Converse com quem publicou para combinar a devolução ou recuperação do item."}
        </Text>

        <TouchableOpacity
          style={styles.contactButton}
          activeOpacity={0.85}
          onPress={() => {
            if (isGuest) {
              router.push("/login");
              return;
            }

            handleContactPublisher();
          }}
        >
          <Text style={styles.contactButtonText}>
            {isGuest ? "Entrar com RA" : "Entrar em contato"}
          </Text>
        </TouchableOpacity>

        {canMarkResolved ? (
          <TouchableOpacity
            style={styles.resolveButton}
            activeOpacity={0.85}
            onPress={handleMarkResolved}
            disabled={isResolving}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#3552B2" />
            <Text style={styles.resolveButtonText}>
              {isResolving ? "Marcando..." : "Marcar como resolvido"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.relatedSection}>
        <View style={styles.relatedHeader}>
          <Text style={styles.sectionTitle}>Itens semelhantes</Text>
          <TouchableOpacity onPress={() => router.push("/explore")} hitSlop={8}>
            <Text style={styles.relatedLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.relatedGrid}>
          {relatedItems.map((relatedItem) => (
            <SimilarItemCard key={relatedItem.id} item={relatedItem} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  content: {
    paddingBottom: 54,
  },
  hero: {
    height: 284,
    backgroundColor: "#D8DDE8",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 46,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "rgba(10, 18, 34, 0.16)",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  summaryCard: {
    marginHorizontal: 18,
    marginTop: -38,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
  },
  title: {
    color: "#151922",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    marginBottom: 16,
  },
  quickMetaGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  quickMetaItem: {
    flex: 1,
    minHeight: 86,
    borderRadius: 16,
    backgroundColor: "#F2F5FF",
    padding: 12,
  },
  quickMetaLabel: {
    color: "#667085",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 3,
  },
  quickMetaValue: {
    color: "#20242D",
    fontSize: 13,
    fontWeight: "800",
  },
  locationCard: {
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationLabel: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  locationValue: {
    color: "#20242D",
    fontSize: 14,
    fontWeight: "800",
  },
  card: {
    marginTop: 14,
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
  },
  sectionTitle: {
    color: "#20242D",
    fontSize: 16,
    fontWeight: "800",
  },
  sectionText: {
    color: "#5D6678",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  publisherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  publisherAvatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  publisherTextWrap: {
    flex: 1,
  },
  publisherName: {
    color: "#20242D",
    fontSize: 15,
    fontWeight: "800",
  },
  publisherHint: {
    color: "#667085",
    fontSize: 12.5,
    marginTop: 3,
  },
  contactCard: {
    marginTop: 14,
    marginHorizontal: 18,
    backgroundColor: "#EAF0FF",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
  },
  contactIcon: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  contactTitle: {
    color: "#203469",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  contactText: {
    color: "#42506B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 16,
  },
  contactButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  resolveButton: {
    width: "100%",
    height: 50,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 10,
  },
  resolveButtonText: {
    color: "#3552B2",
    fontSize: 14,
    fontWeight: "800",
  },
  relatedSection: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  relatedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  relatedLink: {
    color: "#3552B2",
    fontSize: 13,
    fontWeight: "800",
  },
  relatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  similarCard: {
    width: "48.4%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 7,
    paddingBottom: 10,
  },
  similarImageWrap: {
    height: 116,
    borderRadius: 13,
    overflow: "hidden",
    backgroundColor: "#D8DDE8",
    marginBottom: 8,
  },
  similarImage: {
    width: "100%",
    height: "100%",
  },
  similarBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  similarBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  similarTitle: {
    color: "#151922",
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: "800",
    minHeight: 32,
  },
  similarDate: {
    color: "#4B5563",
    fontSize: 11,
    marginTop: 4,
  },
  similarLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  similarLocation: {
    flex: 1,
    color: "#4B5563",
    fontSize: 10.5,
  },
  primaryButton: {
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
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  emptyIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#151922",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },
  emptyText: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 18,
  },
});
