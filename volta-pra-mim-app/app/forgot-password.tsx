import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { requestPasswordReset, resetPassword } from "@/services/auth";

type Step = "request" | "reset";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>("request");
  const [login, setLogin] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRequestCode() {
    if (!login.trim()) {
      Alert.alert("Erro", "Informe seu RA ou email.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await requestPasswordReset(login.trim());
      setCode(response.code);
      setStep("reset");
      Alert.alert(
        "Código gerado",
        `Use o código ${response.code} para redefinir sua senha.`,
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Não foi possível gerar o código.";
      Alert.alert("Erro", message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!login.trim() || !code.trim() || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword({
        login: login.trim(),
        code: code.trim(),
        newPassword,
      });
      Alert.alert("Senha redefinida", "Você já pode entrar com a nova senha.", [
        { text: "Entrar", onPress: () => router.replace("/login") },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Não foi possível redefinir a senha.";
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
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </TouchableOpacity>

        <Text style={styles.title}>Redefinir senha</Text>
        <Text style={styles.subtitle}>
          Informe seu RA ou email para gerar um código de recuperação.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="RA ou email"
            placeholderTextColor="#7E858F"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            editable={step === "request"}
          />

          {step === "reset" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Código de 6 dígitos"
                placeholderTextColor="#7E858F"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />

              <View style={styles.passwordField}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Nova senha"
                  placeholderTextColor="#7E858F"
                  value={newPassword}
                  onChangeText={setNewPassword}
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

              <TextInput
                style={styles.input}
                placeholder="Confirmar nova senha"
                placeholderTextColor="#7E858F"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={step === "request" ? handleRequestCode : handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {step === "request" ? "Gerar código" : "Salvar nova senha"}
              </Text>
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
    paddingHorizontal: 24,
    paddingTop: 54,
  },
  backButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    marginBottom: 28,
  },
  title: {
    color: "#111111",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#5C616B",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
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
