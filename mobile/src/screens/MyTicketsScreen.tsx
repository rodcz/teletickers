import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useQuery } from "@apollo/client/react";
import { GET_MIS_COMPRAS } from "../lib/graphql/queries";
import QRCodeModal from "../components/tickets/QRCodeModal";
import TicketCard, { CompraTicket } from "../components/tickets/TicketCard";

type MisComprasData = {
  misCompras: CompraTicket[];
};

type TicketFilter = "pagado" | "pendiente" | "cancelado";

const FILTERS: { key: TicketFilter; label: string }[] = [
  { key: "pagado", label: "Activos" },
  { key: "pendiente", label: "Pendientes" },
  { key: "cancelado", label: "Historial" },
];

export default function MyTicketsScreen({ navigation }: any) {
  const [selectedFilter, setSelectedFilter] = useState<TicketFilter>("pagado");
  const [selectedTicket, setSelectedTicket] = useState<CompraTicket | null>(null);

  const { data, loading, error, refetch, networkStatus } = useQuery<MisComprasData>(
    GET_MIS_COMPRAS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    }
  );

  const compras = data?.misCompras ?? [];

  const counters = useMemo(
    () => ({
      pagado: compras.filter((item) => item.estadoPago === "pagado").length,
      pendiente: compras.filter((item) => item.estadoPago === "pendiente").length,
      cancelado: compras.filter((item) => item.estadoPago === "cancelado").length,
      total: compras.length,
    }),
    [compras]
  );

  const filteredTickets = useMemo(
    () => compras.filter((item) => item.estadoPago === selectedFilter),
    [compras, selectedFilter]
  );

  const isRefreshing = networkStatus === 4;

  const qrPayload = selectedTicket
    ? JSON.stringify({
        compraId: selectedTicket.id,
        eventoId: selectedTicket.eventoId,
        estadoPago: selectedTicket.estadoPago,
      })
    : "";

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando tus tickets...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error al cargar tickets</Text>
        <Text style={styles.errorText}>{error.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => refetch()} />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Mis Tickets</Text>
            <Text style={styles.subtitle}>Todos tus boletos en un solo lugar</Text>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{counters.pagado}</Text>
                <Text style={styles.statLabel}>Activos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{counters.pendiente}</Text>
                <Text style={styles.statLabel}>Pendientes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{counters.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>

            <View style={styles.tabs}>
              {FILTERS.map((filter) => {
                const active = selectedFilter === filter.key;
                return (
                  <Pressable
                    key={filter.key}
                    style={[styles.tab, active && styles.tabActive]}
                    onPress={() => setSelectedFilter(filter.key)}
                  >
                    <Text style={[styles.tabText, active && styles.tabTextActive]}>
                      {filter.label} ({counters[filter.key]})
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No tienes tickets en esta sección</Text>
            <Text style={styles.emptyText}>
              Explora eventos y compra tus primeras entradas.
            </Text>
            <Pressable
              style={styles.exploreButton}
              onPress={() => navigation?.navigate?.("Search")}
            >
              <Text style={styles.exploreText}>Explorar eventos</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <TicketCard compra={item} onShowQR={setSelectedTicket} />
        )}
      />

      <QRCodeModal
        visible={selectedTicket !== null}
        value={qrPayload}
        onClose={() => setSelectedTicket(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    padding: 24,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 15,
  },
  loadingText: {
    marginTop: 12,
    color: "#475569",
  },
  errorTitle: {
    color: "#991B1B",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  errorText: {
    marginTop: 8,
    color: "#475569",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryText: {
    color: "white",
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "white",
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statValue: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 2,
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
  },
  tabTextActive: {
    color: "white",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 52,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 8,
    color: "#64748B",
    lineHeight: 20,
    textAlign: "center",
  },
  exploreButton: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  exploreText: {
    color: "white",
    fontWeight: "900",
  },
});
