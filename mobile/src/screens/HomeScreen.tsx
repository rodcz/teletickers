import React, { useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, ListRenderItemInfo, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import { GET_EVENTOS_PUBLICADOS } from '../lib/graphql/queries';
import { EventCard } from '../components/events/EventCard';
import { BannerCarousel } from '../components/events/BannerCarousel';
import type { Evento } from '../types';

type EventosData = {
  eventosPublicados: Evento[];
};

export const HomeScreen = ({ navigation }: any) => {
  const { data, loading, refetch } = useQuery<EventosData>(GET_EVENTOS_PUBLICADOS, {
    fetchPolicy: 'cache-and-network',
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderItem = ({ item }: ListRenderItemInfo<Evento>) => (
    <EventCard 
      id={item.id}
      title={item.titulo}
      date={item.fecha}
      imageUrl={item.miniatura || 'https://picsum.photos/seed/evento/800/400'}
      onPress={() => navigation?.navigate?.('EventDetail', { id: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={data?.eventosPublicados ?? []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>
            {/* Header / Search Placeholder tipo Apple */}
            <View style={styles.header}>
              <Text style={styles.largeTitle}>Descubrir</Text>
              <Pressable 
                style={styles.searchBar} 
                onPress={() => navigation?.navigate?.('Search')}
              >
                <Text style={styles.searchIcon}>🔍</Text>
                <Text style={styles.searchText}>Buscar eventos, artistas o lugares</Text>
              </Pressable>
            </View>

            <BannerCarousel />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recomendados para ti</Text>
              <Pressable onPress={() => navigation?.navigate?.('Search')}>
                <Text style={styles.seeAll}>Ver todos</Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <Text style={styles.emptyText}>Cargando los mejores eventos...</Text>
            ) : (
              <Text style={styles.emptyText}>No hay eventos disponibles aún.</Text>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={onRefresh} 
            tintColor="#3b82f6" 
            colors={['#3b82f6']} 
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16a34a',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
});
