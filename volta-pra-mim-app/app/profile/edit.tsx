import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AccessMode, getAccessMode } from "@/services/auth.storage";
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

export default function EditProfileScreen() {
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={22} color="#111111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Editar perfil</Text>
        </View>

        <View style={styles.restrictedCard}>
          <View style={styles.restrictedIcon}>
            <Ionicons name="lock-closed-outline" size={28} color="#3552B2" />
          </View>

          <Text style={styles.restrictedTitle}>
            Entre com seu RA para continuar
          </Text>
          <Text style={styles.restrictedText}>
            A edicao do perfil esta disponivel apenas para alunos autenticados.
            No modo visitante, voce pode somente visualizar os itens do app.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.primaryButtonText}>Entrar com RA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace("/profile")}
          >
            <Text style={styles.secondaryButtonText}>Voltar para perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Editar perfil</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#3552B2" />
        </View>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Visual", "A troca de foto sera implementada depois.")
          }
        >
          <Text style={styles.changePhotoText}>Trocar foto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            defaultValue="Marcinho Branco"
            placeholderTextColor="#8A8F98"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            defaultValue="marcinho.nbrc@gmail.com"
            placeholderTextColor="#8A8F98"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Numero</Text>
          <TextInput
            style={styles.input}
            defaultValue="(11) 99876-5432"
            placeholderTextColor="#8A8F98"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>RA</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            defaultValue="24011434"
            editable={false}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => Alert.alert("Visual", "Perfil salvo apenas no mock.")}
      >
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    color: "#111111",
    fontSize: 28,
    fontWeight: "800",
  },
  restrictedCard: {
    backgroundColor: "#EAF0FF",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  restrictedIcon: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  restrictedTitle: {
    color: "#203469",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  restrictedText: {
    color: "#42506B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 26,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  changePhotoText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "600",
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
    fontWeight: "700",
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
  inputDisabled: {
    backgroundColor: "#EEF1F5",
    color: "#6B7280",
  },
  saveButton: {
    marginTop: 34,
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
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#3552B2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#3552B2",
    fontSize: 15,
    fontWeight: "700",
  },
});
