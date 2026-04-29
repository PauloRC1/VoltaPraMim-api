import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ApiItemCategory, getItemById, updateItem } from "@/services/items";

const categories: {
  label: string;
  value: ApiItemCategory;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: "Eletronicos", value: "ELETRONICOS", icon: "phone-portrait-outline" },
  { label: "Mochila", value: "MOCHILA", icon: "bag-outline" },
  { label: "Documentos", value: "DOCUMENTOS", icon: "card-outline" },
  { label: "Acessorios", value: "ACESSORIOS", icon: "watch-outline" },
  { label: "Outros", value: "OUTROS", icon: "ellipsis-horizontal-circle-outline" },
];

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ApiItemCategory>("MOCHILA");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;

      try {
        setIsLoading(true);
        const item = await getItemById(id);
        setTitle(item.title);
        setCategory(item.category);
        setLocation(item.location);
        setDate(formatDateForInput(item.date));
        setDescription(item.description);
        setImageUrl(item.imageUrl || "");
      } catch {
        Alert.alert("Erro", "Nao foi possivel carregar este item.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    loadItem();
  }, [id]);

  async function handleSave() {
    if (!id) return;

    if (!title.trim() || !location.trim() || !date.trim() || !description.trim()) {
      Alert.alert("Erro", "Preencha titulo, local, data e descricao.");
      return;
    }

    try {
      setIsSaving(true);

      await updateItem(id, {
        title: title.trim(),
        category,
        location: location.trim(),
        date: normalizeDate(date),
        description: description.trim(),
        imageUrl: imageUrl.trim() || null,
      });

      Alert.alert("Item atualizado", "As alteracoes foram salvas.", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/items/[id]",
              params: { id },
            }),
        },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Nao foi possivel salvar as alteracoes.";
      Alert.alert("Erro", message);
    } finally {
      setIsSaving(false);
    }
  }

  function normalizeDate(value: string) {
    const trimmedValue = value.trim();
    const brazilianDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedValue);

    if (brazilianDate) {
      const [, day, month, year] = brazilianDate;
      return `${year}-${month}-${day}T12:00:00.000Z`;
    }

    return trimmedValue;
  }

  function formatDateForInput(value: string) {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) return value;

    return new Intl.DateTimeFormat("pt-BR").format(parsedDate);
  }

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="small" color="#3552B2" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar item</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Atualize a publicacao</Text>
        <Text style={styles.infoText}>
          Ajuste os dados principais para deixar a busca mais precisa.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Titulo</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Mochila preta com caderno"
            placeholderTextColor="#8A8F98"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categoryGrid}>
            {categories.map((item) => {
              const isSelected = category === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setCategory(item.value)}
                >
                  <Ionicons
                    name={item.icon}
                    size={17}
                    color={isSelected ? "#FFFFFF" : "#3552B2"}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Local</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: Predio H15"
            placeholderTextColor="#8A8F98"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Ex: 08/04/2026"
            placeholderTextColor="#8A8F98"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Descricao</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o item com detalhes."
            placeholderTextColor="#8A8F98"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>URL da imagem</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://..."
            placeholderTextColor="#8A8F98"
            autoCapitalize="none"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar alteracoes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    color: "#151922",
    fontSize: 29,
    fontWeight: "800",
  },
  infoCard: {
    backgroundColor: "#EAF0FF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  infoTitle: {
    color: "#1A2B59",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  infoText: {
    color: "#42506B",
    fontSize: 13.5,
    lineHeight: 20,
  },
  form: {
    gap: 14,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "800",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    minHeight: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D4D8DF",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 7,
  },
  categoryChipActive: {
    backgroundColor: "#3552B2",
    borderColor: "#3552B2",
  },
  categoryChipText: {
    color: "#344054",
    fontSize: 12.5,
    fontWeight: "800",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4D8DF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111111",
  },
  textArea: {
    minHeight: 128,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4D8DF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingTop: 14,
    fontSize: 14,
    color: "#111111",
  },
  saveButton: {
    marginTop: 28,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
