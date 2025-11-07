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
        const response = await api.get("/me"); // rota que retorna info do user logado
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
    const user = await getUser(); // pega o id do user logado

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
      estado: 'pendente'
    });

    Alert.alert("Pedido Confirmado", "O seu pedido foi registado!");
    setFactura(null);
    setPeso("");
    setSecagem(false);
    setPassagem(false);
    setPerfumaria(false);
    setImagemRoupa(null);

  } catch (error) {
    console.log('Erro ao enviar pedido:', error);
    Alert.alert("Erro", "Não foi possível registar o pedido.");
  }
};

  const handleRecusar = () => {
    setFactura(null);
    setImagemRoupa(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Novo Pedido</Text>

          {!factura ? (
            <>
              <ImagePickerComponent imageUri={imagemRoupa} setImageUri={setImagemRoupa} />

              <Text style={styles.label}>Peso das roupas (kg):</Text>
              <TextInput
                style={[styles.input, erroPeso && styles.inputErro]}
                keyboardType="numeric"
                placeholder="Ex: 12.5"
                value={peso}
                onChangeText={setPeso}
              />
              {erroPeso && <Text style={styles.mensagemErro}>Valor não válido</Text>}

              <ServiceSelector tipo={tipo} setTipo={setTipo} />

              <Text style={styles.label}>Serviços adicionais:</Text>
              <View style={styles.servicosContainer}>
                {(
                  [
                    ["Secagem", secagem, setSecagem],
                    ["Passagem", passagem, setPassagem],
                    ["Perfumaria", perfumaria, setPerfumaria],
                  ] as [string, boolean, React.Dispatch<React.SetStateAction<boolean>>][]
                ).map(([label, value, setter]) => (
                  <TouchableOpacity
                    key={label}
                    style={[styles.button, value && styles.buttonAtivo]}
                    onPress={() => setter(!value)}
                  >
                    <Text style={styles.buttonText}>
                      {`${label}: ${value ? "Sim" : "Não"}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.gerarButton} onPress={handleFactura}>
                <Text style={styles.gerarButtonText}>Gerar Factura</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.facturaBox}>
              <Text style={styles.facturaTitle}>🧾 Fatura do Pedido</Text>

              {factura.imagem && (
                <Image
                  source={{ uri: factura.imagem }}
                  style={styles.facturaImagem}
                />
              )}

              {/* Tipo de Lavagem */}
              <View style={styles.tagContainer}>
                <Text style={styles.tagLabel}>Tipo de Lavagem:</Text>
                <View style={[styles.tag, { backgroundColor: "#007AFF" }]}>
                  <Text style={styles.tagText}>{factura.tipo.toUpperCase()}</Text>
                </View>
              </View>

              {/* Serviços adicionais */}
              <View style={styles.tagContainer}>
                <Text style={styles.tagLabel}>Serviços Adicionais:</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
                  {secagem && (
                    <View style={[styles.tag, { backgroundColor: "#34C759" }]}>
                      <Text style={styles.tagText}>Secagem</Text>
                    </View>
                  )}
                  {passagem && (
                    <View style={[styles.tag, { backgroundColor: "#FF9500" }]}>
                      <Text style={styles.tagText}>Passagem</Text>
                    </View>
                  )}
                  {perfumaria && (
                    <View style={[styles.tag, { backgroundColor: "#FF3B30" }]}>
                      <Text style={styles.tagText}>Perfumaria</Text>
                    </View>
                  )}
                  {!secagem && !passagem && !perfumaria && (
                    <Text style={{ color: "#999" }}>Nenhum</Text>
                  )}
                </View>
              </View>

              {/* Valores */}
              <View style={styles.valoresContainer}>
                <Text style={styles.valorItem}>Peso: {factura.pesoNum} kg</Text>
                <Text style={styles.valorItem}>Subtotal: {factura.subtotal.toFixed(2)} MT</Text>
                <Text style={styles.valorItem}>IVA (16%): {factura.iva.toFixed(2)} MT</Text>
                <Text style={styles.total}>Total: {factura.total.toFixed(2)} MT</Text>
              </View>

              <View style={styles.row}>
                <TouchableOpacity style={[styles.button, styles.aceitar]} onPress={handleAceitar}>
                  <Text style={styles.buttonText}>Aceitar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.recusar]} onPress={handleRecusar}>
                  <Text style={styles.buttonText}>Recusar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f2f2" },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333", textAlign: "center" },
  label: { fontSize: 16, marginTop: 15, marginBottom: 5, color: "#555" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 12, backgroundColor: "#fff" },
  inputErro: { borderColor: "#FF3B30" },
  mensagemErro: { color: "#FF3B30", fontSize: 14, marginTop: 5 },
  servicosContainer: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 15 },
  button: { backgroundColor: "#007AFF", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, alignItems: "center", marginVertical: 5, minWidth: "30%" },
  buttonAtivo: { backgroundColor: "#34C759" },
  buttonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  gerarButton: { backgroundColor: "#FF9500", paddingVertical: 14, borderRadius: 14, alignItems: "center", marginTop: 20 },
  gerarButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  facturaBox: { backgroundColor: "#fff", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: 20 },
  facturaTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  facturaImagem: { width: "100%", height: 200, borderRadius: 12, marginBottom: 15 },
  tagContainer: { marginBottom: 10 },
  tagLabel: { fontSize: 16, color: "#555", marginBottom: 5 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  tagText: { color: "#fff", fontWeight: "600" },
  valoresContainer: { marginTop: 10 },
  valorItem: { fontSize: 16, marginBottom: 4, color: "#333" },
  total: { fontWeight: "bold", fontSize: 18, marginTop: 8, color: "#007AFF" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  aceitar: { backgroundColor: "#34C759", flex: 1, marginRight: 5 },
  recusar: { backgroundColor: "#FF3B30", flex: 1, marginLeft: 5 },
});