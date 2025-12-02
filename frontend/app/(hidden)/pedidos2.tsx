import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import api from '../../api/userApi';

interface Pedido {
  id: number;
  imagem_original: string;
  tipo: string;
  servicos_adicionais: string[];
  peso: number;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
  created_at: string;
}

export default function Pedidos2() {
  const route = useRoute();
  const { pedidoId } = route.params as { pedidoId: number };

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados do pedido ao abrir
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await api.get(`/pedidos/${pedidoId}`);
        setPedido(response.data);
      } catch (error) {
        console.log("Erro ao buscar pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [pedidoId]);

  if (loading || !pedido) return <Text>Carregando...</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>ID: {pedido.id}</Text>
      <TextInput
        value={pedido.tipo}
        onChangeText={(text) => setPedido(prev => prev ? { ...prev, tipo: text } : prev)}
        placeholder="Tipo do pedido"
      />
      <TextInput
        value={pedido.peso.toString()}
        onChangeText={(text) =>
          setPedido(prev => prev ? { ...prev, peso: Number(text) } : prev)
        }
        placeholder="Peso"
        keyboardType="numeric"
      />
      {/* Aqui adicionas os outros campos do pedido que queres editar */}
      <Button title="Salvar" onPress={() => console.log("Salvar pedido")}/>
    </View>
  );
}
