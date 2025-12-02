import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { atualizarPedido, criarPedido, fetchPedidoPorId } from "../api/userApi";
import ImagePickerComponent from "../components/componentes/ImagePicker";
import ServiceSelector from "../components/componentes/ServiceSelector";

type RootStackParamList = {
  pedidos: { pedidoId?: number }; // pedidoId opcional: se existir, é edição
};

type PedidosRouteProp = RouteProp<RootStackParamList, 'pedidos'>;

export default function Pedidos() {
  const router = useRouter();

  // --- Estados do formulário ---
  const [tipo, setTipo] = useState<"normal" | "delicada" | "seco">("normal");
  const [secagem, setSecagem] = useState(false);
  const [passagem, setPassagem] = useState(false);
  const [perfumaria, setPerfumaria] = useState(false);
  const [imagemRoupa, setImagemRoupa] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [loadingPedido, setLoadingPedido] = useState(false);

  // --- Rota e parâmetros ---
  const route = useRoute<PedidosRouteProp>();
  const { pedidoId } = route.params ?? {};

  // --- Determina se estamos em edição ---
  const isEdit = !!pedidoId;

  // --- Título dinâmico ---
  const titulo = isEdit ? "Editar Pedido" : "Novo Pedido";

  // --- Carregar dados do pedido se estiver em edição ---
  useEffect(() => {
    const loadPedido = async () => {
      if (!isEdit) return;

      setLoadingPedido(true);
      try {
        const data = await fetchPedidoPorId(pedidoId!); // API retorna { pedidos: [...] }
        const pedido = data.pedidos.find((p: any) => p.id === pedidoId);

        if (!pedido) {
          Alert.alert("Erro", "Pedido não encontrado.");
          return;
        }

        console.log("📌 Dados recebidos da API para edição:", pedido);

        const servicos = Array.isArray(pedido.servicos_adicionais) ? pedido.servicos_adicionais : [];
        const imagem = pedido.imagem_original ?? null;
        const tipoPedido: "normal" | "delicada" | "seco" = pedido.tipo ?? "normal";

        setTipo(tipoPedido);
        setSecagem(servicos.includes("Secagem"));
        setPassagem(servicos.includes("Passagem"));
        setPerfumaria(servicos.includes("Perfumaria"));
        setImagemRoupa(imagem);

      } catch (err) {
        console.error("Erro ao carregar pedido:", err);
        Alert.alert("Erro", "Não foi possível carregar os dados do pedido.");
      } finally {
        setLoadingPedido(false);
      }
    };

    loadPedido();
  }, [isEdit, pedidoId]);

// --- Enviar ou atualizar pedido ---
const handleEnviarPedido = async () => {
  if (!imagemRoupa) {
    Alert.alert("Erro", "Por favor, selecione uma imagem do pedido.");
    return;
  }

  setEnviando(true);

  try {
    const servicos = [
      secagem && "Secagem",
      passagem && "Passagem",
      perfumaria && "Perfumaria",
    ].filter(Boolean) as string[];

    const formData = new FormData();
    formData.append("imagem", {
      uri: imagemRoupa,
      type: "image/jpeg",
      name: "pedido.jpg",
    } as any);

    formData.append("tipo", tipo);
    formData.append("imagem_local", imagemRoupa); // adiciona URI local

    servicos.forEach((s, i) => formData.append(`servicos_adicionais[${i}]`, s));

    if (isEdit) {
      // Atualizar pedido existente (PUT no backend)
      await atualizarPedido(pedidoId!, formData);
      Alert.alert("Pedido Atualizado", "O pedido foi atualizado com sucesso.");
    } else {
      // Criar novo pedido
      await criarPedido(formData);
      Alert.alert("Pedido Criado", "O pedido foi enviado com sucesso.");
    }

  } catch (err) {
    console.error("Erro ao enviar pedido", err);
    Alert.alert("Erro", "Não foi possível enviar o pedido.");
  } finally {
    setEnviando(false);
  }
};


/*
  // --- Enviar ou atualizar pedido ---
  const handleEnviarPedido = async () => {
    if (!imagemRoupa) {
      Alert.alert("Erro", "Por favor, selecione uma imagem do pedido.");
      return;
    }

    setEnviando(true);

    try {
      const servicos = [
        secagem && "Secagem",
        passagem && "Passagem",
        perfumaria && "Perfumaria",
      ].filter(Boolean) as string[];

      const formData = new FormData();
      formData.append("imagem", {
        uri: imagemRoupa,
        type: "image/jpeg",
        name: "pedido.jpg",
      } as any);
      formData.append("tipo", tipo);
      servicos.forEach((s, i) => formData.append(`servicos_adicionais[${i}]`, s));

      if (isEdit) {
        await atualizarPedido(pedidoId!, formData);
        Alert.alert("Pedido Atualizado", "O pedido foi atualizado com sucesso.");
      } else {
        await criarPedido(formData);
        Alert.alert("Pedido Criado", "O pedido foi enviado com sucesso.");
      }

    } catch (err) {
      console.error("Erro ao enviar pedido", err);
      Alert.alert("Erro", "Não foi possível enviar o pedido.");
    } finally {
      setEnviando(false);
    }
  };
*/
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#F8FBFF", "#E8F4FF", "#FFFFFF"]} style={styles.gradientBackground}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

            {/* --- Header --- */}
            <View style={styles.header}>
              <LinearGradient colors={["#007AFF", "#0056CC"]} style={styles.headerGradient}>

                {/* Botão Voltar só aparece em edição */}
                {isEdit && (
                  <TouchableOpacity
                    style={styles.voltarButton}
                    onPress={() => router.back()}
                  >
                    <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.voltarText}>Voltar</Text>
                  </TouchableOpacity>
                )}

                <Ionicons name="shirt-outline" size={32} color="#FFFFFF" />
                <Text style={styles.title}>{titulo}</Text>
                <Text style={styles.subtitle}>Tire uma foto e envie — nós tratamos do resto.</Text>
              </LinearGradient>
            </View>

            <View style={styles.formContainer}>
              {/* Foto das roupas */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="camera-outline" size={20} color="#007AFF" /> Foto das Roupas
                </Text>
                <ImagePickerComponent imageUri={imagemRoupa} setImageUri={setImagemRoupa} />
              </View>

              {/* Tipo de lavagem */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="options-outline" size={20} color="#007AFF" /> Tipo de Lavagem
                </Text>
                <ServiceSelector tipo={tipo} setTipo={setTipo} />
              </View>

              {/* Serviços adicionais */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="sparkles-outline" size={20} color="#007AFF" /> Serviços Adicionais
                </Text>
                <View style={styles.servicosContainer}>
                  {(
                    [
                      ["Secagem", secagem, setSecagem, "water-outline"],
                      ["Passagem", passagem, setPassagem, "flame-outline"],
                      ["Perfumaria", perfumaria, setPerfumaria, "flower-outline"],
                    ] as [string, boolean, React.Dispatch<React.SetStateAction<boolean>>, string][]
                  ).map(([label, value, setter, icon]) => (
                    <TouchableOpacity
                      key={label}
                      style={[styles.serviceButton, value && styles.serviceButtonAtivo]}
                      onPress={() => setter(!value)}
                    >
                      <View style={styles.serviceIconContainer}>
                        <Ionicons name={icon as any} size={20} color={value ? "#FFFFFF" : "#007AFF"} />
                      </View>
                      <Text style={[styles.serviceButtonText, value && styles.serviceButtonTextAtivo]}>{label}</Text>
                      <View style={[styles.checkbox, value && styles.checkboxAtivo]}>
                        {value && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Botão enviar/atualizar */}
              <TouchableOpacity
                style={styles.gerarButton}
                onPress={handleEnviarPedido}
                disabled={enviando}
              >
                <LinearGradient colors={["#007AFF", "#0056CC"]} style={styles.gerarButtonGradient}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.gerarButtonText}>
                    {enviando ? "Enviando..." : isEdit ? "Atualizar Pedido" : "Enviar Pedido"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradientBackground: { flex: 1 },
  scrollContainer: { padding: 16 },
  header: { marginBottom: 12 },
  headerGradient: { padding: 16, borderRadius: 12, alignItems: 'center', gap: 6, position: 'relative' },
  voltarButton: { position: 'absolute', left: 12, top: 16, flexDirection: 'row', alignItems: 'center', gap: 4 },
  voltarText: { color: '#fff', fontWeight: '600' },
  title: { color: "#fff", fontSize: 18, fontWeight: '700' },
  subtitle: { color: "#fff", fontSize: 12 },
  formContainer: {},
  card: { marginBottom: 12, padding: 12, backgroundColor: "#fff", borderRadius: 8 },
  cardTitle: { fontWeight: '600', marginBottom: 8 },
  servicosContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  serviceButton: { flex: 1, padding: 8, margin: 4, borderRadius: 8, borderWidth: 1, borderColor: '#E6F0FF', alignItems: 'center', flexDirection: 'row' },
  serviceButtonAtivo: { backgroundColor: '#007AFF' },
  serviceIconContainer: { marginRight: 8 },
  serviceButtonText: {},
  serviceButtonTextAtivo: { color: '#fff' },
  checkbox: { marginLeft: 'auto' },
  checkboxAtivo: { backgroundColor: '#0056CC', padding: 4, borderRadius: 4 },
  gerarButton: { marginTop: 8 },
  gerarButtonGradient: { padding: 12, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  gerarButtonText: { color: '#fff', fontWeight: '700' },
});
