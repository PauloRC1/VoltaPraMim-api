import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenHeader } from "@/components/screen-header";

export default function TermsScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Termos de uso" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Uso responsavel da plataforma</Text>
        <Text style={styles.paragraph}>
          O VoltaPraMim deve ser usado apenas para registrar, localizar e
          recuperar itens perdidos no campus universitario.
        </Text>
        <Text style={styles.paragraph}>
          As informacoes publicadas precisam ser verdadeiras e respeitosas. E
          proibido criar registros falsos, expor dados sensiveis ou usar o app
          para fins que prejudiquem outras pessoas.
        </Text>
        <Text style={styles.paragraph}>
          A universidade e os administradores podem remover publicacoes
          inadequadas e bloquear contas em caso de uso indevido.
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
    marginBottom: 14,
  },
});
