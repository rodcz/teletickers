// navigation/TabNavigator.tsx
// MIGRACIÓN de: frontend/src/components/ui/BottomNav.tsx
// Usa @react-navigation/bottom-tabs + @expo/vector-icons (Ionicons)
// Elimina: window.location.pathname, SVG raw, className, href

import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../styles/theme';

// ── Importar pantallas ──────────────────────────────────────────────────────
// Rodrigo: HomeScreen, MyEventsScreen
// Josue: SearchScreen, ProfileScreen
// Daniel: MyTicketsScreen
// Pantallas aún no implementadas por los compañeros → placeholders por ahora
import MyTicketsScreen from '../screens/MyTicketsScreen';

// Placeholders para pantallas de otros compañeros (se reemplazarán con los merges del equipo)
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: colors.textSecondary, fontSize: typography.base }}>{name}</Text>
  </View>
);
const HomeScreen = () => <PlaceholderScreen name="Inicio — Rodrigo" />;
const SearchScreen = () => <PlaceholderScreen name="Buscar — Josue" />;
const MyEventsScreen = () => <PlaceholderScreen name="Mis Eventos — Rodrigo" />;
const ProfileScreen = () => <PlaceholderScreen name="Perfil — Josue" />;

// ── Tipos de navegación ─────────────────────────────────────────────────────
export type TabParamList = {
  Inicio: undefined;
  Buscar: undefined;
  Tickets: undefined;
  Eventos: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// ── Definición de tabs (equivalente al navItems[] del BottomNav web) ────────
type TabConfig = {
  name: keyof TabParamList;
  label: string;
  iconActive: React.ComponentProps<typeof Ionicons>['name'];
  iconInactive: React.ComponentProps<typeof Ionicons>['name'];
  component: React.ComponentType<any>;
};

const TAB_CONFIG: TabConfig[] = [
  {
    name: 'Inicio',
    label: 'Inicio',
    iconActive: 'home',
    iconInactive: 'home-outline',
    component: HomeScreen,
  },
  {
    name: 'Buscar',
    label: 'Buscar',
    iconActive: 'search',
    iconInactive: 'search-outline',
    component: SearchScreen,
  },
  {
    name: 'Tickets',
    label: 'Tickets',
    iconActive: 'ticket',
    iconInactive: 'ticket-outline',
    component: MyTicketsScreen,
  },
  {
    name: 'Eventos',
    label: 'Eventos',
    iconActive: 'calendar',
    iconInactive: 'calendar-outline',
    component: MyEventsScreen,
  },
  {
    name: 'Perfil',
    label: 'Perfil',
    iconActive: 'person',
    iconInactive: 'person-outline',
    component: ProfileScreen,
  },
];

// ── Componente TabNavigator ─────────────────────────────────────────────────
export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: Math.max(insets.bottom, spacing.sm) },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const tab = TAB_CONFIG.find((t) => t.name === route.name);
          const iconName = focused ? tab?.iconActive : tab?.iconInactive;
          return (
            <View style={focused ? styles.iconContainerActive : styles.iconContainer}>
              <Ionicons
                name={iconName ?? 'ellipse-outline'}
                size={size}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      {TAB_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label }}
        />
      ))}
    </Tab.Navigator>
  );
}

// ── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.OS === 'ios' ? 72 : 64,
    paddingTop: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tabLabel: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 28,
    borderRadius: 8,
  },
  iconContainerActive: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 28,
    borderRadius: 8,
    backgroundColor: `${colors.primary}22`, // primary con 13% opacidad
  },
});
