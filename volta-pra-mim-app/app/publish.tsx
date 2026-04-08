import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AccessMode, getAccessMode } from "@/services/auth.storage";
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

const navItems = [
  { label: "Inicio", icon: "home-outline" as const, active: false },
  { label: "Explorar", icon: "grid-outline" as const, active: false },
  { label: "Publicar", icon: "add-circle-outline" as const, active: true },
  { label: "Perfil", icon: "person-outline" as const, active: false },
];

export default function PublishScreen() {
  const [hidePhone, setHidePhone] = useState(false);
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);

  useEffect(() => {
    getAccessMode().then(setAccessMode);
  }, []);

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
            visitante, voce pode apenas navegar e consultar os achados e
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
            Preencha as informacoes abaixo para publicar um item perdido ou
            achado.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[styles.typeButton, styles.typeButtonActive]}
              >
                <Text
                  style={[styles.typeButtonText, styles.typeButtonTextActive]}
                >
                  Perdido
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.typeButton}>
                <Text style={styles.typeButtonText}>Achado</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Titulo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mochila preta com caderno"
              placeholderTextColor="#8A8F98"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.selectBox}>
              <Text style={styles.selectText}>Mochila</Text>
              <Ionicons name="chevron-down-outline" size={18} color="#555" />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Local</Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() =>
                Alert.alert("Visual", "A selecao de local sera implementada depois.")
              }
              activeOpacity={0.85}
            >
              <Text style={styles.selectText}>Predio H15</Text>
              <Ionicons name="location-outline" size={18} color="#3552B2" />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 08/04/2026"
              placeholderTextColor="#8A8F98"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Descricao</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Descreva o item com o maximo de detalhes."
              placeholderTextColor="#8A8F98"
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.imageUploadCard}
            onPress={() =>
              Alert.alert(
                "Visual",
                "Upload de imagem sera implementado depois.",
              )
            }
          >
            <Ionicons name="image-outline" size={26} color="#3552B2" />
            <Text style={styles.imageUploadTitle}>Adicionar foto</Text>
            <Text style={styles.imageUploadDescription}>
              Envie uma imagem para ajudar na identificacao do item.
            </Text>
          </TouchableOpacity>

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
            style={styles.publishButton}
            onPress={() =>
              Alert.alert("Visual", "Publicacao criada apenas no mock.")
            }
          >
            <Text style={styles.publishButtonText}>Publicar item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => {
              if (item.label === "Inicio") {
                router.push("/home");
                return;
              }

              if (item.label === "Explorar") {
                router.push("/explore");
                return;
              }

              if (item.label === "Perfil") {
                router.push("/profile");
                return;
              }

              Alert.alert("Visual", `A aba ${item.label} ja esta aberta.`);
            }}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={item.active ? "#FFC726" : "#F4F7FF"}
            />
            <Text
              style={[styles.navLabel, item.active && styles.navLabelActive]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    paddingBottom: 110,
  },
  topBar: {
    backgroundColor: "#3552B2",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
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
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#3552B2",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 14,
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
