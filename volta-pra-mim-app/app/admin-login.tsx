import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { adminLogin } from "@/services/auth";

export default function AdminLoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAdminLogin() {
    if (!login.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha RA ou email e senha.");
      return;
    }

    try {
      setIsLoading(true);
      await adminLogin({
        login: login.trim(),
        password: password.trim(),
      });
      router.replace("/admin");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Não foi possível entrar no painel administrativo.";
      Alert.alert("Erro", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </TouchableOpacity>

        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Painel administrativo</Text>
        <Text style={styles.subtitle}>
          Acesse com uma conta autorizada para gerenciar usuários e publicações.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="RA ou email administrativo"
            placeholderTextColor="#7E858F"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
          />

          <View style={styles.passwordField}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor="#7E858F"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable
              onPress={() => setShowPassword((current) => !current)}
              hitSlop={10}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#313743"
              />
            </Pressable>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleAdminLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar no ADM</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F2F4",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingBottom: 36,
    marginTop: -72,
  },
  backButton: {
    position: "absolute",
    top: 54,
    left: 22,
    width: 34,
    height: 34,
    justifyContent: "center",
  },
  logoImage: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: -96,
  },
  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#141414",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: "#5C616B",
    textAlign: "center",
    marginBottom: 18,
  },
  form: {
    gap: 12,
  },
  input: {
    height: 54,
    borderRadius: 999,
    backgroundColor: "#D1D5DA",
    paddingHorizontal: 18,
    color: "#1F1F1F",
    fontSize: 15,
  },
  passwordField: {
    height: 54,
    borderRadius: 999,
    backgroundColor: "#D1D5DA",
    paddingLeft: 18,
    paddingRight: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    color: "#1F1F1F",
    fontSize: 15,
  },
  button: {
    marginTop: 4,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});
