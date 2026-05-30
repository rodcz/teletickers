import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, ListRenderItemInfo, SafeAreaView } from 'react-native';
import { EventCard } from '../components/events/EventCard';
import { BannerCarousel } from '../components/events/BannerCarousel';

const mockEvents = [
  { id: '101', title: 'Concierto de Rock en Vivo', date: '25 Oct 2026', imageUrl: 'https://images.unsplash.com/photo-1540039155733-d71efd45160b?q=80&w=800&auto=format&fit=crop' },
  { id: '102', title: 'Obra de Teatro: Hamlet', date: '02 Nov 2026', imageUrl: 'https://images.unsplash.com/photo-1507676184212-d0330a151f84?q=80&w=800&auto=format&fit=crop' },
  { id: '103', title: 'Festival Internacional de Cine', date: '15 Nov 2026', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop' },
];

export const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState(mockEvents);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: Replace with actual Apollo GraphQL refetch
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderItem = ({ item }: ListRenderItemInfo<typeof mockEvents[0]>) => (
    <EventCard 
      id={item.id}
      title={item.title}
      date={item.date}
      imageUrl={item.imageUrl}
      onPress={() => console.log('Navigate to details', item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={<BannerCarousel />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
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
  listContent: {
    paddingBottom: 24,
  },
});
