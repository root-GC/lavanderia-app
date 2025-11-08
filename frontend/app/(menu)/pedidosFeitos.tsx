import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api, { getUser } from "../../api/userApi";

interface Pedido {
  id: number;
  imagem: string;
  tipo: string;
  servicos_adicionais: string[];
  peso: number;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
  created_at: string;
}

export default function PedidosFeitos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const user = await getUser();
      const response = await api.get(`/pedidos?user_id=${user.id}`);
      setPedidos(response.data.pedidos || []);
    } catch (error) {
      console.log("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPedidos();
    }, [])
  );

  const deletePedido = async (id: number) => {
    // Implementa confirmação antes de apagar
    setPedidos((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.delete(`/pedidos/${id}`);
    } catch (error) {
      console.log("Erro ao apagar pedido:", error);
    }
  };

  const openModal = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Pedido }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>Tipo: {item.tipo}</Text>
        <Text>Serviços: {item.servicos_adicionais?.join(", ")}</Text>
        <Text>Peso: {item.peso} kg</Text>
        <Text>Total: {item.total} MT</Text>
        <Text>Status: {item.estado}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.viewButton} onPress={() => openModal(item)}>
            <Text style={styles.btnText}>Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => deletePedido(item.id)}>
            <Text style={styles.btnText}>Apagar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Pedidos Feitos</Text>
        {pedidos.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum pedido encontrado.</Text>
        ) : (
          <FlatList
            data={pedidos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Modal para detalhes */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedPedido &&
                Object.entries(selectedPedido).map(([key, value]) => (
                  <View key={key} style={styles.rowDetail}>
                    <Text style={styles.key}>{key}:</Text>
                    <Text style={styles.value}>{Array.isArray(value) ? value.join(", ") : value}</Text>
                  </View>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  card: { flexDirection: "row", marginBottom: 15, backgroundColor: "#f1f5f9", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#ddd" },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontWeight: "bold", marginBottom: 3 },
  row: { flexDirection: "row", marginTop: 8 },
  viewButton: { flex: 1, backgroundColor: "#007AFF", padding: 8, borderRadius: 8, alignItems: "center", marginRight: 5 },
  cancelButton: { flex: 1, backgroundColor: "#FF3B30", padding: 8, borderRadius: 8, alignItems: "center", marginLeft: 5 },
  btnText: { color: "#fff", fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#fff", borderRadius: 12, padding: 20, maxHeight: "80%" },
  rowDetail: { flexDirection: "row", marginBottom: 8, flexWrap: "wrap" },
  key: { fontWeight: "bold", marginRight: 5 },
  value: { flexShrink: 1 },
  closeButton: { backgroundColor: "#007AFF", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
});