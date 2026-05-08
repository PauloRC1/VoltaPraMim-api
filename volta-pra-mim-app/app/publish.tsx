import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AccessMode, getAccessMode } from "@/services/auth.storage";
import { api } from "@/services/api";
import { AppBottomNav } from "@/components/app-bottom-nav";
import { ItemImage } from "@/components/item-image";
import { uploadImageIfNeeded } from "@/services/uploads";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ItemCategory =
  | "ELETRONICOS"
  | "MOCHILA"
  | "DOCUMENTOS"
  | "ACESSORIOS"
  | "OUTROS";

const categories: { label: string; value: ItemCategory; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Eletrônicos", value: "ELETRONICOS", icon: "phone-portrait-outline" },
  { label: "Mochila", value: "MOCHILA", icon: "bag-outline" },
  { label: "Documentos", value: "DOCUMENTOS", icon: "card-outline" },
  { label: "Acessórios", value: "ACESSORIOS", icon: "watch-outline" },
  { label: "Outros", value: "OUTROS", icon: "ellipsis-horizontal-circle-outline" },
];

export default function PublishScreen() {
  const [hidePhone, setHidePhone] = useState(false);
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);
  const [itemStatus, setItemStatus] = useState<"PERDIDO" | "ENCONTRADO">(
    "PERDIDO",
  );
  const [category, setCategory] = useState<ItemCategory>("MOCHILA");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAccessMode().then(setAccessMode);
  }, []);

  function normalizeDate(value: string) {
    const trimmedValue = value.trim();
    const brazilianDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedValue);

    if (brazilianDate) {
      const [, day, month, year] = brazilianDate;
      return `${year}-${month}-${day}T12:00:00.000Z`;
    }

    return trimmedValue;
  }

  async function handlePublish() {
    if (!title.trim() || !location.trim() || !date.trim() || !description.trim()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatorios.");
      return;
    }

    try {
      setIsSubmitting(true);
      const uploadedImageUrl = imageUrl ? await uploadImageIfNeeded(imageUrl) : undefined;

      await api.post("/items", {
        title: title.trim(),
        description: description.trim(),
        category,
        status: itemStatus,
        location: location.trim(),
        date: normalizeDate(date),
        imageUrl: uploadedImageUrl,
        contactPhone: hidePhone ? undefined : contactPhone.trim() || undefined,
        hidePhone,
      });

      Alert.alert("Item publicado", "O item foi cadastrado com sucesso.", [
        {
          text: "OK",
          onPress: () => router.replace("/home"),
        },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Não foi possível publicar o item. Verifique sua conexão e tente novamente.";

      Alert.alert("Erro", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Autorize o acesso às fotos para adicionar uma imagem ao item.",
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

  if (accessMode === null) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="small" color="#3552B2" />
      </View>
    );
  }

  if (accessMode === "guest") {
    return (
      <View style={styles.blockedScreen}>
        <View style={styles.blockedHeader}>
          <TouchableOpacity
            style={styles.blockedBackButton}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.blockedHeaderTitle}>Publicar</Text>
        </View>

        <View style={styles.blockedCard}>
          <View style={styles.blockedIcon}>
            <Ionicons name="lock-closed-outline" size={28} color="#3552B2" />
          </View>
          <Text style={styles.blockedTitle}>Entre com seu RA para continuar</Text>
          <Text style={styles.blockedText}>
            Publicar itens e uma funcionalidade restrita para alunos. No modo
            visitante, você pode apenas navegar e consultar os achados e
            perdidos.
          </Text>

          <TouchableOpacity
            style={styles.blockedPrimaryButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.blockedPrimaryButtonText}>Entrar com RA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blockedSecondaryButton}
            onPress={() => router.replace("/explore")}
          >
            <Text style={styles.blockedSecondaryButtonText}>
              Continuar explorando
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Publicar</Text>
        </View>

        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Registrar item</Text>
          <Text style={styles.headerText}>
            Conte o que aconteceu para ajudar a comunidade a encontrar ou
            devolver o item.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>O que aconteceu?</Text>
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.intentCard,
                  itemStatus === "PERDIDO" && styles.typeButtonActive,
                ]}
                onPress={() => setItemStatus("PERDIDO")}
              >
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={itemStatus === "PERDIDO" ? "#FFFFFF" : "#3552B2"}
                />
                <Text
                  style={[
                    styles.intentTitle,
                    itemStatus === "PERDIDO" && styles.typeButtonTextActive,
                  ]}
                >
                  Perdi um item
                </Text>
                <Text
                  style={[
                    styles.intentText,
                    itemStatus === "PERDIDO" && styles.intentTextActive,
                  ]}
                >
                  Quero avisar que estou procurando.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.intentCard,
                  itemStatus === "ENCONTRADO" && styles.typeButtonActive,
                ]}
                onPress={() => setItemStatus("ENCONTRADO")}
              >
                <Ionicons
                  name="hand-left-outline"
                  size={20}
                  color={itemStatus === "ENCONTRADO" ? "#FFFFFF" : "#3552B2"}
                />
                <Text
                  style={[
                    styles.intentTitle,
                    itemStatus === "ENCONTRADO" && styles.typeButtonTextActive,
                  ]}
                >
                  Encontrei um item
                </Text>
                <Text
                  style={[
                    styles.intentText,
                    itemStatus === "ENCONTRADO" && styles.intentTextActive,
                  ]}
                >
                  Quero ajudar o dono a recuperar.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Titulo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mochila preta com caderno"
              placeholderTextColor="#8A8F98"
              value={title}
              onChangeText={setTitle}
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
              placeholder="Ex: Predio H15"
              placeholderTextColor="#8A8F98"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 08/04/2026"
              placeholderTextColor="#8A8F98"
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Descreva o item com o maximo de detalhes."
              placeholderTextColor="#8A8F98"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Telefone para contato</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: (11) 99876-5432"
              placeholderTextColor="#8A8F98"
              keyboardType="phone-pad"
              value={contactPhone}
              onChangeText={setContactPhone}
            />
          </View>

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

          <Pressable
            style={styles.checkboxRow}
            onPress={() => setHidePhone((current) => !current)}
          >
            <View
              style={[
                styles.checkbox,
                hidePhone && styles.checkboxChecked,
              ]}
            >
              {hidePhone ? (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              ) : null}
            </View>
            <Text style={styles.checkboxText}>Ocultar meu telefone</Text>
          </Pressable>

          <TouchableOpacity
            style={[styles.publishButton, isSubmitting && styles.buttonDisabled]}
            onPress={handlePublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.publishButtonText}>Publicar item</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AppBottomNav activeTab="publish" />
    </View>
  );
}

