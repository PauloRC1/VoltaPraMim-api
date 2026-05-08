import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenHeader } from "@/components/screen-header";
import {
  AdminItem,
  AdminSummary,
  AdminUser,
  InstitutionalAccount,
  createInstitutionalAccount,
  deleteAdminItem,
  getAdminItems,
  getAdminSummary,
  getAdminUsers,
  getInstitutionalAccounts,
  markAdminItemReturned,
} from "@/services/admin";
import { formatItemDate } from "@/services/items";
import { getItemStatusStyle } from "@/utils/item-status";
import { useFocusEffect, router } from "expo-router";

type AdminTab = "items" | "users" | "accounts";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color="#3552B2" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function AdminScreen() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [accounts, setAccounts] = useState<InstitutionalAccount[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>("items");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountRa, setNewAccountRa] = useState("");
  const [newAccountPhone, setNewAccountPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadAdminData(refreshing = false) {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage("");
      const [apiSummary, apiItems, apiUsers, apiAccounts] = await Promise.all([
        getAdminSummary(),
        getAdminItems(),
        getAdminUsers(),
        getInstitutionalAccounts(),
      ]);

      setSummary(apiSummary);
      setItems(apiItems);
      setUsers(apiUsers);
      setAccounts(apiAccounts);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Não foi possível carregar o painel ADM.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadAdminData();
    }, []),
  );

  function handleResolveItem(itemId: string) {
    Alert.alert("Marcar como resolvido?", "Essa ação atualiza a publicação.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Resolver",
        onPress: async () => {
          try {
            const updated = await markAdminItemReturned(itemId);
            setItems((currentItems) =>
              currentItems.map((item) =>
                item.id === itemId ? { ...item, status: updated.status } : item,
              ),
            );
            await loadAdminData(true);
          } catch (error: any) {
            Alert.alert(
              "Erro",
              error.response?.data?.message || "Não foi possível resolver o item.",
            );
          }
        },
      },
    ]);
  }

  function handleDeleteItem(itemId: string) {
    Alert.alert("Excluir publicação?", "A publicação será removida do sistema.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAdminItem(itemId);
            setItems((currentItems) =>
              currentItems.filter((item) => item.id !== itemId),
            );
            await loadAdminData(true);
          } catch (error: any) {
            Alert.alert(
              "Erro",
              error.response?.data?.message || "Não foi possível excluir o item.",
            );
          }
        },
      },
    ]);
  }

  async function handleCreateAccount() {
    if (!newAccountName.trim() || !newAccountEmail.trim() || !newAccountRa.trim()) {
      Alert.alert("Erro", "Preencha nome, email e RA.");
      return;
    }

    try {
      const account = await createInstitutionalAccount({
        name: newAccountName.trim(),
        email: newAccountEmail.trim(),
        ra: newAccountRa.trim(),
        phone: newAccountPhone.trim() || null,
      });
      setAccounts((currentAccounts) => [account, ...currentAccounts]);
      setNewAccountName("");
      setNewAccountEmail("");
      setNewAccountRa("");
      setNewAccountPhone("");
      Alert.alert("Conta criada", "RA liberado para primeiro acesso.");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível criar a conta.",
      );
    }
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Painel ADM" />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color="#3552B2" />
          <Text style={styles.feedbackText}>Carregando painel...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Painel ADM" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadAdminData(true)}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {errorMessage ? (
          <View style={styles.feedbackCard}>
            <Ionicons name="lock-closed-outline" size={28} color="#3552B2" />
            <Text style={styles.feedbackTitle}>Acesso indisponível</Text>
            <Text style={styles.feedbackText}>{errorMessage}</Text>
          </View>
        ) : null}

        {summary ? (
          <View style={styles.statsGrid}>
            <StatCard label="Usuários" value={summary.usersCount} icon="people-outline" />
            <StatCard label="Em aberto" value={summary.openItemsCount} icon="albums-outline" />
            <StatCard label="Resolvidos" value={summary.returnedItemsCount} icon="checkmark-circle-outline" />
            <StatCard label="Perdidos" value={summary.lostCount} icon="search-outline" />
          </View>
        ) : null}

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "items" && styles.tabButtonActive]}
            onPress={() => setActiveTab("items")}
          >
            <Text style={[styles.tabText, activeTab === "items" && styles.tabTextActive]}>
              Publicações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "users" && styles.tabButtonActive]}
            onPress={() => setActiveTab("users")}
          >
            <Text style={[styles.tabText, activeTab === "users" && styles.tabTextActive]}>
              Usuários
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "accounts" && styles.tabButtonActive]}
            onPress={() => setActiveTab("accounts")}
          >
            <Text style={[styles.tabText, activeTab === "accounts" && styles.tabTextActive]}>
              RAs
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "items" ? (
          <View style={styles.list}>
            {items.map((item) => {
              const statusStyle = getItemStatusStyle(item.status);
              const isReturned = item.status === "DEVOLVIDO";

              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.cardTopRow}>
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
                    <Text style={styles.cardDate}>{formatItemDate(item.date)}</Text>
                  </View>

                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>Por {item.user?.name || "Usuário"}</Text>
                  <Text style={styles.cardMeta}>RA {item.user?.ra || "-"}</Text>
                  <Text style={styles.cardMeta}>{item.location}</Text>

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
                      <Text style={styles.secondaryActionText}>Ver</Text>
                    </TouchableOpacity>

                    {!isReturned ? (
                      <TouchableOpacity
                        style={styles.resolveAction}
                        onPress={() => handleResolveItem(item.id)}
                      >
                        <Text style={styles.resolveActionText}>Resolver</Text>
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      style={styles.deleteAction}
                      onPress={() => handleDeleteItem(item.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#D92D20" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : activeTab === "users" ? (
          <View style={styles.list}>
            {users.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={19} color="#3552B2" />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.cardMeta}>RA {user.ra}</Text>
                  <Text style={styles.cardMeta}>{user.email}</Text>
                </View>
                <View style={styles.userCountBadge}>
                  <Text style={styles.userCountValue}>{user._count.items}</Text>
                  <Text style={styles.userCountLabel}>itens</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Liberar novo RA</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#8A8F98"
                value={newAccountName}
                onChangeText={setNewAccountName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email institucional"
                placeholderTextColor="#8A8F98"
                value={newAccountEmail}
                onChangeText={setNewAccountEmail}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="RA"
                placeholderTextColor="#8A8F98"
                value={newAccountRa}
                onChangeText={setNewAccountRa}
                keyboardType="number-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone opcional"
                placeholderTextColor="#8A8F98"
                value={newAccountPhone}
                onChangeText={setNewAccountPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
                <Text style={styles.createButtonText}>Criar conta institucional</Text>
              </TouchableOpacity>
            </View>

            {accounts.map((account) => (
              <View key={account.id} style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Ionicons name="school-outline" size={19} color="#3552B2" />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{account.name}</Text>
                  <Text style={styles.cardMeta}>RA {account.ra}</Text>
                  <Text style={styles.cardMeta}>{account.email}</Text>
                </View>
                <View style={styles.statusDot} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 18,
  },
  statCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    color: "#151922",
    fontSize: 25,
    fontWeight: "800",
  },
  statLabel: {
    color: "#667085",
    fontSize: 12.5,
    fontWeight: "700",
    marginTop: 2,
  },
  tabs: {
    height: 46,
    borderRadius: 999,
    backgroundColor: "#E4E8F0",
    flexDirection: "row",
    padding: 4,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#3552B2",
  },
  tabText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "800",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  list: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  cardDate: {
    color: "#667085",
    fontSize: 11,
    fontWeight: "700",
  },
  cardTitle: {
    color: "#151922",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
    marginBottom: 8,
  },
  cardMeta: {
    color: "#667085",
    fontSize: 12.5,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  secondaryAction: {
    flex: 1,
    height: 40,
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
  resolveAction: {
    flex: 1,
    height: 40,
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
  deleteAction: {
    width: 42,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#FFECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#151922",
    fontSize: 14.5,
    fontWeight: "800",
    marginBottom: 3,
  },
  userCountBadge: {
    minWidth: 54,
    borderRadius: 14,
    backgroundColor: "#F2F5FF",
    alignItems: "center",
    paddingVertical: 8,
  },
  userCountValue: {
    color: "#3552B2",
    fontSize: 16,
    fontWeight: "800",
  },
  userCountLabel: {
    color: "#667085",
    fontSize: 10,
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  formTitle: {
    color: "#151922",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4D8DF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    color: "#111111",
    fontSize: 13.5,
  },
  createButton: {
    height: 46,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#12B76A",
  },
  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    marginBottom: 14,
  },
  feedbackTitle: {
    color: "#151922",
    fontSize: 17,
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
});
