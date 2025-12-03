import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
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
import { criarPedido } from "../../api/userApi";
import ImagePickerComponent from "../../components/componentes/ImagePicker";
import ServiceSelector from "../../components/componentes/ServiceSelector";

export default function Pedidos() {
  const [tipo, setTipo] = useState<"normal" | "delicada" | "seco">("normal");
  const [secagem, setSecagem] = useState(false);
  const [passagem, setPassagem] = useState(false);
  const [perfumaria, setPerfumaria] = useState(false);
  const [imagemRoupa, setImagemRoupa] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

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

      const getMimeType = (uri: string) => {
        if (uri.endsWith('.png')) return 'image/png';
        if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/jpeg';
      };

      const getFileName = (uri: string) => {
        const parts = uri.split('/');
        return parts[parts.length - 1] || 'pedido.jpg';
      };

      const formData = new FormData();
      formData.append('imagem', {
        uri: imagemRoupa,
        type: getMimeType(imagemRoupa),
        name: getFileName(imagemRoupa),
      } as any);
      formData.append('imagem_local', imagemRoupa);
      formData.append('tipo', tipo);

      servicos.forEach((servico, idx) => {
        formData.append(`servicos_adicionais[${idx}]`, servico);
      });

      await criarPedido(formData);

      Alert.alert("Pedido Enviado", "O seu pedido foi enviado. Aguardando avaliação.");

      setImagemRoupa(null);
      setSecagem(false);
      setPassagem(false);
      setPerfumaria(false);
      setTipo("normal");
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
                <Ionicons name="shirt-outline" size={32} color="#FFFFFF" />
                <Text style={styles.title}>Novo Pedido</Text>
                <Text style={styles.subtitle}>Tire uma foto e envie — nós tratamos do resto.</Text>
              </LinearGradient>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="camera-outline" size={20} color="#007AFF" /> Foto das Roupas
                </Text>
                <ImagePickerComponent imageUri={imagemRoupa} setImageUri={setImagemRoupa} />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="options-outline" size={20} color="#007AFF" /> Tipo de Lavagem
                </Text>
                <ServiceSelector tipo={tipo} setTipo={setTipo} />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  <Ionicons name="sparkles-outline" size={20} color="#007AFF" /> Serviços Adicionais
                </Text>
                <Text style={styles.cardSubtitle}>Selecione os serviços extras que deseja:</Text>
                
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
                            size={22} 
                            color={service.value ? "#FFFFFF" : "#007AFF"} 
                          />
                        </View>
                        <Text style={[styles.serviceButtonText, service.value && styles.serviceButtonTextAtivo]}>
                          {service.label}
                        </Text>
                      </View>
                      <View style={[styles.checkbox, service.value && styles.checkboxAtivo]}>
                        {service.value && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
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
                  <Ionicons name="cloud-upload-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.gerarButtonText}>{enviando ? "Enviando..." : "Enviar Pedido"}</Text>
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
    marginBottom: 20 
  },
  headerGradient: { 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    gap: 8 
  },
  title: { 
    color: "#fff", 
    fontSize: 22, 
    fontWeight: '700',
    marginTop: 4
  },
  subtitle: { 
    color: "rgba(255,255,255,0.9)", 
    fontSize: 14,
    textAlign: 'center'
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
    marginBottom: 8,
    fontSize: 18,
    color: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 24,
    height: 24,
    borderRadius: 12,
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
    padding: 18, 
    borderRadius: 14, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10 
  },
  gerarButtonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 17
  },
});