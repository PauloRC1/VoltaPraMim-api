import { useState } from "react";
import {
  clearAuthData,
  saveAuthData,
  saveGuestSession,
} from "@/services/auth.storage";
import { api } from "@/services/api";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleLogin() {
    if (!login.trim() || !password.trim()) {
      Alert.alert("Atencao", "Preencha RA ou email e a senha.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/login", {
        login: login.trim(),
        password: password.trim(),
      });

      const { token, user } = response.data;

      await saveAuthData({
        token,
        user,
      });

      router.replace("/home");
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("Erro", error.response.data.message);
      } else {
        Alert.alert(
          "Erro de conexao",
          "Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuestAccess() {
    try {
      setGuestLoading(true);
      await clearAuthData();
      await saveGuestSession();
      router.replace("/home");
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Bem-vindo ao VoltaPraMim</Text>
        <Text style={styles.subtitle}>
          Entre com seu RA ou email institucional
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu RA ou email"
            placeholderTextColor="#7E858F"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
          />

          <View style={styles.passwordField}>
            <TextInput
              style={styles.passwordInput}
              placeholder="************"
              placeholderTextColor="#7E858F"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <Pressable
              onPress={() => setShowPassword((current) => !current)}
              hitSlop={10}
              style={styles.eyeButton}
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
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, guestLoading && styles.buttonDisabled]}
            onPress={handleGuestAccess}
            disabled={guestLoading}
          >
            {guestLoading ? (
              <ActivityIndicator color="#3552B2" />
            ) : (
              <Text style={styles.secondaryButtonText}>
                Continuar como visitante
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity hitSlop={10}>
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>ou</Text>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Primeiro acesso? </Text>
            <TouchableOpacity
              hitSlop={10}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.signupLink}>Ativar conta</Text>
            </TouchableOpacity>
          </View>
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
    marginTop: -98,
  },
  logoImage: {
    width: 410,
    height: 410,
    alignSelf: "center",
    marginBottom: -142,
  },
  title: {
    fontSize: 31,
    fontWeight: "800",
    color: "#141414",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
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
  eyeButton: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 4,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    height: 54,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#3552B2",
    backgroundColor: "#EFF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  secondaryButtonText: {
    color: "#3552B2",
    fontSize: 15,
    fontWeight: "700",
  },
  forgotPassword: {
    color: "#4E6DCC",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
  orText: {
    color: "#666B73",
    fontSize: 15,
    textAlign: "center",
    marginTop: 2,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#272B33",
    fontSize: 13.5,
  },
  signupLink: {
    color: "#3552B2",
    fontSize: 13.5,
    fontWeight: "700",
  },
});
