import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api, { logoutUser } from "../../api/userApi";

const UserProfile = () => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data);
      } catch (error: any) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar os dados do utilizador.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Terminar Sessão",
      "Tem certeza que deseja terminar a sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Terminar", 
          onPress: async () => {
            try {
              await logoutUser();
              router.replace("/login");
            } catch (error: any) {
              Alert.alert("Erro", error.response?.data?.message || "Falha ao terminar sessão.");
            }
          }
        }
      ]
    );
  };

  type InfoCardProps = {
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
    label: string;
    value?: React.ReactNode;
  };

  const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
    <View style={styles.infoCard}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={20} color="#007AFF" />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "Não definido"}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
        <LinearGradient
          colors={['#007AFF', '#0056CC']}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>A carregar os seus dados...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <MaterialIcons name="error-outline" size={48} color="#8E8E93" />
        <Text style={styles.errorText}>Não foi possível carregar o perfil</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      {/* Header Azul com Gradiente */}
      <LinearGradient
        colors={['#007AFF', '#0056CC']}
        style={styles.header}
      >
        {/* Título Centralizado */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>O Meu Perfil</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user.imagem || "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
              }}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              <MaterialIcons name="check-circle" size={16} color="#34C759" />
            </View>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Informações Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>As minhas informações</Text>
          <View style={styles.card}>
            <InfoCard icon="person" label="Nome completo" value={user.name} />
            <View style={styles.divider} />
            <InfoCard icon="email" label="Email" value={user.email} />
            <View style={styles.divider} />
            <InfoCard icon="phone" label="Telefone" value={user.telefone} />
            <View style={styles.divider} />
            <InfoCard icon="location-on" label="Morada" value={user.endereco} />
          </View>
        </View>

        {/* Informações da Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre a sua conta</Text>
          <View style={styles.card}>
            <InfoCard
              icon="event"
              label="Membro desde"
              value={new Date(user.created_at).toLocaleDateString("pt-PT", {
                year: 'numeric',
                month: 'long'
              })}
            />
            <View style={styles.divider} />
            <InfoCard
              icon="update"
              label="Última atualização"
              value={new Date(user.updated_at).toLocaleDateString("pt-PT")}
            />
          </View>
        </View>

        {/* Mensagem de Boas-Vindas */}
        <View style={styles.section}>
          <View style={styles.welcomeCard}>
            <MaterialIcons name="local-laundry-service" size={32} color="#007AFF" />
            <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
            <Text style={styles.welcomeText}>
              Obrigado por fazer parte da nossa comunidade de lavandaria. 
              Estamos aqui para tornar a sua experiência de lavagem mais 
              simples, rápida e conveniente.
            </Text>
          </View>
        </View>
      </ScrollView>
      


      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        
        {/* Botão Editar Perfil */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: "rgba(0,122,255,0.08)", marginBottom: 10 }]}
          onPress={() => router.push("/(hidden)/editProfile")} // cria a tela EditProfile.tsx
        >
          <MaterialIcons name="edit" size={18} color="#007AFF" />
          <Text style={[styles.logoutText, { color: "#007AFF" }]}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={18} color="#FF3B30" />
          <Text style={styles.logoutText}>Terminar Sessão</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
    marginLeft: 4,
    marginTop:21,
    padding: 10
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.08)",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F2F7",
    marginHorizontal: 16,
  },
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.08)",
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },
  logoutContainer: {
    padding: 20,
    backgroundColor: "#F8FBFF",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.1)",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default UserProfile;