import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  onPress: () => void;
}

export const EventCard = ({ title, date, imageUrl, onPress }: EventCardProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenMenu = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <>
      <Pressable 
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} 
        onPress={onPress}
      >
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
          contentFit="cover" 
          transition={300}
        />
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Pressable style={styles.menuButton} onPress={handleOpenMenu} hitSlop={15}>
            <Feather name="more-horizontal" size={24} color="#64748b" />
          </Pressable>
        </View>
      </Pressable>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%']}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Acciones</Text>
          <Pressable style={styles.sheetItem}>
            <Text style={styles.sheetItemText}>Publicar Evento</Text>
          </Pressable>
          <Pressable style={[styles.sheetItem, styles.cancelItem]}>
            <Text style={[styles.sheetItemText, styles.cancelText]}>Cancelar Evento</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.04,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#e2e8f0', // placeholder color while loading
  },
  content: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 15,
    color: '#16a34a', // theme primary color for dates
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
  },
  sheetContent: {
    flex: 1,
    padding: 24,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0f172a',
  },
  sheetItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sheetItemText: {
    fontSize: 16,
    color: '#334155',
  },
  cancelItem: {
    borderBottomWidth: 0,
  },
  cancelText: {
    color: '#ef4444',
  },
});
