import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
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

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.meta}>RA: {profile.ra}</Text>
        <Text style={styles.meta}>{profile.email}</Text>
        <Text style={styles.meta}>{profile.phone}</Text>
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
});
