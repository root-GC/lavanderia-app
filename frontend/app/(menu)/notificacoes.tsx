import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StatusBar as RNStatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api, { getUser } from "../../api/userApi";

type Estado = 'confirmado' | 'lavado' | 'recusado';


interface Notificacao {
  id: number;
  pedido: string;
  estado: Estado;
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [notificacoesFiltradas, setNotificacoesFiltradas] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<Estado | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();
 
/// const notificacoesFiltradas = dados?.notificacoesFiltradas || [];

  const fetchNotificacoes = async () => {
    try {
      const user = await getUser();
      const response = await api.get(`/pedidos-validos?user_id=${user.id}`);
      
      const notifs: Notificacao[] = response.data.pedidos.map((p: any) => ({
        id: p.id,
        pedido: p.tipo,
        estado: p.estado.toLowerCase() as Estado,
      }));
      
      setNotificacoes(notifs);
      // Animação de entrada
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
    } catch (error) {
      console.log("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    aplicarFiltro(notificacoes, filtroEstado);
  }, [notificacoes, filtroEstado]);

  const aplicarFiltro = (notificacoes: Notificacao[], estado: Estado | null) => {
    if (!estado) {
      setNotificacoesFiltradas(notificacoes);
    } else {
      const filtradas = notificacoes.filter(n => n.estado === estado);
      setNotificacoesFiltradas(filtradas);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotificacoes();
  };

  const handleFiltroEstado = (estado: Estado) => {
    const novoFiltro = filtroEstado === estado ? null : estado;
    setFiltroEstado(novoFiltro);
    aplicarFiltro(notificacoes, novoFiltro);
  };

  useEffect(() => {
    fetchNotificacoes();
    const interval = setInterval(fetchNotificacoes, 5000);
    return () => clearInterval(interval);
  }, []);

  const getEstadoIcon = (estado: Estado) => {
    switch(estado) {
      case 'confirmado':
        return 'time-outline';
      case 'lavado':
        return 'checkmark-done-circle-outline';
      case 'recusado':
        return 'close-circle-outline';
    }
  };

  const getEstadoColor = (estado: Estado) => {
    switch(estado) {
      case 'confirmado':
        return '#FF9500';
      case 'lavado':
        return '#34C759';
      case 'recusado':
        return '#FF3B30';
    }
  };
// Adicione esta linha antes de usar estadosValidos

  const getEstadoGradient = (estado: Estado): readonly [string, string] => {
    switch(estado) {
      case 'confirmado':
        return ['#FFF8F0', '#FFEDD5'];
      case 'lavado':
        return ['#F0FFF4', '#E6FFEE'];
      case 'recusado':
        return ['#FFF5F5', '#FFE5E5'];
    }
  };

  const getEstadoLabel = (estado: Estado) => {
    switch(estado) {
      case 'confirmado':
        return 'Confirmado';
      case 'lavado':
        return 'Lavado';
      case 'recusado':
        return 'Recusado';
    }
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, styles.centerContent]}>
        <RNStatusBar backgroundColor="#007AFF" barStyle="light-content" />
        <LinearGradient
          colors={['#007AFF', '#0056CC']}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      {/* Header Azul com Gradiente */}
      <LinearGradient
        colors={['#007AFF', '#0056CC']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Notificações</Text>
            <Text style={styles.subtitle}>Acompanhe o estado dos seus pedidos</Text>
          </View>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificacoesFiltradas.length}</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas Rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statNumber}>
              {notificacoes.filter(n => n.estado === 'confirmado').length}
            </Text>
            <Text style={styles.statLabel}>Confirmados</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-done-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statNumber}>
              {notificacoes.filter(n => n.estado === 'lavado').length}
            </Text>
            <Text style={styles.statLabel}>Lavados</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statNumber}>
              {notificacoes.filter(n => n.estado === 'recusado').length}
            </Text>
            <Text style={styles.statLabel}>Recusados</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosContent}
        >
          <TouchableOpacity 
            style={[styles.filterButton, filtroEstado === "confirmado" && styles.filterActive]} 
            onPress={() => handleFiltroEstado("confirmado")}
          >
            <Ionicons name="time-outline" size={16} color={filtroEstado === "confirmado" ? "#FFFFFF" : "#FF9500"} />
            <Text style={[styles.filterText, filtroEstado === "confirmado" && styles.filterTextActive]}>Confirmado</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterButton, filtroEstado === "lavado" && styles.filterActive]} 
            onPress={() => handleFiltroEstado("lavado")}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color={filtroEstado === "lavado" ? "#FFFFFF" : "#34C759"} />
            <Text style={[styles.filterText, filtroEstado === "lavado" && styles.filterTextActive]}>Lavado</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterButton, filtroEstado === "recusado" && styles.filterActive]} 
            onPress={() => handleFiltroEstado("recusado")}
          >
            <Ionicons name="close-circle-outline" size={16} color={filtroEstado === "recusado" ? "#FFFFFF" : "#FF3B30"} />
            <Text style={[styles.filterText, filtroEstado === "recusado" && styles.filterTextActive]}>Recusado</Text>
          </TouchableOpacity>

          {filtroEstado && (
            <TouchableOpacity 
              style={styles.limparFiltroButton}
              onPress={() => setFiltroEstado(null)}
            >
              <Ionicons name="close-circle" size={16} color="#8E8E93" />
              <Text style={styles.limparFiltroText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {notificacoesFiltradas.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#C7C7CC" />
            </View>
            <Text style={styles.emptyTitle}>
              {filtroEstado ? `Nenhum pedido ${filtroEstado}` : 'Nenhuma notificação'}
            </Text>
            <Text style={styles.emptyText}>
              {filtroEstado 
                ? `Não há pedidos com estado "${getEstadoLabel(filtroEstado)}" no momento`
                : 'Seus pedidos aparecerão aqui quando forem atualizados'
              }
            </Text>
          </View>
        ) : (
          notificacoesFiltradas.map((n, index) => (
            <Animated.View 
              key={n.id} 
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  }],
                },
              ]}
            >
              <LinearGradient
                colors={getEstadoGradient(n.estado)}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={[
                    styles.cardIcon,
                    { backgroundColor: `${getEstadoColor(n.estado)}15` }
                  ]}>
                    <Ionicons 
                      name={getEstadoIcon(n.estado)} 
                      size={24} 
                      color={getEstadoColor(n.estado)} 
                    />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.pedido}>{n.pedido}</Text>
                    <Text style={styles.time}>Pedido #{n.id}</Text>
                  </View>
                </View>
                
                <View style={[
                  styles.estadoBadge,
                  { backgroundColor: getEstadoColor(n.estado) }
                ]}>
                  <Text style={styles.estado}>
                    {getEstadoLabel(n.estado)}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  badgeContainer: {
    marginLeft: 12,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  filtrosContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  filtrosContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  filterActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  limparFiltroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F2F2F7',
    gap: 6,
  },
  limparFiltroText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardContent: {
    flex: 1,
  },
  pedido: {
    fontSize: 18,
    fontWeight: "700",
    color: '#1C1C1E',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  estadoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  estado: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: 'uppercase',
    color: 'white',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    marginTop: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});