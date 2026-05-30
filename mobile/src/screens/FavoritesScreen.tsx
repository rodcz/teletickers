import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_EVENTOS_PUBLICADOS } from "../lib/graphql/queries";
import FavoriteEventCard, {
  FavoriteEvento,
} from "../components/favorites/FavoriteEventCard";

const FAVORITES_STORAGE_KEY = "favorites";

type EventosPublicadosData = {
  eventosPublicados: FavoriteEvento[];
};

export default function FavoritesScreen({ navigation }: any) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const { data, loading, error, refetch, networkStatus } =
    useQuery<EventosPublicadosData>(GET_EVENTOS_PUBLICADOS, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    });

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      const parsed = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavoriteIds(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const removeFavorite = async (eventoId: string) => {
    const updatedFavorites = favoriteIds.filter((id) => id !== eventoId);
    await AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(updatedFavorites)
    );
    setFavoriteIds(updatedFavorites);
  };

  const eventos = data?.eventosPublicados ?? [];

  const favoritos = useMemo(
    () => eventos.filter((evento: any) => favoriteIds.includes(evento.id)),
    [eventos, favoriteIds]
  );

  const upcomingCount = useMemo(
    () =>
      favoritos.filter((evento: any) => {
        const eventDate = new Date(evento.fecha);
        return !Number.isNaN(eventDate.getTime()) && eventDate > new Date();
      }).length,
    [favoritos]
  );

  const isRefreshing = networkStatus === 4;

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando tus favoritos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error al cargar favoritos</Text>
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
        data={favoritos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => refetch()} />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Mis Favoritos</Text>
            <Text style={styles.subtitle}>
              Eventos que guardaste para más tarde
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{favoritos.length}</Text>
                <Text style={styles.statLabel}>Total favoritos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {new Set(favoritos.map((evento: any) => evento.categoria)).size}
                </Text>
                <Text style={styles.statLabel}>Categorías</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{upcomingCount}</Text>
                <Text style={styles.statLabel}>Próximos</Text>
              </View>
            </View>

            <Text style={styles.swipeHint}>
              Desliza un favorito hacia la izquierda para eliminarlo.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No tienes favoritos aún</Text>
            <Text style={styles.emptyText}>
              Explora eventos y guarda tus favoritos para verlos después.
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
          <Swipeable
            overshootRight={false}
            renderRightActions={() => (
              <Pressable
                accessibilityRole="button"
                style={styles.deleteAction}
                onPress={() => removeFavorite(item.id)}
              >
                <Text style={styles.deleteActionText}>Eliminar</Text>
              </Pressable>
            )}
          >
            <FavoriteEventCard
              evento={item}
              onPress={(evento) =>
                navigation?.navigate?.("EventDetail", { id: evento.id })
              }
            />
          </Swipeable>
        )}
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
    marginBottom: 14,
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
  swipeHint: {
    marginBottom: 12,
    color: "#64748B",
    fontSize: 13,
  },
  deleteAction: {
    width: 104,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#DC2626",
    marginBottom: 12,
  },
  deleteActionText: {
    color: "white",
    fontWeight: "900",
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
