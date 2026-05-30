import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { GET_DASHBOARD_METRICS } from '../lib/graphql/queries';
import { AuthContext } from '../navigation/RootNavigator';
import { useContext } from 'react';

interface DashboardMetrics {
  totalEventos: number;
  totalVentas: number;
  ingresosTotales: number;
  eventosActivos: number;
}

interface DashboardData {
  dashboardMetrics: DashboardMetrics;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Datos simulados (mismos que la versión web), remodelados a la interfaz de chart-kit.
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const VENTAS = [45, 52, 61, 78, 85, 92];
const INGRESOS = [2400, 3200, 3800, 4500, 5200, 6100];

const VENTAS_POR_CATEGORIA = [
  { name: 'Conciertos', value: 35 },
  { name: 'Teatro', value: 20 },
  { name: 'Deportes', value: 18 },
  { name: 'Conferencias', value: 15 },
  { name: 'Festivales', value: 12 },
];

const EVENTOS_POPULARES = [
  { nombre: 'Concierto Rock Nacional', ventas: 245, ingresos: 12250 },
  { nombre: 'Festival de Verano 2024', ventas: 189, ingresos: 9450 },
  { nombre: 'Teatro: La Casa de Bernarda', ventas: 156, ingresos: 4680 },
  { nombre: 'Conferencia Tech Summit', ventas: 134, ingresos: 6700 },
  { nombre: 'Partido Clásico Peruano', ventas: 98, ingresos: 4900 },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 32; // padding horizontal 16 a cada lado

const baseChartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  propsForDots: { r: '4', strokeWidth: '2' },
  propsForBackgroundLines: { stroke: '#E2E8F0' },
};

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useContext(AuthContext) as { user: any, signOut: () => Promise<void> };
  const { data, loading } = useQuery<DashboardData>(GET_DASHBOARD_METRICS, {
    fetchPolicy: 'cache-and-network',
  });

  const metrics = data?.dashboardMetrics;

  // PieChart espera un arreglo con { name, population, color, legendFontColor, legendFontSize }.
  const pieData = useMemo(
    () =>
      VENTAS_POR_CATEGORIA.map((item, index) => ({
        name: item.name,
        population: item.value,
        color: COLORS[index % COLORS.length],
        legendFontColor: '#475569',
        legendFontSize: 12,
      })),
    []
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Sesión no encontrada</Text>
        <Pressable style={styles.retryButton} onPress={() => signOut()}>
          <Text style={styles.retryText}>Iniciar sesión</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const initial = user.nombre?.charAt(0).toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header con info del usuario */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.nombre}</Text>
            <Text style={styles.profileMeta}>{user.email}</Text>
            <Text style={styles.profileMeta}>DNI: {user.dni}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Eventos"
            value={metrics?.totalEventos ?? 0}
            accent="#3B82F6"
            icon="🗓️"
          />
          <StatCard
            label="Total Ventas"
            value={metrics?.totalVentas ?? 0}
            accent="#10B981"
            icon="🎫"
          />
          <StatCard
            label="Ingresos Totales"
            value={`S/ ${metrics?.ingresosTotales ?? 0}`}
            accent="#F59E0B"
            icon="💰"
          />
          <StatCard
            label="Eventos Activos"
            value={metrics?.eventosActivos ?? 0}
            accent="#8B5CF6"
            icon="📈"
          />
        </View>

        {loading && !data && (
          <View style={styles.inlineLoading}>
            <ActivityIndicator />
            <Text style={styles.muted}>Cargando métricas…</Text>
          </View>
        )}

        {/* Balance Mensual (ventas) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Balance Mensual</Text>
          <LineChart
            data={{ labels: MESES, datasets: [{ data: VENTAS }] }}
            width={CHART_WIDTH}
            height={220}
            chartConfig={{
              ...baseChartConfig,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Ganancia Mensual (ingresos) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ganancia Mensual</Text>
          <LineChart
            data={{ labels: MESES, datasets: [{ data: INGRESOS }] }}
            width={CHART_WIDTH}
            height={220}
            chartConfig={{
              ...baseChartConfig,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Ventas por Categoría (pie) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ventas por Categoría</Text>
          <PieChart
            data={pieData}
            width={CHART_WIDTH}
            height={220}
            chartConfig={baseChartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="8"
            absolute={false}
          />
        </View>

        {/* Eventos Populares */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Eventos Populares</Text>
          {EVENTOS_POPULARES.map((evento, index) => (
            <View key={evento.nombre} style={styles.popularRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.popularInfo}>
                <Text style={styles.popularName} numberOfLines={1}>
                  {evento.nombre}
                </Text>
                <Text style={styles.popularMeta}>
                  {evento.ventas} tickets vendidos
                </Text>
              </View>
              <Text style={styles.popularIngresos}>
                S/ {evento.ingresos.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.helpLink}
          onPress={() => navigation?.navigate?.('Help')}
        >
          <Text style={styles.helpLinkText}>¿Necesitas ayuda? Centro de ayuda</Text>
        </Pressable>

        <Pressable style={styles.signOutButton} onPress={() => signOut()}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  accent: string;
  icon: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${accent}22` }]}>
        <Text style={styles.statIconText}>{icon}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 20,
    backgroundColor: '#16A34A',
    padding: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#16A34A',
    fontSize: 32,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
  },
  profileMeta: {
    color: '#DCFCE7',
    fontSize: 13,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    width: (SCREEN_WIDTH - 32 - 12) / 2,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIconText: {
    fontSize: 18,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  muted: {
    color: '#64748B',
  },
  chartCard: {
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  chartTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
    marginLeft: -8,
  },
  popularRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: 'white',
    fontWeight: '900',
  },
  popularInfo: {
    flex: 1,
  },
  popularName: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  },
  popularMeta: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  popularIngresos: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '900',
  },
  helpLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  helpLinkText: {
    color: '#2563EB',
    fontWeight: '800',
  },
  signOutButton: {
    marginTop: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
  },
  signOutText: {
    color: '#DC2626',
    fontWeight: '900',
  },
  errorTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryText: {
    color: 'white',
    fontWeight: '800',
  },
});
