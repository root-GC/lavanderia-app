import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://192.168.0.10:8000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        router.replace("/(registo)/login");
      } else {
        Alert.alert("Erro", data.message || "Falha ao criar conta!");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Senha" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{loading ? "A criar conta..." : "Registar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(registo)/login")}>
          <Text style={styles.linkText}>Já tens conta? Fazer login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 32, color: "#1E40AF", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#CBD5E1", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 16, backgroundColor: "#F8FAFC" },
  button: { backgroundColor: "#1E40AF", paddingVertical: 14, borderRadius: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "600" },
  linkText: { color: "#1E40AF", textAlign: "center", fontSize: 16, marginTop: 8 },
});