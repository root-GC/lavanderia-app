import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tipos = [
  { label: "Normal (50 MT/kg)", value: "normal" },
  { label: "Delicada (80 MT/kg)", value: "delicada" },
  { label: "A Seco (120 MT/kg)", value: "seco" },
];

//type TipoLavagem = "normal" | "delicada" | "seco";

interface Props {
  tipo: "normal" | "delicada" | "seco";
  setTipo: React.Dispatch<React.SetStateAction<"normal" | "delicada" | "seco">>;
}

export default function ServiceSelector({ tipo, setTipo }: Props) {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text>Tipo de lavagem:</Text>
      {tipos.map((t) => (
        <TouchableOpacity
          key={t.value}
          onPress={() => setTipo(t.value as "normal" | "delicada" | "seco")}
          style={[
            styles.button,
            tipo === t.value && { borderColor: "blue", backgroundColor: "#e6f0ff" },
          ]}
        >
          <Text>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});