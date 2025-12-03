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
  pedidos: { pedidoId?: number };
};

type PedidosRouteProp = RouteProp<RootStackParamList, 'pedidos'>;

export default function Pedidos() {
  const router = useRouter();
  const [tipo, setTipo] = useState<"normal" | "delicada" | "seco">("normal");
  const [secagem, setSecagem] = useState(false);
  const [passagem, setPassagem] = useState(false);
  const [perfumaria, setPerfumaria] = useState(false);
  const [imagemRoupa, setImagemRoupa] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [loadingPedido, setLoadingPedido] = useState(false);

  const route = useRoute<PedidosRouteProp>();
  const { pedidoId } = route.params ?? {};
  const isEdit = !!pedidoId;
  const titulo = isEdit ? "Editar Pedido" : "Novo Pedido";

  useEffect(() => {
    const loadPedido = async () => {
      if (!isEdit) return;

      setLoadingPedido(true);
      try {
        const data = await fetchPedidoPorId(pedidoId!);
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
      formData.append("imagem_local", imagemRoupa);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#F8FBFF", "#E8F4FF", "#FFFFFF"]} style={styles.gradientBackground}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <LinearGradient colors={["#007AFF", "#0056CC"]} style={styles.headerGradient}>
                
                {isEdit && (
                  <TouchableOpacity style={styles.voltarButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.voltarText}>Voltar</Text>
                  </TouchableOpacity>
                )}

                <Ionicons name="shirt-outline" size={28} color="#FFFFFF" />
                <Text style={styles.title}>{titulo}</Text>
                <Text style={styles.subtitle}>Tire uma foto e envie — nós tratamos do resto.</Text>
              </LinearGradient>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="camera-outline" size={18} color="#007AFF" /> Foto das Roupas
                </Text>
                <ImagePickerComponent imageUri={imagemRoupa} setImageUri={setImagemRoupa} />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="options-outline" size={18} color="#007AFF" /> Tipo de Lavagem
                </Text>
                <ServiceSelector tipo={tipo} setTipo={setTipo} />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="sparkles-outline" size={18} color="#007AFF" /> Serviços Adicionais
                </Text>
                
                <View style={styles.servicosContainer}>
                  {[
                    { label: "Secagem", value: secagem, setter: setSecagem, icon: "water-outline" },
                    { label: "Passagem", value: passagem, setter: setPassagem, icon: "flame-outline" },
                    { label: "Perfumaria", value: perfumaria, setter: setPerfumaria, icon: "flower-outline" },
                  ].map((service) => (
                    <TouchableOpacity
                      key={service.label}
                      style={[styles.serviceButton, service.value && styles.serviceButtonAtivo]}
                      onPress={() => service.setter(!service.value)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.serviceContent}>
                        <View style={[styles.serviceIconContainer, service.value && styles.serviceIconContainerAtivo]}>
                          <Ionicons 
                            name={service.icon as any} 
                            size={18} 
                            color={service.value ? "#FFFFFF" : "#007AFF"} 
                          />
                        </View>
                        <Text style={[styles.serviceButtonText, service.value && styles.serviceButtonTextAtivo]}>
                          {service.label}
                        </Text>
                      </View>
                      <View style={[styles.checkbox, service.value && styles.checkboxAtivo]}>
                        {service.value && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.gerarButton}
                onPress={handleEnviarPedido}
                disabled={enviando}
              >
                <LinearGradient colors={["#007AFF", "#0056CC"]} style={styles.gerarButtonGradient}>
                  <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
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
  safeArea: { 
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  gradientBackground: { 
    flex: 1 
  },
  keyboardAvoidingView: { 
    flex: 1 
  },
  scrollContainer: { 
    padding: 16,
    paddingBottom: 30
  },
  header: { 
    marginBottom: 16 
  },
  headerGradient: { 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    position: 'relative',
    minHeight: 120
  },
  voltarButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  voltarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  title: { 
    color: "#fff", 
    fontSize: 22, 
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center'
  },
  subtitle: { 
    color: "rgba(255,255,255,0.9)", 
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4
  },
  formContainer: {
    flex: 1
  },
  card: { 
    marginBottom: 16, 
    padding: 20, 
    backgroundColor: "#fff", 
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: { 
    fontWeight: '600', 
    marginBottom: 12,
    fontSize: 18,
    color: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  servicosContainer: { 
    gap: 12
  },
  serviceButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e6e6e6',
    backgroundColor: '#fafafa'
  },
  serviceButtonAtivo: { 
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  serviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  serviceIconContainerAtivo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  serviceButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1
  },
  serviceButtonTextAtivo: { 
    color: '#fff',
    fontWeight: '600'
  },
  checkbox: { 
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  checkboxAtivo: { 
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF'
  },
  gerarButton: { 
    marginTop: 24,
    marginBottom: 20
  },
  gerarButtonGradient: { 
    padding: 16, 
    borderRadius: 14, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10 
  },
  gerarButtonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16
  },
});