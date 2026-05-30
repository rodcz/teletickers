import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type FavoriteEvento = {
  id: string;
  titulo: string;
  descripcion?: string | null;
  fecha: string;
  hora: string;
  region: string;
  provincia: string;
  distrito: string;
  categoria: string;
  aforo: number;
  estado: string;
  miniatura?: string | null;
};

type FavoriteEventCardProps = {
  evento: FavoriteEvento;
  onPress?: (evento: FavoriteEvento) => void;
};

export default function FavoriteEventCard({
  evento,
  onPress,
}: FavoriteEventCardProps) {
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
          <Text style={styles.status}>{evento.estado}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {evento.titulo}
        </Text>

        <Text style={styles.meta}>
          {evento.fecha} · {evento.hora}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {evento.distrito}, {evento.provincia}
        </Text>

        {evento.descripcion ? (
          <Text style={styles.description} numberOfLines={2}>
            {evento.descripcion}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "white",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  image: {
    width: "100%",
    height: 145,
    backgroundColor: "#E2E8F0",
  },
  imagePlaceholder: {
    width: "100%",
    height: 145,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
  },
  imagePlaceholderText: {
    fontSize: 34,
  },
  body: {
    padding: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  category: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  status: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    marginTop: 8,
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  meta: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 13,
  },
  description: {
    marginTop: 9,
    color: "#475569",
    fontSize: 13,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.9,
  },
});
