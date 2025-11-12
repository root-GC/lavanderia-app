import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import api from "../../api/userApi";

const EditProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        const user = response.data;
        setName(user.name || "");
        setEmail(user.email || "");
        setTelefone(user.telefone || "");
        setEndereco(user.endereco || "");
      } catch (error: any) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar os dados do utilizador.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/update", { name, email, telefone, endereco });
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      router.back(); // volta para o perfil
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.response?.data?.message || "Falha ao atualizar os dados.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
        <LinearGradient
          colors={["#007AFF", "#0056CC"]}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>A carregar os dados...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      {/* Header com Gradiente */}
      <LinearGradient
        colors={["#007AFF", "#0056CC"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
         
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Espaço acima do conteúdo */}
          <View style={styles.topSpace} />

          {/* Card do Formulário */}
          <View style={styles.card}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              
              {/* Campo Nome */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="person" size={16} color="#007AFF" />
                  <Text style={styles.inputLabel}>Nome completo</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              {/* Campo Email */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="email" size={16} color="#007AFF" />
                  <Text style={styles.inputLabel}>Email</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor="#8E8E93"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Campo Telefone */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="phone" size={16} color="#007AFF" />
                  <Text style={styles.inputLabel}>Telefone</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="+258 XX XXX XXXX"
                  placeholderTextColor="#8E8E93"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Campo Endereço */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="location-on" size={16} color="#007AFF" />
                  <Text style={styles.inputLabel}>Endereço</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={endereco}
                  onChangeText={setEndereco}
                  placeholder="Digite seu endereço completo"
                  placeholderTextColor="#8E8E93"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Botão de Salvar */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="save" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Espaço extra no final */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FBFF" 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    width: "100%" 
  },
  loadingText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "600",
    marginTop: 12 
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  scrollView: { 
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  topSpace: {
    height: 20,
  },
  bottomSpace: {
    height: 40,
  },
  card: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 20, 
    padding: 0,
    marginBottom: 24,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.1)",
    overflow: 'hidden',
  },
  formSection: {
    padding: 24,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#1C1C1E", 
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#1C1C1E",
  },
  input: { 
    backgroundColor: "#F8FBFF",
    borderWidth: 1, 
    borderColor: "#E5E5EA", 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 16, 
    color: "#1C1C1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#007AFF", 
    paddingVertical: 16, 
    borderRadius: 14, 
    gap: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: { 
    color: "#FFFFFF", 
    fontWeight: "600", 
    fontSize: 16,
  },
});

export default EditProfile;