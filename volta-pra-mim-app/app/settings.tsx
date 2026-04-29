import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { clearAuthData } from "@/services/auth.storage";
import { ScreenHeader } from "@/components/screen-header";

type SettingsRoute =
  | "/profile/edit"
  | "/profile/change-password"
  | "/profile/delete-account"
  | "/support/faq"
  | "/support/terms"
  | "/support/privacy"
  | "/support/about";

type SettingsItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: SettingsRoute;
  danger?: boolean;
};

const sections: { title: string; items: SettingsItem[] }[] = [
  {
    title: "Conta",
    items: [
      { label: "Editar perfil", icon: "person-circle-outline", route: "/profile/edit" },
      {
        label: "Alterar senha",
        icon: "lock-closed-outline",
        route: "/profile/change-password",
      },
      {
        label: "Excluir conta",
        icon: "trash-outline",
        route: "/profile/delete-account",
        danger: true,
      },
    ],
  },
  {
    title: "Aparencia",
    items: [
      { label: "Idioma", icon: "language-outline" },
      { label: "Tema", icon: "color-palette-outline" },
      { label: "Notificacoes", icon: "notifications-outline" },
    ],
  },
  {
    title: "Ajuda",
    items: [
      { label: "Perguntas frequentes", icon: "help-buoy-outline", route: "/support/faq" },
      { label: "Termos de uso", icon: "document-text-outline", route: "/support/terms" },
      {
        label: "Politica de privacidade",
        icon: "shield-checkmark-outline",
        route: "/support/privacy",
      },
    ],
  },
  {
    title: "Outros",
    items: [{ label: "Sobre o VoltaPraMim", icon: "information-circle-outline", route: "/support/about" }],
  },
];

export default function SettingsScreen() {
  async function handleLogout() {
    await clearAuthData();
    router.replace("/login");
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Configuracoes" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>Preferencias</Text>
        <Text style={styles.title}>Ajuste sua conta e encontre ajuda</Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.group}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.row,
                    index < section.items.length - 1 && styles.rowBorder,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (item.route) {
                      router.push(item.route);
                    }
                  }}
                >
                  <View
                    style={[
                      styles.rowIcon,
                      item.danger && styles.rowIconDanger,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={17}
                      color={item.danger ? "#D92D20" : "#3552B2"}
                    />
                  </View>

                  <Text style={[styles.rowLabel, item.danger && styles.rowLabelDanger]}>
                    {item.label}
                  </Text>

                  <Ionicons name="chevron-forward" size={18} color="#8A92A3" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 36,
  },
  kicker: {
    color: "#3552B2",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    color: "#151922",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    marginBottom: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#20242D",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  group: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
  },
  row: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowIconDanger: {
    backgroundColor: "#FFECEC",
  },
  rowLabel: {
    flex: 1,
    color: "#262B35",
    fontSize: 14,
    fontWeight: "700",
  },
  rowLabelDanger: {
    color: "#D92D20",
  },
  logoutButton: {
    height: 54,
    borderRadius: 999,
    backgroundColor: "#FF3B3B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
