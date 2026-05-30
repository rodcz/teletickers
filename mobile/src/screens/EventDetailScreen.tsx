import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import { GET_EVENTO } from '../lib/graphql/queries';
import type { Evento } from '../types';

type EventoData = { evento: Evento };

export default function EventDetailScreen({ route, navigation }: any) {
  const id: string | undefined = route?.params?.id;

  const { data, loading, error } = useQuery<EventoData>(GET_EVENTO, {
    variables: { id },
    skip: !id,
  });

  const evento = data?.evento;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable hitSlop={10} onPress={() => navigation?.goBack?.()}>
          <Text style={styles.back}>‹ Volver</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : error || !evento ? (
        <View style={styles.center}>
          <Text style={styles.title}>Evento no disponible</Text>
          <Text style={styles.muted}>
            {error?.message ?? 'No se encontró el evento solicitado.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {evento.miniatura ? (
            <Image source={{ uri: evento.miniatura }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>🎟️</Text>
            </View>
          )}
          <Text style={styles.category}>{evento.categoria}</Text>
          <Text style={styles.title}>{evento.titulo}</Text>
          <Text style={styles.meta}>
            📅 {evento.fecha} · 🕐 {evento.hora}
          </Text>
          <Text style={styles.meta}>
            📍 {evento.distrito}, {evento.provincia}, {evento.region}
          </Text>
          <Text style={styles.meta}>👥 Aforo: {evento.aforo}</Text>
          {evento.descripcion ? (
            <Text style={styles.description}>{evento.descripcion}</Text>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { paddingHorizontal: 16, paddingVertical: 10 },
  back: { color: '#2563EB', fontSize: 16, fontWeight: '800' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: { padding: 16, paddingBottom: 40 },
  image: { width: '100%', height: 200, borderRadius: 18, backgroundColor: '#E2E8F0' },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  imagePlaceholderText: { fontSize: 44 },
  category: {
    marginTop: 16,
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 6,
    color: '#111827',
    fontSize: 24,
    fontWeight: '900',
  },
  meta: { marginTop: 8, color: '#475569', fontSize: 15 },
  description: {
    marginTop: 16,
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
  },
  muted: { marginTop: 8, color: '#64748B', textAlign: 'center' },
});
