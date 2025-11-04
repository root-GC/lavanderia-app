import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Perfil() {
  const user = {
    nome: "João Silva",
    email: "joao@exemplo.com",
    telefone: "+258 84 123 4567",
    imagem: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  };

  return (
<SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Image source={{ uri: user.imagem }} style={styles.avatar} />
      <Text style={styles.nome}>{user.nome}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.telefone}>{user.telefone}</Text>

      <TouchableOpacity style={styles.logout}>
        <Text style={styles.logoutText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </View>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
   safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  nome: { fontSize: 22, fontWeight: "bold" },
  email: { fontSize: 16, color: "#666" },
  telefone: { fontSize: 16, color: "#666", marginBottom: 20 },
  logout: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 10 },
  logoutText: { color: "#fff", fontWeight: "600" },
});