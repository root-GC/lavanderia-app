import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notificacoes() {
  const notificacoes = [
    { id: 1, pedido: "Lavagem Rápida", estado: "Pendente" },
    { id: 2, pedido: "Roupas Delicadas", estado: "Lavando" },
    { id: 3, pedido: "Cobertores", estado: "Concluído" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Notificações</Text>
        {notificacoes.map((n) => (
          <View key={n.id} style={styles.card}>
            <Text style={styles.pedido}>{n.pedido}</Text>
            <Text
              style={[
                styles.estado,
                (styles as any)[n.estado.toLowerCase()] || styles.default,
              ]}
            >
              {n.estado}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  pedido: {
    fontWeight: "600",
  },
  estado: {
    marginTop: 5,
    fontWeight: "bold",
  },
  pendente: {
    color: "orange",
  },
  lavando: {
    color: "#007AFF",
  },
  concluído: {
    color: "green",
  },
  default: {
    color: "gray",
  },
});