import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const tipos = [
  { label: "Normal (50 MT/kg)", value: "normal" },
  { label: "Delicada (80 MT/kg)", value: "delicada" },
  { label: "A Seco (120 MT/kg)", value: "seco" },
];

interface Props {
  tipo: string;
  setTipo: (value: string) => void;
}

export default function ServiceSelector({ tipo, setTipo }: Props) {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text>Tipo de lavagem:</Text>
      {tipos.map((t) => (
        <TouchableOpacity
          key={t.value}
          onPress={() => setTipo(t.value)}
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