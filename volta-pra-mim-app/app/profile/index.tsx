import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AccessMode, getAccessMode, getUser, User } from "@/services/auth.storage";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const profile = {
  name: "Marcinho Branco",
  ra: "24011434",
  email: "marcinho.nbrc@gmail.com",
  phone: "(11) 99876-5432",
};

const actions = [
  {
    label: "Editar perfil",
    description: "Atualize nome, email e telefone.",
    icon: "create-outline" as const,
    route: "/profile/edit" as const,
  },
  {
    label: "Trocar senha",
    description: "Defina uma nova senha para a conta.",
    icon: "lock-closed-outline" as const,
    route: "/profile/change-password" as const,
  },
  {
    label: "Excluir conta",
    description: "Acao permanente para remover sua conta.",
    icon: "trash-outline" as const,
    route: "/profile/delete-account" as const,
    danger: true,
  },
];

export default function ProfileScreen() {
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

  if (accessMode === null) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="small" color="#3552B2" />
      </View>
    );
  }

  if (accessMode === "guest") {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={22} color="#111111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Seu perfil</Text>
        </View>

        <View style={styles.restrictedCard}>
          <View style={styles.restrictedIcon}>
            <Ionicons name="person-circle-outline" size={34} color="#3552B2" />
          </View>

          <Text style={styles.restrictedTitle}>
            Entre com seu RA para continuar
          </Text>
          <Text style={styles.restrictedText}>
            O perfil completo, a edicao dos seus dados e as configuracoes da
            conta ficam disponiveis apenas para alunos autenticados.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.primaryButtonText}>Entrar com RA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace("/home")}
          >
            <Text style={styles.secondaryButtonText}>Voltar para home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const profileName = user?.name || profile.name;
  const profileRa = user?.ra || profile.ra;
  const profileEmail = user?.email || profile.email;
  const profilePhone = user?.phone || profile.phone;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Seu perfil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={34} color="#3552B2" />
        </View>

        <Text style={styles.name}>{profileName}</Text>
        <Text style={styles.meta}>RA: {profileRa}</Text>
        <Text style={styles.meta}>{profileEmail}</Text>
        <Text style={styles.meta}>{profilePhone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>

        {actions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionCard}
            onPress={() => router.push({ pathname: action.route })}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.actionIcon,
                action.danger && styles.actionIconDanger,
              ]}
            >
              <Ionicons
                name={action.icon}
                size={20}
                color={action.danger ? "#FF3B3B" : "#3552B2"}
              />
            </View>

            <View style={styles.actionTextWrap}>
              <Text
                style={[
                  styles.actionTitle,
                  action.danger && styles.actionTitleDanger,
                ]}
              >
                {action.label}
              </Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
  },
  profileCard: {
    backgroundColor: "#3552B2",
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 22,
  },
  restrictedCard: {
    backgroundColor: "#EAF0FF",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  restrictedIcon: {
    width: 78,
    height: 78,
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
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  meta: {
    color: "#E4EBFF",
    fontSize: 13,
    marginBottom: 4,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#171717",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionIconDanger: {
    backgroundColor: "#FFE6E6",
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    color: "#151515",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },
  actionTitleDanger: {
    color: "#D92D20",
  },
  actionDescription: {
    color: "#6B7280",
    fontSize: 12.5,
    lineHeight: 18,
  },
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#3552B2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#3552B2",
    fontSize: 15,
    fontWeight: "700",
  },
});
