import { MaterialIcons } from "@expo/vector-icons";
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
  useColorScheme,
  View,
} from "react-native";
import api, { logoutUser } from "../../api/userApi"; // usa o mesmo interceptor

const UserProfile = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const colors = {
    primary: "#007AFF",
    backgroundLight: "#F8F9FA",
    backgroundDark: "#101d22",
    textPrimaryLight: "#343A40",
    textSecondaryLight: "#6C757D",
    cardLight: "#FFFFFF",
    textPrimaryDark: "#E9ECEF",
    textSecondaryDark: "#ADB5BD",
    cardDark: "#1A282D",
  };

  const styles = createStyles(colors, isDark);

  type InfoCardProps = {
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
    label: string;
    value?: React.ReactNode;
  };

  const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
 
    <View style={styles.infoCard}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "—"}</Text>
      </View>
    </View>
  
  );

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
    try {
      await logoutUser();
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha ao terminar sessão.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={{
            marginTop: 10,
            color: isDark ? colors.textPrimaryDark : colors.textPrimaryLight,
          }}
        >
          A carregar dados...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.textSecondaryLight }}>
          Utilizador não encontrado.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Top App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={isDark ? colors.textPrimaryDark : colors.textPrimaryLight}
          />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>O meu perfil</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user.imagem ||
                  "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <View style={styles.card}>
            <InfoCard icon="email" label="Email" value={user.email} />
            <InfoCard icon="phone" label="Telefone" value={user.telefone} />
            <InfoCard icon="location-on" label="Endereço" value={user.endereco} />
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <View style={styles.card}>
            <InfoCard
              icon="event"
              label="Criado em"
              value={new Date(user.created_at).toLocaleDateString("pt-PT")}
            />
            <InfoCard
              icon="update"
              label="Atualizado em"
              value={new Date(user.updated_at).toLocaleDateString("pt-PT")}
            />
          </View>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Terminar Sessão</Text>
          <MaterialIcons name="logout" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: { primary: any; backgroundLight: any; backgroundDark: any; textPrimaryLight: any; textSecondaryLight: any; cardLight: any; textPrimaryDark: any; textSecondaryDark: any; cardDark: any; }, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight,
      paddingTop: 40
    },
    scrollView: {
      flex: 1,
    },
    appBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight,
    },
    iconButton: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    appBarTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? colors.textPrimaryDark : colors.textPrimaryLight,
      textAlign: "center",
      flex: 1,
    },
    profileHeader: {
      padding: 16,
      alignItems: "center",
    },
    avatarContainer: {
      marginBottom: 16,
    },
    avatar: {
      width: 128,
      height: 128,
      borderRadius: 64,
      borderWidth: 3,
      borderColor: colors.primary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    userName: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? colors.textPrimaryDark : colors.textPrimaryLight,
      textAlign: "center",
    },
    section: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    card: {
      backgroundColor: isDark ? colors.cardDark : colors.cardLight,
      borderRadius: 12,
      padding: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    infoCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      minHeight: 72,
      gap: 16,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight,
      alignItems: "center",
      justifyContent: "center",
    },
    infoTextContainer: {
      flex: 1,
      justifyContent: "center",
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: isDark ? colors.textSecondaryDark : colors.textSecondaryLight,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? colors.textPrimaryDark : colors.textPrimaryLight,
    },
    logoutContainer: {
      padding: 16,
      backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 5,
    },
    logoutText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });

export default UserProfile;
