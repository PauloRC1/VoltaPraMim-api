import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenHeader } from "@/components/screen-header";

const dataItems = [
  "Nome e RA institucional",
  "Email e telefone de contato",
  "Itens publicados e historico de atualizacoes",
  "Informacoes necessarias para retirada ou devolucao",
];

export default function PrivacyScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Politica de privacidade" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Seus dados ficam ligados ao uso do app</Text>
        <Text style={styles.paragraph}>
          Coletamos apenas as informacoes necessarias para identificar usuarios,
          organizar publicacoes e facilitar a devolucao de itens.
        </Text>

        <View style={styles.card}>
          {dataItems.map((item) => (
            <View key={item} style={styles.itemRow}>
              <View style={styles.dot} />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.paragraph}>
          Os dados nao sao compartilhados com terceiros para publicidade. O
          usuario pode solicitar atualizacao ou exclusao das informacoes pela
          area de conta.
        </Text>
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
  title: {
    color: "#151922",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "800",
    marginBottom: 18,
  },
  paragraph: {
    color: "#384152",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    color: "#384152",
    fontSize: 14,
    fontWeight: "700",
  },
});
