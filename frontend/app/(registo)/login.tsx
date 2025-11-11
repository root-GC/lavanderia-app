import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  Alert, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { loginUser } from "../../api/userApi";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) return Alert.alert("Erro", "Preenche todos os campos.");

    try {
      setLoading(true);
      const { token, user } = await loginUser({ email, password: senha });

      if (token) {
        await AsyncStorage.setItem("token", token);
        router.replace("/(menu)/pedidos");
      } else {
        Alert.alert("Erro", "Token não recebido do servidor.");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha no login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#E6F7FF', '#F0F9FF', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Espaço acima do logo */}
          <View style={styles.topSpace} />

          {/* Logo no Topo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="local-laundry-service" size={48} color="#007AFF" />
            </View>
            <Text style={styles.logoTitle}>Lavandaria</Text>
            <Text style={styles.logoSubtitle}>Brilho</Text>
          </View>

          <Text style={styles.pageTitle}>Entrar na Sua Conta</Text>

          {/* Formulário */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <MaterialIcons name="email" size={20} color="#007AFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputGroup}>
              <MaterialIcons name="lock" size={20} color="#007AFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Senha"
                style={styles.input}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                placeholderTextColor="#8E8E93"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="login" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Entrar</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Não tens conta? </Text>
              <TouchableOpacity onPress={() => router.push("/(registo)/signup")}>
                <Text style={styles.signupLink}>Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Efeito de Água Decorativo */}
          <View style={styles.waterEffect}>
            <MaterialIcons name="water-drop" size={24} color="rgba(0, 122, 255, 0.3)" />
            <MaterialIcons name="water-drop" size={20} color="rgba(0, 122, 255, 0.2)" />
            <MaterialIcons name="water-drop" size={16} color="rgba(0, 122, 255, 0.1)" />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  topSpace: {
    height: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#F0F9FF',
    marginBottom: 16,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  logoSubtitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#0056CC',
    fontStyle: 'italic',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1C1C1E',
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  signupLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  waterEffect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 16,
    opacity: 0.6,
  },
});