import React from "react";
import { Tabs } from "expo-router";
import { Home, ClipboardList, Bell, User } from "lucide-react-native";

export default function MenuLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="pedidos" options={{ tabBarIcon: ({ color }) => <Home color={color} /> }} />
      <Tabs.Screen name="pedidosFeitos" options={{ tabBarIcon: ({ color }) => <ClipboardList color={color} /> }} />
      <Tabs.Screen name="notificacoes" options={{ tabBarIcon: ({ color }) => <Bell color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ tabBarIcon: ({ color }) => <User color={color} /> }} />
    </Tabs>
  );
}