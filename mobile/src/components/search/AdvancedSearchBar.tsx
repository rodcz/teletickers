import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SEARCH_EVENTOS } from '../../lib/graphql/queries';

type SuggestionsData = {
  searchEventos: { id: string; titulo: string }[];
};

type AdvancedSearchBarProps = {
  /** Se invoca con el texto ya "debounced" (o al tocar una sugerencia). */
  onSearch: (text: string) => void;
  /** Abre el Bottom Sheet de filtros. */
  onOpenFilters: () => void;
  /** Número de filtros activos para mostrar en el badge. */
  activeFilterCount?: number;
};

const DEBOUNCE_MS = 400;

export default function AdvancedSearchBar({
  onSearch,
  onOpenFilters,
  activeFilterCount = 0,
}: AdvancedSearchBarProps) {
  const [text, setText] = useState('');
  const [debounced, setDebounced] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce manual de 400ms para no sobrecargar el endpoint de GraphQL.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(text.trim());
      onSearch(text.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [text, onSearch]);

  const { data } = useQuery<SuggestionsData>(SEARCH_EVENTOS, {
    variables: { query: debounced },
    skip: debounced.length < 2,
  });

  const suggestions = (data?.searchEventos ?? [])
    .map((e) => e.titulo)
    .slice(0, 4);

  const selectSuggestion = (suggestion: string) => {
    setText(suggestion);
    setDebounced(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss();
    onSearch(suggestion);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Buscar eventos..."
            placeholderTextColor="#94A3B8"
            value={text}
            autoCapitalize="none"
            returnKeyType="search"
            onChangeText={(value) => {
              setText(value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onSubmitEditing={() => {
              setShowSuggestions(false);
              onSearch(text.trim());
            }}
          />
          {text.length > 0 && (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => {
                setText('');
                setDebounced('');
                onSearch('');
              }}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}
          onPress={onOpenFilters}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <Pressable
              key={`${suggestion}-${index}`}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.suggestionItem,
                pressed && styles.suggestionPressed,
              ]}
              onPress={() => selectSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText} numberOfLines={1}>
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  clearIcon: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  filterButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#16A34A',
  },
  filterIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '900',
  },
  suggestions: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionPressed: {
    backgroundColor: '#F0FDF4',
  },
  suggestionText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
