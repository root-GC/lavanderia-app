import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceSelector from "../../components/ServiceSelector";

export default function Pedidos() {
  const [peso, setPeso] = useState("");
  const [erroPeso, setErroPeso] = useState(false);
  const [tipo, setTipo] = useState("normal");
  const [secagem, setSecagem] = useState(false);
  const [passagem, setPassagem] = useState(false);
  const [perfumaria, setPerfumaria] = useState(false);
  const [factura, setFactura] = useState<any>(null);

  const handleFactura = () => {
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

    setFactura({ pesoNum, tipo, subtotal, iva, total });
  };

  const handleAceitar = () => {
    Alert.alert("Pedido Confirmado", "O seu pedido foi registado!");
    setFactura(null);
    setPeso("");
    setSecagem(false);
    setPassagem(false);
    setPerfumaria(false);
  };

  const handleRecusar = () => {
    setFactura(null);
  };

  return (
<SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.title}>Novo Pedido</Text>

      {!factura ? (
        <>
          <Text>Peso das roupas (kg):</Text>
          <TextInput
            style={[styles.input, erroPeso && styles.inputErro]}
            keyboardType="numeric"
            placeholder="Ex: 12.5"
            value={peso}
            onChangeText={setPeso}
          />
          {erroPeso && <Text style={styles.mensagemErro}>Valor não válido</Text>}

          <ServiceSelector tipo={tipo} setTipo={setTipo} />

          <Text style={{ marginTop: 10 }}>Serviços adicionais:</Text>
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

          <TouchableOpacity style={styles.button} onPress={handleFactura}>
            <Text style={styles.buttonText}>Gerar Factura</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.facturaBox}>
          <Text style={styles.facturaTitle}>🧾 Factura</Text>
          <Text>Peso: {factura.pesoNum} kg</Text>
          <Text>Tipo: {factura.tipo}</Text>
          <Text>Subtotal: {factura.subtotal.toFixed(2)} MT</Text>
          <Text>IVA (16%): {factura.iva.toFixed(2)} MT</Text>
          <Text style={styles.total}>Total: {factura.total.toFixed(2)} MT</Text>

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
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 12, marginBottom: 5, backgroundColor: "#f9f9f9" },
  inputErro: { borderColor: "red" },
  mensagemErro: { color: "red", fontSize: 14, marginBottom: 10 },
  button: { backgroundColor: "#007AFF", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginVertical: 5 },
  buttonAtivo: { backgroundColor: "#34C759" },
  buttonText: { color: "#fff", fontWeight: "600" },
  facturaBox: { marginTop: 20, padding: 15, borderWidth: 2, borderColor: "#007AFF", borderRadius: 12 },
  facturaTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  total: { fontWeight: "bold", marginTop: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  aceitar: { backgroundColor: "#34C759", flex: 1, marginRight: 5 },
  recusar: { backgroundColor: "#FF3B30", flex: 1, marginLeft: 5 },
});