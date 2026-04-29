import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenHeader } from "@/components/screen-header";

const faqs = [
  {
    question: "O que e o VoltaPraMim?",
    answer:
      "E um app para centralizar achados e perdidos da universidade, ajudando alunos e funcionarios a localizar objetos com mais rapidez.",
  },
  {
    question: "Como crio minha conta?",
    answer:
      "Use seu RA institucional, confirme seus dados e crie uma senha no primeiro acesso.",
  },
  {
    question: "Como publico um item?",
    answer:
      "Entre na aba Publicar, informe se o item foi perdido ou encontrado, adicione local, data, descricao e uma foto quando possivel.",
  },
  {
    question: "Posso editar ou excluir uma publicacao?",
    answer:
      "Sim. Ao entrar com sua conta, voce pode gerenciar os itens publicados por voce.",
  },
];

export default function FaqScreen() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Perguntas frequentes" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tire suas duvidas</Text>
        <Text style={styles.subtitle}>
          Respostas rapidas para usar o VoltaPraMim sem travar no caminho.
        </Text>

        <View style={styles.list}>
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <TouchableOpacity
                key={item.question}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <View style={styles.questionRow}>
                  <Text style={styles.question}>{item.question}</Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#3552B2"
                  />
                </View>

                {isOpen ? <Text style={styles.answer}>{item.answer}</Text> : null}
              </TouchableOpacity>
            );
          })}
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
    padding: 18,
    paddingBottom: 34,
  },
  title: {
    color: "#151922",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  question: {
    flex: 1,
    color: "#20242D",
    fontSize: 14,
    fontWeight: "800",
  },
  answer: {
    color: "#5D6678",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
});
