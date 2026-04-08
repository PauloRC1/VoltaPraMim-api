import { useMemo, useState } from "react";
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

type InstitutionalAccount = {
  ra: string;
  name: string;
  email: string;
  phone: string;
};

const institutionalAccounts: InstitutionalAccount[] = [
  {
    ra: "24011434",
    name: "Marcinho Branco",
    email: "marcinho.nbrc@universidade.edu",
    phone: "(11) 99876-5432",
  },
  {
    ra: "24011888",
    name: "Beatriz Araujo",
    email: "beatriz.araujo@universidade.edu",
    phone: "(11) 99112-3344",
  },
  {
    ra: "24012001",
    name: "Lucas Ferreira",
    email: "lucas.ferreira@universidade.edu",
    phone: "(11) 98765-1030",
  },
];

type Step = "lookup" | "found" | "password";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(0, 3);
  return `${visible}${"*".repeat(Math.max(user.length - 3, 2))}@${domain}`;
}

export default function RegisterScreen() {
  const [step, setStep] = useState<Step>("lookup");
  const [ra, setRa] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [foundAccount, setFoundAccount] = useState<InstitutionalAccount | null>(
    null,
  );

  const normalizedRa = useMemo(() => ra.trim(), [ra]);

  function handleLookup() {
    if (!normalizedRa) {
      Alert.alert("Erro", "Informe seu RA para localizar a conta.");
      return;
    }

    const account = institutionalAccounts.find(
      (currentAccount) => currentAccount.ra === normalizedRa,
    );

    if (!account) {
      Alert.alert(
        "Conta nao encontrada",
        "Nao localizamos um cadastro institucional com esse RA. Verifique o numero e tente novamente.",
      );
      return;
    }

    setFoundAccount(account);
    setStep("found");
  }

  async function handleActivateAccount() {
    const normalizedPassword = password.trim();
    const normalizedConfirmPassword = confirmPassword.trim();

    if (!normalizedPassword || !normalizedConfirmPassword) {
      Alert.alert("Erro", "Preencha os campos de senha.");
      return;
    }

    if (normalizedPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter no minimo 6 caracteres.");
      return;
    }

    if (normalizedPassword !== normalizedConfirmPassword) {
      Alert.alert("Erro", "As senhas nao coincidem.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Erro", "Voce precisa aceitar os termos de uso.");
      return;
    }

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 900));

      Alert.alert(
        "Conta ativada",
        "Sua conta institucional foi encontrada e ativada com sucesso. Agora voce ja pode fazer login.",
        [
          {
            text: "Entrar",
            onPress: () => router.replace("/login"),
          },
        ],
      );
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
          onPress={() => (step === "lookup" ? router.back() : setStep("lookup"))}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </TouchableOpacity>

        <Text style={styles.title}>Primeiro acesso</Text>
        <Text style={styles.subtitle}>
          Localize sua conta institucional pelo RA e crie a senha para ativar o
          acesso.
        </Text>

        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View
            style={[
              styles.stepLine,
              step !== "lookup" && styles.stepLineActive,
            ]}
          />
          <View
            style={[
              styles.stepDot,
              step !== "lookup" && styles.stepDotActive,
            ]}
          />
          <View
            style={[
              styles.stepLine,
              step === "password" && styles.stepLineActive,
            ]}
          />
          <View
            style={[
              styles.stepDot,
              step === "password" && styles.stepDotActive,
            ]}
          />
        </View>

        {step === "lookup" ? (
          <View style={styles.form}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Informe seu RA</Text>
              <Text style={styles.infoText}>
                Se sua conta ja estiver cadastrada pela faculdade, vamos localizar
                seus dados e liberar a criacao da senha.
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="RA"
              placeholderTextColor="#6E737B"
              value={ra}
              onChangeText={setRa}
              autoCapitalize="none"
              keyboardType="number-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleLookup}>
              <Text style={styles.buttonText}>Localizar conta</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {step === "found" && foundAccount ? (
          <View style={styles.form}>
            <View style={styles.foundCard}>
              <View style={styles.foundIcon}>
                <Ionicons name="checkmark-circle" size={28} color="#12B76A" />
              </View>

              <Text style={styles.foundTitle}>Conta encontrada</Text>
              <Text style={styles.foundDescription}>
                Localizamos seu cadastro institucional. Confira os dados e
                continue para criar sua senha.
              </Text>

              <View style={styles.accountMeta}>
                <Text style={styles.accountMetaLabel}>Nome</Text>
                <Text style={styles.accountMetaValue}>{foundAccount.name}</Text>
              </View>

              <View style={styles.accountMeta}>
                <Text style={styles.accountMetaLabel}>RA</Text>
                <Text style={styles.accountMetaValue}>{foundAccount.ra}</Text>
              </View>

              <View style={styles.accountMeta}>
                <Text style={styles.accountMetaLabel}>Email</Text>
                <Text style={styles.accountMetaValue}>
                  {maskEmail(foundAccount.email)}
                </Text>
              </View>

              <View style={styles.accountMeta}>
                <Text style={styles.accountMetaLabel}>Telefone</Text>
                <Text style={styles.accountMetaValue}>{foundAccount.phone}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep("password")}
            >
              <Text style={styles.buttonText}>Criar senha</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {step === "password" && foundAccount ? (
          <View style={styles.form}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Crie sua senha</Text>
              <Text style={styles.infoText}>
                Sua conta foi localizada para {foundAccount.name}. Agora defina
                uma senha para concluir o primeiro acesso.
              </Text>
            </View>

            <View style={styles.passwordField}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Nova senha"
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
              placeholder="Confirmar nova senha"
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
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxActive,
                ]}
              >
                {acceptedTerms ? (
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                ) : null}
              </View>
              <Text style={styles.termsText}>Concordo com os termos de uso</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleActivateAccount}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Ativar conta</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.orText}>ou</Text>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Ja ativou sua conta? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.loginLink}>Entrar</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#5B6068",
    marginBottom: 18,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#CFD4DD",
  },
  stepDotActive: {
    backgroundColor: "#3552B2",
  },
  stepLine: {
    flex: 1,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#CFD4DD",
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: "#3552B2",
  },
  form: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: "#E9EFFD",
    borderRadius: 18,
    padding: 16,
  },
  infoTitle: {
    color: "#1A2B59",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  infoText: {
    color: "#44516E",
    fontSize: 13,
    lineHeight: 20,
  },
  foundCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
  },
  foundIcon: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: "#ECFDF3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  foundTitle: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  foundDescription: {
    color: "#5B6068",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  accountMeta: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF1F5",
  },
  accountMetaLabel: {
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 4,
  },
  accountMetaValue: {
    color: "#151515",
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    height: 48,
    borderRadius: 999,
    backgroundColor: "#D2D6DB",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1A1A1A",
  },
  passwordField: {
    height: 48,
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
    color: "#FFFFFF",
    fontSize: 16.5,
    fontWeight: "800",
  },
  orText: {
    textAlign: "center",
    color: "#555A62",
    marginTop: 18,
    fontSize: 14,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
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
