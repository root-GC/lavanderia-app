import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api, { criarPedido, getUser } from "../../api/userApi";
import ImagePickerComponent from "../../components/componentes/ImagePicker";
import ServiceSelector from "../../components/ServiceSelector";

export default function Pedidos() {
  const [peso, setPeso] = useState("");
  const [erroPeso, setErroPeso] = useState(false);
  const [tipo, setTipo] = useState("normal");
  const [secagem, setSecagem] = useState(false);
  const [passagem, setPassagem] = useState(false);
  const [perfumaria, setPerfumaria] = useState(false);
  const [factura, setFactura] = useState<any>(null);
  const [imagemRoupa, setImagemRoupa] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Puxa o user logado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/me");
        setUserId(response.data.id);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, []);

  const handleFactura = () => {
    if (!imagemRoupa) {
      Alert.alert("Erro", "Por favor, selecione uma imagem do pedido antes de gerar a fatura.");
      return;
    }

    const regexNumero = /^\d+(\.\d+)?$/;
    if (!regexNumero.test(peso) || parseFloat(peso) <= 0) {
      setErroPeso(true);
      Alert.alert("Erro", "Valor não válido");
      return;
    }

    setErroPeso(false);
    const pesoNum = parseFloat(peso);
    let precoKg = tipo === "normal" ? 50 : tipo === "delicada" ? 80 : 120;
    let subtotal = pesoNum * precoKg;
    const taxaExtras = (Number(secagem) + Number(passagem) + Number(perfumaria)) * 50;
    subtotal += taxaExtras;
    if (pesoNum > 20) subtotal *= 0.85;

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    setFactura({ pesoNum, tipo, subtotal, iva, total, imagem: imagemRoupa });
  };

  const handleAceitar = async () => {
    if (!factura || !imagemRoupa) return;

    try {
      const user = await getUser();

      const servicos = [
        secagem && 'Secagem',
        passagem && 'Passagem',
        perfumaria && 'Perfumaria'
      ].filter(Boolean) as string[];

      await criarPedido({
        user_id: user.id,
        imagem: imagemRoupa,
        servicos_adicionais: servicos,
        tipo: tipo,
        peso: parseFloat(peso),
        subtotal: factura.subtotal,
        iva: factura.iva,
        total: factura.total,
        estado: 'Pendente'
      });

      Alert.alert("✅ Pedido Confirmado", "O seu pedido foi registado com sucesso!");
      setFactura(null);
      setPeso("");
      setSecagem(false);
      setPassagem(false);
      setPerfumaria(false);
      setImagemRoupa(null);

    } catch (error) {
      console.log('Erro ao enviar pedido:', error);
      Alert.alert("❌ Erro", "Não foi possível registar o pedido.");
    }
  };

  const handleRecusar = () => {
    Alert.alert(
      "Cancelar Pedido",
      "Tem certeza que deseja cancelar este pedido?",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim", 
          onPress: () => {
            setFactura(null);
            setImagemRoupa(null);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#F8FBFF', '#E8F4FF', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <LinearGradient
                colors={['#007AFF', '#0056CC']}
                style={styles.headerGradient}
              >
                <Ionicons name="shirt-outline" size={32} color="#FFFFFF" />
                <Text style={styles.title}>Novo Pedido</Text>
                <Text style={styles.subtitle}>Faça seu pedido de lavagem</Text>
              </LinearGradient>
            </View>

            {!factura ? (
              <View style={styles.formContainer}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    <Ionicons name="camera-outline" size={20} color="#007AFF" />
                    {" "}Foto das Roupas
                  </Text>
                  <ImagePickerComponent imageUri={imagemRoupa} setImageUri={setImagemRoupa} />
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    <Ionicons name="scale-outline" size={20} color="#007AFF" />
                    {" "}Peso das Roupas
                  </Text>
                  <TextInput
                    style={[styles.input, erroPeso && styles.inputErro]}
                    keyboardType="numeric"
                    placeholder="Ex: 12.5 kg"
                    placeholderTextColor="#999"
                    value={peso}
                    onChangeText={setPeso}
                  />
                  {erroPeso && (
                    <View style={styles.erroContainer}>
                      <Ionicons name="warning-outline" size={16} color="#FF3B30" />
                      <Text style={styles.mensagemErro}>Valor não válido</Text>
                    </View>
                  )}
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    <Ionicons name="options-outline" size={20} color="#007AFF" />
                    {" "}Tipo de Lavagem
                  </Text>
                  <ServiceSelector tipo={tipo} setTipo={setTipo} />
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    <Ionicons name="sparkles-outline" size={20} color="#007AFF" />
                    {" "}Serviços Adicionais
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
                          <Ionicons 
                            name={icon as React.ComponentProps<typeof Ionicons>['name']} 
                            size={20} 
                            color={value ? "#FFFFFF" : "#007AFF"} 
                          />
                        </View>
                        <Text style={[styles.serviceButtonText, value && styles.serviceButtonTextAtivo]}>
                          {label}
                        </Text>
                        <View style={[styles.checkbox, value && styles.checkboxAtivo]}>
                          {value && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.gerarButton} onPress={handleFactura}>
                  <LinearGradient
                    colors={['#007AFF', '#0056CC']}
                    style={styles.gerarButtonGradient}
                  >
                    <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.gerarButtonText}>Gerar Factura</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.facturaContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8FBFF']}
                  style={styles.facturaBox}
                >
                  <View style={styles.facturaHeader}>
                    <Ionicons name="document-text" size={32} color="#007AFF" />
                    <Text style={styles.facturaTitle}>Fatura do Pedido</Text>
                  </View>

                  {factura.imagem && (
                    <Image
                      source={{ uri: factura.imagem }}
                      style={styles.facturaImagem}
                    />
                  )}

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Tipo de Lavagem</Text>
                      <View style={[styles.tag, { backgroundColor: "#007AFF" }]}>
                        <Text style={styles.tagText}>{factura.tipo.toUpperCase()}</Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Peso</Text>
                      <Text style={styles.detailValue}>{factura.pesoNum} kg</Text>
                    </View>
                  </View>

                  <View style={styles.servicosSection}>
                    <Text style={styles.sectionTitle}>Serviços Adicionais</Text>
                    <View style={styles.tagsContainer}>
                      {secagem && (
                        <View style={[styles.serviceTag, { backgroundColor: "#34C759" }]}>
                          <Ionicons name="water-outline" size={14} color="#FFFFFF" />
                          <Text style={styles.serviceTagText}>Secagem</Text>
                        </View>
                      )}
                      {passagem && (
                        <View style={[styles.serviceTag, { backgroundColor: "#FF9500" }]}>
                          <Ionicons name="flame-outline" size={14} color="#FFFFFF" />
                          <Text style={styles.serviceTagText}>Passagem</Text>
                        </View>
                      )}
                      {perfumaria && (
                        <View style={[styles.serviceTag, { backgroundColor: "#AF52DE" }]}>
                          <Ionicons name="flower-outline" size={14} color="#FFFFFF" />
                          <Text style={styles.serviceTagText}>Perfumaria</Text>
                        </View>
                      )}
                      {!secagem && !passagem && !perfumaria && (
                        <Text style={styles.noServicesText}>Nenhum serviço adicional</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.valoresContainer}>
                    <Text style={styles.sectionTitle}>Valores</Text>
                    <View style={styles.valorRow}>
                      <Text style={styles.valorLabel}>Subtotal</Text>
                      <Text style={styles.valorValue}>{factura.subtotal.toFixed(2)} MT</Text>
                    </View>
                    <View style={styles.valorRow}>
                      <Text style={styles.valorLabel}>IVA (16%)</Text>
                      <Text style={styles.valorValue}>{factura.iva.toFixed(2)} MT</Text>
                    </View>
                    <View style={[styles.valorRow, styles.totalRow]}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalValue}>{factura.total.toFixed(2)} MT</Text>
                    </View>
                  </View>

                  <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.recusarButton} onPress={handleRecusar}>
                      <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                      <Text style={styles.recusarButtonText}>Recusar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.aceitarButton} onPress={handleAceitar}>
                      <LinearGradient
                        colors={['#34C759', '#28A745']}
                        style={styles.aceitarButtonGradient}
                      >
                        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.aceitarButtonText}>Aceitar</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: { 
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#FFFFFF", 
    marginTop: 10,
    textAlign: "center" 
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    textAlign: "center"
  },
  formContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.1)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#E5E5EA", 
    borderRadius: 16, 
    padding: 16, 
    backgroundColor: "#F8F9FA",
    fontSize: 16,
    color: "#1C1C1E",
  },
  inputErro: { 
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  erroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  mensagemErro: { 
    color: "#FF3B30", 
    fontSize: 14, 
    marginLeft: 6,
    fontWeight: '500'
  },
  servicosContainer: { 
    marginTop: 10,
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  serviceButtonAtivo: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  serviceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  serviceButtonTextAtivo: {
    color: "#FFFFFF",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxAtivo: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  gerarButton: {
    marginTop: 10,
    borderRadius: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  gerarButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
  },
  gerarButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 18,
    marginLeft: 8,
  },
  facturaContainer: {
    padding: 20,
  },
  facturaBox: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.1)",
  },
  facturaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  facturaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginLeft: 10,
  },
  facturaImagem: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  servicosSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceTagText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 12,
    marginLeft: 4,
  },
  noServicesText: {
    color: "#8E8E93",
    fontStyle: 'italic',
  },
  valoresContainer: {
    marginBottom: 24,
  },
  valorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  valorLabel: {
    fontSize: 16,
    color: "#8E8E93",
  },
  valorValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  recusarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFF5F5",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FF3B30",
  },
  recusarButtonText: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  aceitarButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  aceitarButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  aceitarButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});