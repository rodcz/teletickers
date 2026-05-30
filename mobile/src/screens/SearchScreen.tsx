import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  GET_EVENTOS_PUBLICADOS,
  SEARCH_EVENTOS,
} from '../lib/graphql/queries';
import { sortEventsByAforo, sortEventsByPrice } from '../utils/radixSortWasm';
import AdvancedSearchBar from '../components/search/AdvancedSearchBar';
import SearchFilters, {
  countActiveFilters,
  DEFAULT_FILTERS,
  type SearchFiltersValue,
} from '../components/search/SearchFilters';
import EventCard from '../components/events/EventCard';
import type { Evento } from '../types';

type EventosData = {
  searchEventos?: Evento[];
  eventosPublicados?: Evento[];
};

export default function SearchScreen({ navigation, route }: any) {
  const initialCategoria: string = route?.params?.categoria ?? DEFAULT_FILTERS.categoria;

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersValue>({
    ...DEFAULT_FILTERS,
    categoria: initialCategoria,
  });
  // Borrador editable dentro del Bottom Sheet (se aplica al pulsar "Aplicar").
  const [draftFilters, setDraftFilters] = useState<SearchFiltersValue>(filters);
  const [results, setResults] = useState<Evento[]>([]);
  const [sorting, setSorting] = useState(false);

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%', '90%'], []);

  const { data, loading, error, refetch } = useQuery<EventosData>(
    query ? SEARCH_EVENTOS : GET_EVENTOS_PUBLICADOS,
    {
      variables: query ? { query } : undefined,
      fetchPolicy: 'cache-and-network',
    }
  );

  // Aplica filtros de cliente (ciudad/categoría) + orden (aforo/precio vía radixSort).
  useEffect(() => {
    let cancelled = false;

    const apply = async () => {
      const base = data?.searchEventos ?? data?.eventosPublicados ?? [];
      let eventos = [...base];

      if (filters.ciudad !== DEFAULT_FILTERS.ciudad) {
        eventos = eventos.filter(
          (e) =>
            e.region === filters.ciudad ||
            e.provincia === filters.ciudad ||
            e.distrito === filters.ciudad
        );
      }

      if (filters.categoria !== DEFAULT_FILTERS.categoria) {
        eventos = eventos.filter(
          (e) => e.categoria?.toLowerCase() === filters.categoria.toLowerCase()
        );
      }

      if (filters.sortBy !== 'none') {
        setSorting(true);
        const ascending = filters.sortOrder === 'asc';
        eventos =
          filters.sortBy === 'precio'
            ? await sortEventsByPrice(eventos, ascending)
            : await sortEventsByAforo(eventos, ascending);
      }

      if (!cancelled) {
        setResults(eventos);
        setSorting(false);
      }
    };

    apply();
    return () => {
      cancelled = true;
    };
  }, [data, filters]);

  const openFilters = useCallback(() => {
    setDraftFilters(filters);
    sheetRef.current?.present();
  }, [filters]);

  const applyFilters = useCallback(() => {
    setFilters(draftFilters);
    sheetRef.current?.dismiss();
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    sheetRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const activeFilters = countActiveFilters(filters);

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (filters.ciudad !== DEFAULT_FILTERS.ciudad) chips.push(`📍 ${filters.ciudad}`);
    if (filters.categoria !== DEFAULT_FILTERS.categoria)
      chips.push(`🎭 ${filters.categoria}`);
    if (filters.precio !== DEFAULT_FILTERS.precio)
      chips.push(filters.precio === '0' ? '💰 Gratis' : `💰 Hasta S/ ${filters.precio}`);
    if (filters.sortBy !== 'none')
      chips.push(
        `${filters.sortBy === 'precio' ? '💰 Precio' : '👥 Aforo'} ${
          filters.sortOrder === 'asc' ? '↑' : '↓'
        }`
      );
    return chips;
  }, [filters]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {query ? `Resultados para "${query}"` : 'Buscar eventos'}
        </Text>
        <AdvancedSearchBar
          onSearch={setQuery}
          onOpenFilters={openFilters}
          activeFilterCount={activeFilters}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.count}>
              {results.length}{' '}
              {results.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
              {sorting ? ' · ordenando…' : ''}
            </Text>
            {activeChips.length > 0 && (
              <View style={styles.chipsRow}>
                {activeChips.map((chip) => (
                  <View key={chip} style={styles.activeChip}>
                    <Text style={styles.activeChipText}>{chip}</Text>
                  </View>
                ))}
                <Pressable onPress={clearFilters} hitSlop={6}>
                  <Text style={styles.clearLink}>Limpiar filtros</Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            evento={item}
            onPress={(evento) =>
              navigation?.navigate?.('EventDetail', { id: evento.id })
            }
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" />
              <Text style={styles.muted}>Buscando eventos...</Text>
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorTitle}>Error al buscar eventos</Text>
              <Text style={styles.muted}>{error.message}</Text>
              <Pressable style={styles.retryButton} onPress={() => refetch()}>
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.errorTitle}>No encontramos eventos</Text>
              <Text style={styles.muted}>
                Intenta ajustar tus filtros o realiza una nueva búsqueda.
              </Text>
            </View>
          )
        }
      />

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <SearchFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  listHeader: {
    marginBottom: 12,
  },
  count: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  activeChip: {
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  activeChipText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '800',
  },
  clearLink: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  muted: {
    marginTop: 8,
    color: '#64748B',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 8,
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
