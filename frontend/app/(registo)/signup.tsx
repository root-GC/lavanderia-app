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
import { registerUser } from "../../api/userApi";

interface ValidationErrors {
  name?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  password?: string;
}

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email inválido';
        return '';
      
      case 'telefone':
        if (!value.trim()) return 'Telefone é obrigatório';
        const phoneRegex = /^[9][0-9]{8}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Telefone deve ter 9 dígitos começando com 9';
        return '';
      
      case 'endereco':
        if (!value.trim()) return 'Endereço é obrigatório';
        if (value.trim().length < 5) return 'Endereço deve ter pelo menos 5 caracteres';
        return '';
      
      case 'password':
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return '';
      
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    // Atualiza o valor do campo
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'telefone':
        // Formatação automática do telefone
        const formattedPhone = value.replace(/\D/g, '').slice(0, 9);
        setTelefone(formattedPhone);
        break;
      case 'endereco':
        setEndereco(value);
        break;
      case 'password':
        setPassword(value);
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
      name: validateField('name', name),
      email: validateField('email', email),
      telefone: validateField('telefone', telefone),
      endereco: validateField('endereco', endereco),
      password: validateField('password', password),
    };

    setErrors(newErrors);

    // Verifica se não há erros
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert("Erro", "Por favor, corrija os erros no formulário!");
      return;
    }

    try {
      setLoading(true);
      const data = { 
        name: name.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        password 
      };
      const response = await registerUser(data);

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/(registo)/login");
    } catch (error: any) {
      const message =
        error.response?.data?.message || 
        error.response?.data?.errors?.[Object.keys(error.response?.data?.errors || {})[0]]?.[0] ||
        "Falha ao criar conta!";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneDisplay = (phone: string): string => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
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

          <Text style={styles.pageTitle}>Criar Nova Conta</Text>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo Nome */}
            <View>
              <View style={[
                styles.inputGroup, 
                errors.name && styles.inputError
              ]}>
                <MaterialIcons 
                  name="person" 
                  size={20} 
                  color={errors.name ? "#FF3B30" : "#007AFF"} 
                  style={styles.inputIcon} 
                />
                <TextInput 
                  placeholder="Nome completo" 
                  value={name} 
                  onChangeText={(value) => handleFieldChange('name', value)}
                  onBlur={() => handleFieldBlur('name', name)}
                  style={styles.input} 
                  placeholderTextColor="#8E8E93"
                />
              </View>
              {errors.name ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={14} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.name}</Text>
                </View>
              ) : null}
            </View>

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
                  value={email} 
                  onChangeText={(value) => handleFieldChange('email', value)}
                  onBlur={() => handleFieldBlur('email', email)}
                  style={styles.input} 
                  keyboardType="email-address"
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={14} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              ) : null}
            </View>

            {/* Campo Telefone */}
            <View>
              <View style={[
                styles.inputGroup, 
                errors.telefone && styles.inputError
              ]}>
                <MaterialIcons 
                  name="phone" 
                  size={20} 
                  color={errors.telefone ? "#FF3B30" : "#007AFF"} 
                  style={styles.inputIcon} 
                />
                <TextInput 
                  placeholder="Telefone (9 dígitos)" 
                  value={formatPhoneDisplay(telefone)} 
                  onChangeText={(value) => handleFieldChange('telefone', value)}
                  onBlur={() => handleFieldBlur('telefone', telefone)}
                  style={styles.input} 
                  keyboardType="phone-pad"
                  placeholderTextColor="#8E8E93"
                  maxLength={11} // 3 + 3 + 3 + espaços
                />
              </View>
              {errors.telefone ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={14} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.telefone}</Text>
                </View>
              ) : null}
            </View>

            {/* Campo Endereço */}
            <View>
              <View style={[
                styles.inputGroup, 
                errors.endereco && styles.inputError
              ]}>
                <MaterialIcons 
                  name="location-on" 
                  size={20} 
                  color={errors.endereco ? "#FF3B30" : "#007AFF"} 
                  style={styles.inputIcon} 
                />
                <TextInput 
                  placeholder="Endereço/Residência" 
                  value={endereco} 
                  onChangeText={(value) => handleFieldChange('endereco', value)}
                  onBlur={() => handleFieldBlur('endereco', endereco)}
                  style={styles.input} 
                  placeholderTextColor="#8E8E93"
                  multiline
                  numberOfLines={2}
                />
              </View>
              {errors.endereco ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={14} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.endereco}</Text>
                </View>
              ) : null}
            </View>

            {/* Campo Senha */}
            <View>
              <View style={[
                styles.inputGroup, 
                errors.password && styles.inputError
              ]}>
                <MaterialIcons 
                  name="lock" 
                  size={20} 
                  color={errors.password ? "#FF3B30" : "#007AFF"} 
                  style={styles.inputIcon} 
                />
                <TextInput 
                  placeholder="Senha (mínimo 6 caracteres)" 
                  value={password} 
                  onChangeText={(value) => handleFieldChange('password', value)}
                  onBlur={() => handleFieldBlur('password', password)}
                  style={styles.input} 
                  secureTextEntry
                  placeholderTextColor="#8E8E93"
                />
              </View>
              {errors.password ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={14} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.password}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Criar Conta</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tens conta? </Text>
              <TouchableOpacity onPress={() => router.push("/(registo)/login")}>
                <Text style={styles.loginLink}>Fazer login</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  loginLink: {
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