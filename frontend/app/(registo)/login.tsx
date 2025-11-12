import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { loginUser } from "../../api/userApi";

interface ValidationErrors {
  email?: string;
  senha?: string;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email inválido';
        return '';
      
      case 'senha':
        if (!value) return 'Senha é obrigatória';
        if (value.length < 1) return 'Senha é obrigatória';
        return '';
      
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    // Atualiza o valor do campo
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'senha':
        setSenha(value);
        break;
    }

    // Validação em tempo real (apenas limpa o erro se estiver correto)
    const error = validateField(field, value);
    if (!error && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldBlur = (field: string, value: string) => {
    // Validação quando o campo perde o foco
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      email: validateField('email', email),
      senha: validateField('senha', senha),
    };

    setErrors(newErrors);

    // Verifica se não há erros
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert("Erro", "Por favor, corrija os erros no formulário!");
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await loginUser({ 
        email: email.trim().toLowerCase(), 
        password: senha 
      });

      if (token) {
        await AsyncStorage.setItem("token", token);
        router.replace("/(menu)/pedidos");
      } else {
        Alert.alert("Erro", "Token não recebido do servidor.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Falha no login.";
      
      // Tratamento específico para erros comuns
      if (errorMessage.includes('credenciais') || errorMessage.includes('inválido') || errorMessage.includes('incorreto')) {
        setErrors({
          email: 'Email ou senha incorretos',
          senha: 'Email ou senha incorretos'
        });
      } else if (errorMessage.includes('encontrado') || errorMessage.includes('exist')) {
        setErrors({
          email: 'Email não encontrado'
        });
      } else {
        Alert.alert("Erro", errorMessage);
      }
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
            {/* Campo Email */}
            <View>
              <View style={[
                styles.inputGroup, 
                errors.email && styles.inputError
              ]}>
                <MaterialIcons 
                  name="email" 
                  size={20} 
                  color={errors.email ? "#FF3B30" : "#007AFF"} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={(value) => handleFieldChange('email', value)}
                  onBlur={() => handleFieldBlur('email', email)}
                  placeholderTextColor="#8E8E93"
                />
              </View>
              {errors.email ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={14} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              ) : null}
            </View>

            {/* Campo Senha */}
            <View>
              <View style={[
                styles.inputGroup, 
                errors.senha && styles.inputError
              ]}>
                <MaterialIcons 
                  name="lock" 
                  size={20} 
                  color={errors.senha ? "#FF3B30" : "#007AFF"} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  placeholder="Senha"
                  style={styles.input}
                  secureTextEntry
                  value={senha}
                  onChangeText={(value) => handleFieldChange('senha', value)}
                  onBlur={() => handleFieldBlur('senha', senha)}
                  placeholderTextColor="#8E8E93"
                  onSubmitEditing={handleLogin} // Permite submeter com Enter
                />
              </View>
              {errors.senha ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={14} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.senha}</Text>
                </View>
              ) : null}
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
    marginBottom: 8,
    paddingHorizontal: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  inputError: {
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOpacity: 0.1,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 8,
    gap: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '500',
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