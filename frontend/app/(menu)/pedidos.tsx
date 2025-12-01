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
  const [imagemRoupa, setImagemRoupa] = useState<string | null>(null); // Base64
  const [enviando, setEnviando] = useState(false);

//   const handleEnviarPedido = async () => {
//   if (!imagemRoupa) {
//     Alert.alert("Erro", "Por favor, selecione uma imagem do pedido.");
//     return;
//   }

//   setEnviando(true);

//   try {
//     const servicos = [
//       secagem && "Secagem",
//       passagem && "Passagem",
//       perfumaria && "Perfumaria",
//     ].filter(Boolean) as string[];

//     // Identificar o tipo MIME com base na extensão
//     const getMimeType = (uri: string) => {
//       if (uri.endsWith('.png')) return 'image/png';
//       if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
//       return 'image/jpeg'; // fallback
//     };

//     // Obter o nome do ficheiro a partir do URI
//     const getFileName = (uri: string) => {
//       const parts = uri.split('/');
//       return parts[parts.length - 1] || 'pedido.jpg';
//     };

//     // Preparar FormData
//    const formData = new FormData();
//   formData.append('imagem', {
//     uri: imagemRoupa,
//     type: getMimeType(imagemRoupa),
//     name: getFileName(imagemRoupa),
//   } as any);
//   formData.append('tipo', tipo);
//   formData.append('imagem_local', imagemRoupa); // URI original do dispositivo
  

//   servicos.forEach((servico, idx) => {
//     formData.append(`servicos_adicionais[${idx}]`, servico);
//   });

//   await criarPedido(formData);

//     Alert.alert("Pedido Enviado", "O seu pedido foi enviado. Aguardando avaliação.");

//     // Reset minimal
//     setImagemRoupa(null);
//     setSecagem(false);
//     setPassagem(false);
//     setPerfumaria(false);
//     setTipo("normal");

//   } catch (err) {
//     console.error("Erro ao enviar pedido", err);
//     Alert.alert("Erro", "Não foi possível enviar o pedido.");
//   } finally {
//     setEnviando(false);
//   }
// };
const handleEnviarPedido = async () => {
  if (!imagemRoupa) {
    Alert.alert("Erro", "Por favor, selecione uma imagem do pedido.");
    return;
  }

  setEnviando(true);

  try {
    // Serviços selecionados
    const servicos = [
      secagem && "Secagem",
      passagem && "Passagem",
      perfumaria && "Perfumaria",
    ].filter(Boolean) as string[];

    // Tipo MIME baseado na extensão
    const getMimeType = (uri: string) => {
      if (uri.endsWith('.png')) return 'image/png';
      if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
      return 'image/jpeg'; // fallback
    };

    // Nome do ficheiro a partir do URI
    const getFileName = (uri: string) => {
      const parts = uri.split('/');
      return parts[parts.length - 1] || 'pedido.jpg';
    };

    // Preparar FormData
    const formData = new FormData();

    // Anexar imagem para upload
    formData.append('imagem', {
      uri: imagemRoupa,
      type: getMimeType(imagemRoupa),
      name: getFileName(imagemRoupa),
    } as any);

    // DEBUG: ver a URI antes de enviar
    console.log("📌 URI da imagem local:", imagemRoupa);

    // Enviar URI original do dispositivo também
    formData.append('imagem_local', imagemRoupa);

    // Tipo do pedido
    formData.append('tipo', tipo);

    // Serviços adicionais
    servicos.forEach((servico, idx) => {
      formData.append(`servicos_adicionais[${idx}]`, servico);
    });

    // Chamar API para criar pedido
    await criarPedido(formData);

    Alert.alert("Pedido Enviado", "O seu pedido foi enviado. Aguardando avaliação.");

    // Reset minimal
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
          style={{ flex: 1 }}
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
  /* mantém os styles originais (omitidos aqui por brevidade) */
  safeArea: { flex: 1 },
  gradientBackground: { flex: 1 },
  scrollContainer: { padding: 16 },
  header: { marginBottom: 12 },
  headerGradient: { padding: 16, borderRadius: 12, alignItems: 'center', gap: 6 },
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
