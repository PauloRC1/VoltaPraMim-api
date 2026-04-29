import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "home" | "explore" | "publish" | "profile";

type NavItem = {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: "/home" | "/explore" | "/publish" | "/profile";
};

const navItems: NavItem[] = [
  { key: "home", label: "Inicio", icon: "home-outline", route: "/home" },
  { key: "explore", label: "Explorar", icon: "grid-outline", route: "/explore" },
  {
    key: "publish",
    label: "Publicar",
    icon: "add-circle-outline",
    route: "/publish",
  },
  { key: "profile", label: "Perfil", icon: "person-outline", route: "/profile" },
];

export function AppBottomNav({ activeTab }: { activeTab: TabKey }) {
  return (
    <SafeAreaView style={styles.bottomNav} edges={["bottom"]}>
      <View style={styles.navContent}>
        {navItems.map((item) => {
          const isActive = item.key === activeTab;

          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => {
                if (!isActive) {
                  router.push(item.route);
                }
              }}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={isActive ? "#FFC726" : "#F4F7FF"}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#3552B2",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  navContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 8,
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
