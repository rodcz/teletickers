import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type CategoryItem = {
  name: string;
  slug: string;
  icon: string;
  description: string;
};

type CategoryCardProps = {
  category: CategoryItem;
  eventCount: number;
  onPress: (category: CategoryItem) => void;
};

export default function CategoryCard({
  category,
  eventCount,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(category)}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>

      <Text style={styles.title}>{category.name}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {category.description}
      </Text>

      <Text style={styles.count}>
        {eventCount} evento{eventCount !== 1 ? "s" : ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 184,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconCircle: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
  },
  icon: {
    fontSize: 25,
  },
  title: {
    marginTop: 12,
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
  description: {
    marginTop: 7,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
  },
  count: {
    marginTop: "auto",
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
