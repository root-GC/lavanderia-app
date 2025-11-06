import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api, { logoutUser } from "../../api/userApi"; // Axios configurado com interceptor

export default function Perfil() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user"); // token já é enviado pelo interceptor
        setUser(response.data);
      } catch (error: any) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar os dados do utilizador.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha ao terminar sessão.");
    }
  };

  if (loading) return <Text style={styles.loading}>Carregando...</Text>;
  if (!user) return <Text style={styles.loading}>Utilizador não encontrado.</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{ uri: user.imagem || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
          style={styles.avatar}
        />
        <Text style={styles.nome}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.telefone}>{user.telefone || ""}</Text>

        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Terminar Sessão</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  nome: { fontSize: 22, fontWeight: "bold" },
  email: { fontSize: 16, color: "#666" },
  telefone: { fontSize: 16, color: "#666", marginBottom: 20 },
  logout: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 10 },
  logoutText: { color: "#fff", fontWeight: "600" },
  loading: { flex: 1, textAlign: "center", marginTop: 50, fontSize: 16, color: "#333" },
});