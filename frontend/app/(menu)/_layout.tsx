import React from "react";
import { Tabs } from "expo-router";
import { Home, ClipboardList, Bell, User } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function MenuLayout() {
  return (
    <>
      {/* Status bar visível e com ícones escuros */}
      <StatusBar style="dark" hidden={false} />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: { backgroundColor: "#fff", height: 60 },
        }}
      >
        <Tabs.Screen
          name="pedidos"
          options={{ title: "Pedidos", tabBarIcon: ({ color }) => <Home color={color} /> }}
        />
        <Tabs.Screen
          name="pedidosFeitos"
          options={{ title: "Pedidos Feitos", tabBarIcon: ({ color }) => <ClipboardList color={color} /> }}
        />
        <Tabs.Screen
          name="notificacoes"
          options={{ title: "Notificações", tabBarIcon: ({ color }) => <Bell color={color} /> }}
        />
        <Tabs.Screen
          name="perfil"
          options={{ title: "Perfil", tabBarIcon: ({ color }) => <User color={color} /> }}
        />
      </Tabs>
    </>
  );
}