const styles = StyleSheet.create({
  blockedScreen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  blockedHeader: {
    backgroundColor: "#3552B2",
    paddingTop: 46,
    paddingHorizontal: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  blockedBackButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  blockedHeaderTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  blockedCard: {
    margin: 18,
    marginTop: 22,
    backgroundColor: "#EAF0FF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },
  blockedIcon: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  blockedTitle: {
    color: "#203469",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  blockedText: {
    color: "#42506B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  blockedPrimaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  blockedPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  blockedSecondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#3552B2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  blockedSecondaryButtonText: {
    color: "#3552B2",
    fontSize: 15,
    fontWeight: "700",
  },
  screen: {
    flex: 1,
    backgroundColor: "#3552B2",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  content: {
    paddingBottom: 138,
  },
  topBar: {
    backgroundColor: "#3552B2",
    paddingHorizontal: 18,
    paddingTop: 46,
    paddingBottom: 16,
  },
  topBarTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  headerCard: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: "#E9EFFD",
    borderRadius: 18,
    padding: 16,
  },
  headerTitle: {
    color: "#1A2B59",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  headerText: {
    color: "#44516E",
    fontSize: 13,
    lineHeight: 20,
  },
  form: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 14,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "700",
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
  },
  intentCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#D3D8E2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: "center",
  },
  intentTitle: {
    color: "#344054",
    fontSize: 13.5,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 5,
  },
  intentText: {
    color: "#667085",
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "600",
  },
  intentTextActive: {
    color: "#EAF0FF",
  },
  typeButton: {
    flex: 1,
    height: 42,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#D3D8E2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  typeButtonActive: {
    backgroundColor: "#3552B2",
    borderColor: "#3552B2",
  },
  typeButtonText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "700",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
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
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4D8DF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111111",
  },
  selectBox: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4D8DF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: "#111111",
    fontSize: 14,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 12,
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
  publishButton: {
    marginTop: 8,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  publishButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelButton: {
    height: 52,
    borderRadius: 999,
    backgroundColor: "#FF3B3B",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
