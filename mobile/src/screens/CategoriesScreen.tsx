import React, { useMemo } from "react";
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
import { useQuery } from "@apollo/client";
import { GET_EVENTOS_PUBLICADOS } from "../lib/graphql/queries";
import CategoryCard, {
  CategoryItem,
} from "../components/categories/CategoryCard";

type EventoCategoria = {
  id: string;
  categoria: string;
};

type EventosPublicadosData = {
  eventosPublicados: EventoCategoria[];
};

const CATEGORIES: CategoryItem[] = [
  {
    name: "Conciertos",
    slug: "concierto",
    icon: "🎵",
    description: "Disfruta de la mejor música en vivo",
  },
  {
    name: "Teatro",
    slug: "teatro",
    icon: "🎭",
    description: "Las mejores obras y presentaciones",
  },
  {
    name: "Deportes",
    slug: "deportes",
    icon: "⚽",
    description: "Partidos y eventos deportivos",
  },
  {
    name: "Conferencias",
    slug: "conferencia",
    icon: "🎤",
    description: "Aprende con expertos del sector",
  },
  {
    name: "Festivales",
    slug: "festival",
    icon: "🎪",
    description: "Experiencias únicas y memorables",
  },
  {
    name: "Arte y Cultura",
    slug: "otro",
    icon: "🎨",
    description: "Exposiciones y eventos culturales",
  },
];

export default function CategoriesScreen({ navigation }: any) {
  const { data, loading, error, refetch, networkStatus } =
    useQuery<EventosPublicadosData>(GET_EVENTOS_PUBLICADOS, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    });

  const eventos = data?.eventosPublicados ?? [];

  const countsByCategory = useMemo(() => {
    return CATEGORIES.reduce<Record<string, number>>((acc, category) => {
      acc[category.slug] = eventos.filter(
        (evento: any) =>
          evento.categoria?.trim().toLowerCase() ===
          category.slug.trim().toLowerCase()
      ).length;
      return acc;
    }, {});
  }, [eventos]);

  const isRefreshing = networkStatus === 4;

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error al cargar categorías</Text>
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
        data={CATEGORIES}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => refetch()} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Explora por Categorías</Text>
            <Text style={styles.subtitle}>
              Encuentra el evento perfecto para ti
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>¿No encuentras lo que buscas?</Text>
            <Text style={styles.footerText}>
              Usa la búsqueda avanzada para encontrar eventos por ubicación,
              precio y más filtros personalizados.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={styles.footerButton}
              onPress={() => navigation?.navigate?.("Search")}
            >
              <Text style={styles.footerButtonText}>Ir a búsqueda avanzada</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            eventCount={countsByCategory[item.slug] ?? 0}
            onPress={(category) =>
              navigation?.navigate?.("Search", { categoria: category.slug })
            }
          />
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
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
  },
  header: {
    marginBottom: 4,
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
  footerCard: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: "#111827",
    padding: 18,
  },
  footerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
  },
  footerText: {
    marginTop: 8,
    color: "#CBD5E1",
    lineHeight: 20,
  },
  footerButton: {
    marginTop: 16,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#16A34A",
    paddingVertical: 12,
  },
  footerButtonText: {
    color: "white",
    fontWeight: "900",
  },
});
