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
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { ApiItemCategory, getItemById, updateItem } from "@/services/items";
import { ItemImage } from "@/components/item-image";
import { uploadImageIfNeeded } from "@/services/uploads";

const categories: {
  label: string;
  value: ApiItemCategory;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: "Eletrônicos", value: "ELETRONICOS", icon: "phone-portrait-outline" },
  { label: "Mochila", value: "MOCHILA", icon: "bag-outline" },
  { label: "Documentos", value: "DOCUMENTOS", icon: "card-outline" },
  { label: "Acessórios", value: "ACESSORIOS", icon: "watch-outline" },
  { label: "Outros", value: "OUTROS", icon: "ellipsis-horizontal-circle-outline" },
];

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ApiItemCategory>("MOCHILA");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [hidePhone, setHidePhone] = useState(false);
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
        setContactPhone(item.contactPhone || "");
        setHidePhone(Boolean(item.hidePhone));
        setImageUrl(item.imageUrl || "");
      } catch {
        Alert.alert("Erro", "Não foi possível carregar este item.", [
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
      const uploadedImageUrl = imageUrl ? await uploadImageIfNeeded(imageUrl.trim()) : null;

      await updateItem(id, {
        title: title.trim(),
        category,
        location: location.trim(),
        date: normalizeDate(date),
        description: description.trim(),
        imageUrl: uploadedImageUrl,
        contactPhone: hidePhone ? null : contactPhone.trim() || null,
        hidePhone,
      });

      Alert.alert("Item atualizado", "As alterações foram salvas.", [
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
        "Não foi possível salvar as alterações.";
      Alert.alert("Erro", message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Autorize o acesso às fotos para alterar a imagem do item.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const mediaType = asset?.mimeType || "image/jpeg";
      setImageUrl(asset?.base64 ? `data:${mediaType};base64,${asset.base64}` : asset?.uri || "");
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
        <Text style={styles.infoTitle}>Atualize a publicação</Text>
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
          <Text style={styles.label}>Descrição</Text>
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
          <Text style={styles.label}>Telefone para contato</Text>
          <TextInput
            style={styles.input}
            value={contactPhone}
            onChangeText={setContactPhone}
            placeholder="Ex: (11) 99876-5432"
            placeholderTextColor="#8A8F98"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setHidePhone((current) => !current)}
          activeOpacity={0.85}
        >
          <View style={[styles.checkbox, hidePhone && styles.checkboxChecked]}>
            {hidePhone ? (
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            ) : null}
          </View>
          <Text style={styles.checkboxText}>Ocultar meu telefone</Text>
        </TouchableOpacity>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Foto do item</Text>
          <TouchableOpacity
            style={styles.imageUploadCard}
            onPress={handlePickImage}
            activeOpacity={0.86}
          >
            {imageUrl ? (
              <>
                <ItemImage
                  imageUrl={imageUrl}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Ionicons name="image-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.imageOverlayText}>Trocar foto</Text>
                </View>
              </>
            ) : (
              <>
                <Ionicons name="image-outline" size={26} color="#3552B2" />
                <Text style={styles.imageUploadTitle}>Adicionar foto</Text>
                <Text style={styles.imageUploadDescription}>
                  Escolha uma imagem da galeria para ajudar na identificação.
                </Text>
              </>
            )}
          </TouchableOpacity>

          {imageUrl ? (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUrl("")}
            >
              <Ionicons name="trash-outline" size={16} color="#D92D20" />
              <Text style={styles.removeImageText}>Remover foto</Text>
            </TouchableOpacity>
          ) : null}
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
          <Text style={styles.saveButtonText}>Salvar alterações</Text>
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
  imageUploadCard: {
    minHeight: 132,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#3552B2",
    backgroundColor: "#EFF3FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageUploadTitle: {
    color: "#3552B2",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 4,
  },
  imageUploadDescription: {
    color: "#596579",
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: "center",
  },
  imagePreview: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 18, 34, 0.34)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6,
  },
  removeImageButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  removeImageText: {
    color: "#D92D20",
    fontSize: 13,
    fontWeight: "700",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.3,
    borderColor: "#7A8394",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3552B2",
    borderColor: "#3552B2",
  },
  checkboxText: {
    color: "#3E4757",
    fontSize: 13,
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
