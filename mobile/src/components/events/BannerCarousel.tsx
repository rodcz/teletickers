import React from 'react';
import { FlatList, View, Text, StyleSheet, Dimensions, ListRenderItemInfo } from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export interface BannerProps {
  id: string;
  imageUrl: string;
  title: string;
}

interface BannerCarouselProps {
  banners?: BannerProps[];
}

const mockBanners: BannerProps[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1540039155733-d71efd45160b?q=80&w=800&auto=format&fit=crop', title: 'Gran Concierto de Verano' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1507676184212-d0330a151f84?q=80&w=800&auto=format&fit=crop', title: 'Obra de Teatro Clásica' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop', title: 'Festival de Cine Independiente' },
];

export const BannerCarousel = ({ banners = mockBanners }: BannerCarouselProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = React.useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }: ListRenderItemInfo<BannerProps>) => (
    <View style={styles.bannerContainer}>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.image} 
        contentFit="cover" 
        transition={300}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={banners}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        snapToAlignment="center"
      />
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index.toString()}
            style={[
              styles.dot,
              activeIndex === index && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 220,
    backgroundColor: '#f8fafc',
    marginBottom: 16,
  },
  bannerContainer: {
    width,
    height: 220,
    justifyContent: 'flex-end',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pagination: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#ffffff',
  },
});
