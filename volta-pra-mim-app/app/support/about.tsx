import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenHeader } from "@/components/screen-header";

const features = [
  "Publicação de itens perdidos e encontrados",
  "Busca por categoria, status e local",
  "Contato mais seguro entre alunos",
  "Organização por data e situação do item",
];

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Sobre o VoltaPraMim" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroIcon}>
          <Ionicons name="return-up-forward" size={34} color="#3552B2" />
        </View>

        <Text style={styles.title}>Achados e perdidos com menos improviso</Text>
        <Text style={styles.paragraph}>
          O VoltaPraMim ajuda a comunidade universitaria a publicar, consultar e
          recuperar objetos esquecidos pelo campus.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que oferecemos</Text>

          {features.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={18} color="#12B76A" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  content: {
    padding: 20,
  },
  heroIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: "#EAF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    color: "#151922",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    marginBottom: 12,
  },
  paragraph: {
    color: "#5D6678",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
  },
  cardTitle: {
    color: "#20242D",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    flex: 1,
    color: "#384152",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
});
