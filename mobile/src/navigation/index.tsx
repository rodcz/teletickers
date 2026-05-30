import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HelpScreen from '../screens/HelpScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Search: '🔍',
  Categories: '🗂️',
  MyTickets: '🎫',
  Favorites: '❤️',
  Profile: '👤',
};

function tabIcon(routeName: string) {
  return ({ color }: { color: string }) => (
    <Text style={{ fontSize: 18, color }}>{TAB_ICONS[routeName] ?? '•'}</Text>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: tabIcon(route.name),
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      })}
    >
      <Tabs.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Buscar' }}
      />
      <Tabs.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categorías' }}
      />
      <Tabs.Screen
        name="MyTickets"
        component={MyTicketsScreen}
        options={{ title: 'Mis Tickets' }}
      />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tabs.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Tabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: 'Centro de ayuda' }}
      />
      <AppStack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{ title: 'Configuración de cuenta' }}
      />
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return token ? <AppNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
});
