import React from 'react';
import { FlatList, View, Text, StyleSheet, Dimensions, ListRenderItemInfo } from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32; // 16px margin on each side

export interface BannerProps {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

interface BannerCarouselProps {
  banners?: BannerProps[];
}

const mockBanners: BannerProps[] = [
  { id: '1', imageUrl: 'https://picsum.photos/seed/concert/800/400', title: 'Conciertos en Vivo', subtitle: 'Vive la mejor música en directo' },
  { id: '2', imageUrl: 'https://picsum.photos/seed/teatro/800/400', title: 'Teatro y Cultura', subtitle: 'Descubre las mejores obras' },
  { id: '3', imageUrl: 'https://picsum.photos/seed/cine/800/400', title: 'Festivales y Más', subtitle: 'Experiencias inolvidables' },
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
    <View style={styles.bannerWrapper}>
      <View style={styles.bannerContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image} 
          contentFit="cover" 
          transition={300}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
          <View style={styles.button}>
            <Text style={styles.buttonText}>Explorar Eventos</Text>
          </View>
        </View>
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
        bounces={true}
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
    height: 380,
    backgroundColor: '#f8fafc',
    marginBottom: 24,
    marginTop: 8,
  },
  bannerWrapper: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    height: 380,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    backgroundColor: '#fff',
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  pagination: {
    position: 'absolute',
    bottom: 24,
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
