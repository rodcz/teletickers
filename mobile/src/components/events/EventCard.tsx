import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Evento } from '../../types';

type EventCardProps = {
  evento: Evento;
  onPress?: (evento: Evento) => void;
};

const ESTADO_COLOR: Record<string, string> = {
  publicado: '#16A34A',
  borrador: '#CA8A04',
  cancelado: '#DC2626',
  finalizado: '#2563EB',
};

export default function EventCard({ evento, onPress }: EventCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress?.(evento)}
    >
      {evento.miniatura ? (
        <Image source={{ uri: evento.miniatura }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🎟️</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.category}>{evento.categoria}</Text>
          <Text
            style={[
              styles.status,
              { color: ESTADO_COLOR[evento.estado] ?? '#64748B' },
            ]}
          >
            {evento.estado}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {evento.titulo}
        </Text>

        {evento.descripcion ? (
          <Text style={styles.description} numberOfLines={2}>
            {evento.descripcion}
          </Text>
        ) : null}

        <Text style={styles.meta}>
          📅 {evento.fecha} · 🕐 {evento.hora}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.meta} numberOfLines={1}>
            📍 {evento.distrito}, {evento.provincia}
          </Text>
          <Text style={styles.aforo}>👥 {evento.aforo}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: 'white',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: 145,
    backgroundColor: '#E2E8F0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 145,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  imagePlaceholderText: {
    fontSize: 34,
  },
  body: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  category: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  status: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  title: {
    marginTop: 8,
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  description: {
    marginTop: 7,
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    marginTop: 7,
    color: '#64748B',
    fontSize: 13,
    flexShrink: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  aforo: {
    marginTop: 7,
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
