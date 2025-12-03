import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { getUser } from "../../api/userApi";

interface Pedido {
  id: number;
  imagem_original: string;
  tipo: string;
  servicos_adicionais: string[];
  peso: number;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
  created_at: string;
}

export default function PedidosFeitos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [filtroServico, setFiltroServico] = useState<string | null>(null);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const user = await getUser();
      let query = `/pedidos?user_id=${user.id}`;
      if (filtroTipo) query += `&tipo=${filtroTipo}`;
      if (filtroEstado) query += `&estado=${filtroEstado}`;
      if (filtroServico) query += `&servico=${filtroServico}`;
      const response = await api.get(query);
      setPedidos(response.data.pedidos || []);
      setPedidosFiltrados(response.data.pedidos || []);
    } catch (error) {
      console.log("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchPedidos();
  }, []));

  useEffect(() => {
    fetchPedidos();
  }, [filtroTipo, filtroEstado, filtroServico]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setPedidosFiltrados(pedidos);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = pedidos.filter(pedido => 
        pedido.id.toString().includes(query) ||
        pedido.tipo.toLowerCase().includes(query) ||
        pedido.estado.toLowerCase().includes(query) ||
        pedido.servicos_adicionais.some(servico => 
          servico.toLowerCase().includes(query)
        )
      );
      setPedidosFiltrados(filtered);
    }
  }, [searchQuery, pedidos]);

  const deletePedido = async (id: number) => {
    setPedidos(prev => prev.filter(p => p.id !== id));
    setPedidosFiltrados(prev => prev.filter(p => p.id !== id));
    try {
      await api.delete(`/pedidos/${id}`);
    } catch (error) {
      console.log("Erro ao apagar pedido:", error);
    }
  };

  const openModal = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setModalVisible(true);
  };

  const getEstadoColor = (estado: string) => {
    switch(estado.toLowerCase()) {
      case 'pendente': return '#FF6B6B';
      case 'concluído': return '#34C759';
      case 'lavando': return '#007AFF';
      case 'aguardando confirmação': return '#FF9500';
      case 'aguardando avaliação': return '#AF52DE';
      case 'recusado': return '#FF3B30';
      case 'confirmado': return '#30D158';
      default: return '#8E8E93';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch(estado.toLowerCase()) {
      case 'pendente': return 'time-outline';
      case 'concluído': return 'checkmark-done-circle-outline';
      case 'lavando': return 'water-outline';
      case 'aguardando confirmação': return 'alert-circle-outline';
      case 'aguardando avaliação': return 'clipboard-outline';
      case 'recusado': return 'close-circle-outline';
      case 'confirmado': return 'checkmark-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch(tipo.toLowerCase()) {
      case 'normal': return 'shirt-outline';
      case 'delicada': return 'flower-outline';
      case 'seco': return 'sunny-outline';
      default: return 'shirt-outline';
    }
  };

  const aceitarPedido = async () => {
    if (!selectedPedido) return;
    try {
      await api.post(`/pedidos/${selectedPedido.id}/estado`, { estado: "confirmado" });
      setPedidos(prev => prev.map(p => p.id === selectedPedido.id ? { ...p, estado: "confirmado" } : p));
      setPedidosFiltrados(prev => prev.map(p => p.id === selectedPedido.id ? { ...p, estado: "confirmado" } : p));
      setSelectedPedido(prev => prev ? { ...prev, estado: "confirmado" } : null);
    } catch (error) {
      console.log("Erro ao aceitar pedido:", error);
    }
  };

  const recusarPedido = async () => {
    if (!selectedPedido) return;
    try {
      await api.post(`/pedidos/${selectedPedido.id}/estado`, { estado: "recusado" });
      setPedidos(prev => prev.map(p => p.id === selectedPedido.id ? { ...p, estado: "recusado" } : p));
      setPedidosFiltrados(prev => prev.map(p => p.id === selectedPedido.id ? { ...p, estado: "recusado" } : p));
      setSelectedPedido(prev => prev ? { ...prev, estado: "recusado" } : null);
    } catch (error) {
      console.log("Erro ao recusar pedido:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearSearch = () => setSearchQuery("");
  const clearAllFilters = () => {
    setFiltroTipo(null);
    setFiltroEstado(null);
    setFiltroServico(null);
    setSearchQuery("");
  };

  const renderItem = ({ item }: { item: Pedido }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.imagem_original }} style={styles.image} />
        <View style={[styles.cardEstadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Ionicons name={getEstadoIcon(item.estado)} size={12} color="#FFFFFF" />
          <Text style={styles.cardEstadoText} numberOfLines={1}>{item.estado}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
          <View style={styles.tipoContainer}>
            <Ionicons name={getTipoIcon(item.tipo)} size={16} color="#007AFF" />
            <Text style={styles.tipoText} numberOfLines={1}>{item.tipo}</Text>
          </View>
        </View>
        
        <View style={styles.servicosContainer}>
          {item.servicos_adicionais?.slice(0, 2).map((servico, index) => (
            <View key={index} style={styles.servicoTag}>
              <Ionicons name="checkmark-circle" size={12} color="#34C759" />
              <Text style={styles.servicoText} numberOfLines={1}>{servico}</Text>
            </View>
          ))}
          {item.servicos_adicionais?.length > 2 && (
            <View style={styles.moreTag}>
              <Text style={styles.moreText}>+{item.servicos_adicionais.length - 2}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.infoItem}>
            <Ionicons name="scale-outline" size={14} color="#8E8E93" />
            <Text style={styles.infoText}>{item.peso} kg</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={14} color="#8E8E93" />
            <Text style={styles.totalText}>{item.total.toFixed(2)} MT</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.viewButton} onPress={() => openModal(item)}>
            <Ionicons name="eye-outline" size={14} color="#007AFF" />
            <Text style={styles.viewButtonText}>Detalhes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deletePedido(item.id)}>
            <Ionicons name="trash-outline" size={14} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  type RootStackParamList = {
    editarpedidos: { pedidoId: number };
  };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando pedidos...</Text>
      </View>
    );
  }

  const hasActiveFilters = filtroTipo || filtroEstado || filtroServico || searchQuery;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#F8FBFF', '#E8F4FF', '#FFFFFF']} style={styles.gradientBackground}>
        <View style={styles.container}>
          <View style={styles.header}>
            <LinearGradient colors={['#007AFF', '#0056CC']} style={styles.headerGradient}>
              <Ionicons name="list-circle-outline" size={28} color="#FFFFFF" />
              <Text style={styles.title}>Meus Pedidos</Text>
              <Text style={styles.subtitle}>Acompanhe seus pedidos de lavagem</Text>
            </LinearGradient>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search-outline" size={18} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar pedidos..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#8E8E93"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <Ionicons name="close-circle" size={18} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.filtrosContainer}>
            <View style={styles.filtrosHeader}>
              <Text style={styles.filtrosTitle}>Filtrar por:</Text>
              {hasActiveFilters && (
                <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                  <Ionicons name="close-circle" size={14} color="#FF3B30" />
                  <Text style={styles.clearFiltersText}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosScroll}>
              <View style={styles.filtrosRow}>
                <TouchableOpacity 
                  style={[styles.filterButton, filtroTipo === "normal" && styles.filterActive]} 
                  onPress={() => setFiltroTipo(filtroTipo === "normal" ? null : "normal")}
                >
                  <Ionicons name="shirt-outline" size={14} color={filtroTipo === "normal" ? "#FFFFFF" : "#007AFF"} />
                  <Text style={[styles.filterText, filtroTipo === "normal" && styles.filterTextActive]}>Normal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterButton, filtroTipo === "delicada" && styles.filterActive]} 
                  onPress={() => setFiltroTipo(filtroTipo === "delicada" ? null : "delicada")}
                >
                  <Ionicons name="flower-outline" size={14} color={filtroTipo === "delicada" ? "#FFFFFF" : "#007AFF"} />
                  <Text style={[styles.filterText, filtroTipo === "delicada" && styles.filterTextActive]}>Delicada</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterButton, filtroTipo === "seco" && styles.filterActive]} 
                  onPress={() => setFiltroTipo(filtroTipo === "seco" ? null : "seco")}
                >
                  <Ionicons name="sunny-outline" size={14} color={filtroTipo === "seco" ? "#FFFFFF" : "#007AFF"} />
                  <Text style={[styles.filterText, filtroTipo === "seco" && styles.filterTextActive]}>Seco</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterButton, filtroEstado === "pendente" && styles.filterActive]} 
                  onPress={() => setFiltroEstado(filtroEstado === "pendente" ? null : "pendente")}
                >
                  <Ionicons name="time-outline" size={14} color={filtroEstado === "pendente" ? "#FFFFFF" : "#FF6B6B"} />
                  <Text style={[styles.filterText, filtroEstado === "pendente" && styles.filterTextActive]}>Pendente</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterButton, filtroEstado === "concluído" && styles.filterActive]} 
                  onPress={() => setFiltroEstado(filtroEstado === "concluído" ? null : "concluído")}
                >
                  <Ionicons name="checkmark-circle-outline" size={14} color={filtroEstado === "concluído" ? "#FFFFFF" : "#34C759"} />
                  <Text style={[styles.filterText, filtroEstado === "concluído" && styles.filterTextActive]}>Concluído</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterButton, filtroEstado === "lavando" && styles.filterActive]} 
                  onPress={() => setFiltroEstado(filtroEstado === "lavando" ? null : "lavando")}
                >
                  <Ionicons name="water-outline" size={14} color={filtroEstado === "lavando" ? "#FFFFFF" : "#007AFF"} />
                  <Text style={[styles.filterText, filtroEstado === "lavando" && styles.filterTextActive]}>Lavando</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {pedidosFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name={hasActiveFilters ? "filter-outline" : "file-tray-outline"} 
                size={56} 
                color="#C7C7CC" 
              />
              <Text style={styles.emptyTitle}>
                {hasActiveFilters ? "Nenhum pedido encontrado" : "Nenhum pedido encontrado"}
              </Text>
              <Text style={styles.emptyText}>
                {hasActiveFilters 
                  ? "Tente ajustar sua pesquisa ou filtros" 
                  : "Seus pedidos aparecerão aqui"
                }
              </Text>
              {hasActiveFilters && (
                <TouchableOpacity style={styles.clearSearchButton} onPress={clearAllFilters}>
                  <Text style={styles.clearSearchText}>Limpar filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <FlatList
              data={pedidosFiltrados}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </LinearGradient>

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selectedPedido && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalHeaderTop}>
                      <Text style={styles.modalTitle}>Detalhes do Pedido</Text>
                      <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                        <Ionicons name="close" size={22} color="#8E8E93" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalPedidoInfo}>
                      <View style={[styles.estadoBadgeModal, { backgroundColor: getEstadoColor(selectedPedido.estado) }]}>
                        <Ionicons name={getEstadoIcon(selectedPedido.estado)} size={12} color="#FFFFFF" />
                        <Text style={styles.estadoTextModal} numberOfLines={1}>{selectedPedido.estado}</Text>
                      </View>
                      <Text style={styles.modalPedidoId}>#{selectedPedido.id}</Text>
                    </View>
                  </View>

                  <View style={styles.imageSection}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: selectedPedido.imagem_original }} style={styles.modalImage} />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.imageLabel}>Foto do Pedido</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.infoSection}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="information-circle" size={18} color="#007AFF" />
                      <Text style={styles.sectionTitle}>Informações Gerais</Text>
                    </View>
                    
                    <View style={styles.infoGrid}>
                      <View style={styles.infoCard}>
                        <View style={[styles.infoIconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
                          <Ionicons name={getTipoIcon(selectedPedido.tipo)} size={18} color="#007AFF" />
                        </View>
                        <Text style={styles.infoCardLabel}>Tipo</Text>
                        <Text style={styles.infoCardValue}>{selectedPedido.tipo}</Text>
                      </View>

                      <View style={styles.infoCard}>
                        <View style={[styles.infoIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                          <Ionicons name="scale" size={18} color="#34C759" />
                        </View>
                        <Text style={styles.infoCardLabel}>Peso</Text>
                        <Text style={styles.infoCardValue}>{selectedPedido.peso} kg</Text>
                      </View>

                      <View style={styles.infoCard}>
                        <View style={[styles.infoIconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
                          <Ionicons name="calendar" size={18} color="#FF9500" />
                        </View>
                        <Text style={styles.infoCardLabel}>Data</Text>
                        <Text style={styles.infoCardValue} numberOfLines={1}>{formatDate(selectedPedido.created_at)}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.servicesSection}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="sparkles" size={18} color="#007AFF" />
                      <Text style={styles.sectionTitle}>Serviços Adicionais</Text>
                    </View>
                    
                    <View style={styles.servicesList}>
                      {selectedPedido.servicos_adicionais?.map((servico, index) => (
                        <View key={index} style={styles.serviceItem}>
                          <View style={styles.serviceIcon}>
                            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                          </View>
                          <Text style={styles.serviceText} numberOfLines={1}>{servico}</Text>
                        </View>
                      ))}
                      {selectedPedido.servicos_adicionais?.length === 0 && (
                        <View style={styles.noServices}>
                          <Ionicons name="remove-circle" size={18} color="#C7C7CC" />
                          <Text style={styles.noServicesText}>Nenhum serviço adicional</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {(selectedPedido.estado === "Aguardando Confirmação" || 
                    selectedPedido.estado === "Concluído" ||
                    selectedPedido.estado === "Confirmado") && (
                    <View style={styles.financeSection}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name="cash" size={18} color="#007AFF" />
                        <Text style={styles.sectionTitle}>Detalhes Financeiros</Text>
                      </View>
                      
                      <View style={styles.financeCard}>
                        <View style={styles.financeRow}>
                          <Text style={styles.financeLabel}>Subtotal:</Text>
                          <Text style={styles.financeValue}>{selectedPedido.subtotal.toFixed(2)} MT</Text>
                        </View>
                        <View style={styles.financeRow}>
                          <Text style={styles.financeLabel}>IVA (16%):</Text>
                          <Text style={styles.financeValue}>{selectedPedido.iva.toFixed(2)} MT</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.financeTotal}>
                          <Text style={styles.financeTotalLabel}>Total:</Text>
                          <Text style={styles.financeTotalValue}>{selectedPedido.total.toFixed(2)} MT</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.actionsSection}>
                    {selectedPedido.estado === "Aguardando Avaliação" && (
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                          setModalVisible(false);
                          navigation.navigate('editarpedidos', { pedidoId: selectedPedido.id });
                        }}
                      >
                        <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.editButtonText}>Editar Pedido</Text>
                      </TouchableOpacity>
                    )}

                    {selectedPedido.estado === "Aguardando Confirmação" && (
                      <View style={styles.confirmationButtons}>
                        <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={aceitarPedido}>
                          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Aceitar Proposta</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.actionButton, styles.declineButton]} onPress={recusarPedido}>
                          <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Recusar</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {selectedPedido.estado === "Recusado" && (
                      <View style={styles.statusMessage}>
                        <Ionicons name="sad-outline" size={28} color="#FF3B30" />
                        <Text style={styles.statusTitle}>Pedido Recusado</Text>
                        <Text style={styles.statusText}>
                          Você recusou esta proposta. Pode criar um novo pedido se desejar.
                        </Text>
                      </View>
                    )}

                    {selectedPedido.estado === "Confirmado" && (
                      <View style={styles.statusMessage}>
                        <Ionicons name="checkmark-circle" size={28} color="#34C759" />
                        <Text style={styles.statusTitle}>Pedido Confirmado</Text>
                        <Text style={styles.statusText}>
                          Seu pedido foi confirmado e está em processamento.
                        </Text>
                      </View>
                    )}

                    {selectedPedido.estado === "Concluído" && (
                      <View style={styles.statusMessage}>
                        <Ionicons name="trophy-outline" size={28} color="#FF9500" />
                        <Text style={styles.statusTitle}>Pedido Concluído</Text>
                        <Text style={styles.statusText}>
                          Seu pedido foi finalizado com sucesso!
                        </Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  gradientBackground: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F8FBFF' },
  loadingText: { marginTop: 16, fontSize: 14, color: '#007AFF', fontWeight: '600' },
  container: { flex: 1 },
  header: { marginBottom: 16 },
  headerGradient: { paddingVertical: 24, paddingHorizontal: 16, alignItems: 'center', borderRadius: 20, marginHorizontal: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF", marginTop: 8 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchInputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E5EA'
  },
  searchInput: { flex: 1, marginHorizontal: 8, fontSize: 14, color: '#1C1C1E' },
  
  filtrosContainer: { paddingHorizontal: 16, marginBottom: 16 },
  filtrosHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  filtrosTitle: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  clearFiltersButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2 },
  clearFiltersText: { fontSize: 12, color: '#FF3B30', fontWeight: '500' },
  filtrosScroll: { flexGrow: 0 },
  filtrosRow: { flexDirection: 'row', gap: 8 },
  filterButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#E5E5EA', gap: 4
  },
  filterActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterText: { fontSize: 12, fontWeight: '500', color: '#007AFF' },
  filterTextActive: { color: '#FFFFFF' },
  
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, marginBottom: 10,
    flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(0, 122, 255, 0.1)'
  },
  cardImageContainer: { position: 'relative' },
  image: { width: 90, height: 90, borderRadius: 10 },
  cardEstadoBadge: {
    position: 'absolute', top: 6, left: 6, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, gap: 3
  },
  cardEstadoText: { color: '#FFFFFF', fontSize: 9, fontWeight: '600' },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  pedidoId: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  tipoContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6
  },
  tipoText: { fontSize: 10, fontWeight: '600', color: '#007AFF' },
  servicosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 },
  servicoTag: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 3
  },
  servicoText: { fontSize: 10, color: '#34C759', fontWeight: '500' },
  moreTag: { backgroundColor: 'rgba(142, 142, 147, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  moreText: { fontSize: 10, color: '#8E8E93', fontWeight: '500' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  infoText: { fontSize: 11, color: '#8E8E93' },
  totalText: { fontSize: 12, fontWeight: '700', color: '#007AFF' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  viewButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)', paddingVertical: 6, borderRadius: 8, gap: 4
  },
  viewButtonText: { color: '#007AFF', fontWeight: '600', fontSize: 12 },
  deleteButton: { padding: 6, backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 8 },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginTop: 12, marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#8E8E93', textAlign: 'center', marginBottom: 16 },
  clearSearchButton: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  clearSearchText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHandle: { width: 32, height: 4, backgroundColor: '#E5E5EA', borderRadius: 2, alignSelf: 'center', marginTop: 8, marginBottom: 8 },
  modalContent: { paddingHorizontal: 16, paddingBottom: 24 },
  modalHeader: { marginBottom: 16 },
  modalHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E' },
  modalCloseButton: { padding: 4 },
  modalPedidoInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  estadoBadgeModal: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, gap: 4
  },
  estadoTextModal: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  modalPedidoId: { fontSize: 12, color: '#8E8E93', fontWeight: '500' },
  
  imageSection: { marginBottom: 20 },
  imageContainer: { position: 'relative', borderRadius: 14, overflow: 'hidden', backgroundColor: '#F2F2F7', height: 180 },
  modalImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8 },
  imageLabel: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  
  infoSection: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoCard: {
    flex: 1, minWidth: '48%', backgroundColor: '#F8F8F8', borderRadius: 10, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA'
  },
  infoIconContainer: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  infoCardLabel: { fontSize: 11, color: '#8E8E93', marginBottom: 2 },
  infoCardValue: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  
  servicesSection: { marginBottom: 20 },
  servicesList: { backgroundColor: '#F8F8F8', borderRadius: 10, borderWidth: 1, borderColor: '#E5E5EA', padding: 12 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  serviceIcon: { marginRight: 8 },
  serviceText: { fontSize: 14, color: '#1C1C1E', flex: 1 },
  noServices: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 6 },
  noServicesText: { fontSize: 14, color: '#8E8E93' },
  
  financeSection: { marginBottom: 20 },
  financeCard: { backgroundColor: '#F8F8F8', borderRadius: 10, borderWidth: 1, borderColor: '#E5E5EA', padding: 12 },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  financeLabel: { fontSize: 14, color: '#8E8E93' },
  financeValue: { fontSize: 14, fontWeight: '500', color: '#1C1C1E' },
  separator: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 8 },
  financeTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 },
  financeTotalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E' },
  financeTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  
  actionsSection: { marginTop: 8 },
  editButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF',
    paddingVertical: 12, borderRadius: 10, gap: 6
  },
  editButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  confirmationButtons: { gap: 8 },
  actionButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 6
  },
  acceptButton: { backgroundColor: '#34C759' },
  declineButton: { backgroundColor: '#FF3B30' },
  actionButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  statusMessage: { alignItems: 'center', padding: 16, backgroundColor: '#F8F8F8', borderRadius: 10, borderWidth: 1, borderColor: '#E5E5EA' },
  statusTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E', marginTop: 8, marginBottom: 4 },
  statusText: { fontSize: 12, color: '#8E8E93', textAlign: 'center', lineHeight: 18 },
});