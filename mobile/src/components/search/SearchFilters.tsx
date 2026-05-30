import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

export type SortBy = 'none' | 'precio' | 'aforo';
export type SortOrder = 'asc' | 'desc';

export interface SearchFiltersValue {
  ciudad: string;
  precio: string;
  categoria: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export const DEFAULT_FILTERS: SearchFiltersValue = {
  ciudad: 'Todas',
  precio: 'all',
  categoria: 'Todos',
  sortBy: 'none',
  sortOrder: 'asc',
};

const CATEGORIAS = [
  'Todos',
  'Concierto',
  'Conferencia',
  'Teatro',
  'Deportes',
  'Festival',
  'Otro',
];

const CIUDADES = [
  'Todas',
  'Lima',
  'Arequipa',
  'Cusco',
  'Trujillo',
  'Chiclayo',
  'Piura',
  'Ica',
];

const PRECIOS = [
  { label: 'Todos', value: 'all' },
  { label: 'Gratis', value: '0' },
  { label: 'Hasta S/ 15', value: '15' },
  { label: 'Hasta S/ 50', value: '50' },
  { label: 'Hasta S/ 100', value: '100' },
  { label: 'Más de S/ 100', value: '100+' },
];

const SORTS: { label: string; value: SortBy }[] = [
  { label: 'Sin orden', value: 'none' },
  { label: '💰 Precio', value: 'precio' },
  { label: '👥 Aforo', value: 'aforo' },
];

/** Cuenta cuántos filtros difieren del valor por defecto. */
export function countActiveFilters(value: SearchFiltersValue): number {
  let count = 0;
  if (value.ciudad !== DEFAULT_FILTERS.ciudad) count += 1;
  if (value.precio !== DEFAULT_FILTERS.precio) count += 1;
  if (value.categoria !== DEFAULT_FILTERS.categoria) count += 1;
  if (value.sortBy !== DEFAULT_FILTERS.sortBy) count += 1;
  return count;
}

type ChipsProps = {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
};

function Chips({ options, selected, onSelect }: ChipsProps) {
  return (
    <View style={styles.chipsRow}>
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type SearchFiltersProps = {
  value: SearchFiltersValue;
  onChange: (next: SearchFiltersValue) => void;
  onApply: () => void;
  onClear: () => void;
};

export default function SearchFilters({
  value,
  onChange,
  onApply,
  onClear,
}: SearchFiltersProps) {
  const set = (partial: Partial<SearchFiltersValue>) =>
    onChange({ ...value, ...partial });

  return (
    <BottomSheetScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Filtros</Text>

      <Text style={styles.label}>Ciudad</Text>
      <Chips
        options={CIUDADES.map((c) => ({ label: c, value: c }))}
        selected={value.ciudad}
        onSelect={(ciudad) => set({ ciudad })}
      />

      <Text style={styles.label}>Categoría</Text>
      <Chips
        options={CATEGORIAS.map((c) => ({ label: c, value: c }))}
        selected={value.categoria}
        onSelect={(categoria) => set({ categoria })}
      />

      <Text style={styles.label}>Precio</Text>
      <Chips
        options={PRECIOS}
        selected={value.precio}
        onSelect={(precio) => set({ precio })}
      />

      <Text style={styles.label}>Ordenar por</Text>
      <Chips
        options={SORTS.map((s) => ({ label: s.label, value: s.value }))}
        selected={value.sortBy}
        onSelect={(sortBy) => set({ sortBy: sortBy as SortBy })}
      />

      {value.sortBy !== 'none' && (
        <Chips
          options={[
            { label: '↑ Ascendente', value: 'asc' },
            { label: '↓ Descendente', value: 'desc' },
          ]}
          selected={value.sortOrder}
          onSelect={(sortOrder) => set({ sortOrder: sortOrder as SortOrder })}
        />
      )}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          style={[styles.actionButton, styles.clearButton]}
          onPress={onClear}
        >
          <Text style={styles.clearText}>Limpiar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.actionButton, styles.applyButton]}
          onPress={onApply}
        >
          <Text style={styles.applyText}>Aplicar</Text>
        </Pressable>
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heading: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  label: {
    marginTop: 18,
    marginBottom: 8,
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  chipText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  clearButton: {
    backgroundColor: '#E2E8F0',
  },
  clearText: {
    color: '#334155',
    fontWeight: '900',
  },
  applyButton: {
    backgroundColor: '#2563EB',
  },
  applyText: {
    color: 'white',
    fontWeight: '900',
  },
});
