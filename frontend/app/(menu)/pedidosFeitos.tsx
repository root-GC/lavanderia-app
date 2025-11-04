import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const pedidos = [
  {
    id: "1",
    imagem: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
    nome: "Lavagem Rápida",
    status: "Concluído",
    total: "750 MT",
  },
];

export default function PedidosFeitos() {
  return (
<SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos Feitos</Text>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Total: {item.total}</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.btnText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
   safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: { flexDirection: "row", marginBottom: 15, backgroundColor: "#f9f9f9", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "#ccc" },
  image: { width: 60, height: 60, marginRight: 10 },
  name: { fontWeight: "bold" },
  row: { flexDirection: "row", marginTop: 5 },
  viewButton: { flex: 1, backgroundColor: "#007AFF", padding: 8, borderRadius: 8, alignItems: "center", marginRight: 5 },
  cancelButton: { flex: 1, backgroundColor: "#FF3B30", padding: 8, borderRadius: 8, alignItems: "center", marginLeft: 5 },
  btnText: { color: "#fff", fontWeight: "600" },
});