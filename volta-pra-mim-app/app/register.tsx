import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/services/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [ra, setRa] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    const normalizedName = name.trim();
    const normalizedRa = ra.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const normalizedPassword = password.trim();
    const normalizedConfirmPassword = confirmPassword.trim();

    if (
      !normalizedName ||
      !normalizedRa ||
      !normalizedEmail ||
      !normalizedPassword
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      Alert.alert("Erro", "Informe um email válido.");
      return;
    }

    if (normalizedPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (normalizedPassword !== normalizedConfirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Erro", "Você precisa aceitar os termos de uso.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/register", {
        name: normalizedName,
        email: normalizedEmail,
        ra: normalizedRa,
        password: normalizedPassword,
        phone: normalizedPhone || undefined,
      });

      Alert.alert("Sucesso", "Conta criada com sucesso.", [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Não foi possível criar a conta.";

      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </TouchableOpacity>

        <Text style={styles.title}>Criar Conta</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor="#6E737B"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="RA"
            placeholderTextColor="#6E737B"
            value={ra}
            onChangeText={setRa}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6E737B"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="#6E737B"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View style={styles.passwordField}>
            <TextInput
              style={styles.passwordInput}
              placeholder="************"
              placeholderTextColor="#6E737B"
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
                color="#333333"
              />
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#6E737B"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAcceptedTerms((current) => !current)}
            activeOpacity={0.8}
          >
            <View
              style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}
            >
              {acceptedTerms ? (
                <Ionicons name="checkmark" size={13} color="#FFFFFF" />
              ) : null}
            </View>
            <Text style={styles.termsText}>Concordo com os termos de uso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.orText}>ou</Text>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já possui uma conta? </Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.loginLink}>Entrar</Text>
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
    paddingHorizontal: 22,
    paddingTop: 52,
  },
  backButton: {
    width: 30,
    marginBottom: 14,
  },
  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  input: {
    height: 46,
    borderRadius: 999,
    backgroundColor: "#D2D6DB",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1A1A1A",
  },
  passwordField: {
    height: 46,
    borderRadius: 999,
    backgroundColor: "#D2D6DB",
    paddingLeft: 16,
    paddingRight: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: "#5D6168",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: "#3552B2",
    borderColor: "#3552B2",
  },
  termsText: {
    fontSize: 12,
    color: "#2C2F35",
  },
  button: {
    marginTop: 8,
    height: 52,
    borderRadius: 999,
    backgroundColor: "#3552B2",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#111111",
    fontSize: 16.5,
    fontWeight: "800",
  },
  orText: {
    textAlign: "center",
    color: "#555A62",
    marginTop: 0,
    fontSize: 14,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#2C2F35",
    fontSize: 12.5,
  },
  loginLink: {
    color: "#3552B2",
    fontSize: 12.5,
    fontWeight: "700",
  },
});
