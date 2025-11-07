import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser } from "../../api/userApi"; // ajusta o caminho conforme tua pasta

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!email || !senha) return Alert.alert("Erro", "Preenche todos os campos.");

  try {
    setLoading(true);
    const { token, user } = await loginUser({ email, password: senha });

    if (token) {
      await AsyncStorage.setItem("token", token);
      router.replace("/(menu)/pedidos");
    } else {
      Alert.alert("Erro", "Token não recebido do servidor.");
    }
  } catch (error: any) {
    Alert.alert("Erro", error.response?.data?.message || "Falha no login.");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Entrar</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "A entrar..." : "Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(registo)/signup")}>
          <Text style={styles.linkText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 32, color: "#1E40AF", textAlign: "center" },
  input: {
    borderWidth: 1, borderColor: "#CBD5E1",
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12, marginBottom: 16, backgroundColor: "#F8FAFC",
  },
  button: {
    backgroundColor: "#1E40AF", paddingVertical: 14, borderRadius: 16,
    marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "600" },
  linkText: { color: "#2f5ae7ff", textAlign: "center", fontSize: 16, marginTop: 8 },
});