// navigation/RootNavigator.tsx
// Stack raíz que decide qué mostrar según el estado de autenticación.
// REEMPLAZA: window.location.href = '/' (web) → React Navigation renderiza automáticamente
// el stack correcto basado en el estado de sesión global.

import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/theme';
import { SESSION_TOKEN_KEY } from '../lib/apollo-client';

// Importar navegadores y pantallas de auth (Fabrizzio)
import TabNavigator from './TabNavigator';

// Placeholders de pantallas de auth → serán reemplazadas por Fabrizzio
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// ── Tipos de navegación ─────────────────────────────────────────────────────
export type RootStackParamList = {
  // Auth stack (sin sesión)
  Login: undefined;
  Register: undefined;
  // App stack (con sesión)
  MainTabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// ── Contexto de Auth ────────────────────────────────────────────────────────
// Permite que las pantallas de auth notifiquen al RootNavigator
// cuando el usuario inicia o cierra sesión.
interface AuthContextValue {
  signIn: (token: string, user: object) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextValue>({
  signIn: async () => {},
  signOut: async () => {},
});

// ── RootNavigator ───────────────────────────────────────────────────────────
export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay sesión activa al iniciar la app
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem(SESSION_TOKEN_KEY);
        setIsAuthenticated(!!token);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Función para iniciar sesión (llamada por LoginScreen / RegisterScreen)
  const signIn = useCallback(async (token: string, user: object) => {
    await AsyncStorage.multiSet([
      [SESSION_TOKEN_KEY, token],
      ['user', JSON.stringify(user)],
    ]);
    setIsAuthenticated(true);
  }, []);

  // Función para cerrar sesión (llamada por AppHeader / ProfileScreen)
  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([SESSION_TOKEN_KEY, 'user']);
    setIsAuthenticated(false);
  }, []);

  // Spinner mientras carga la sesión
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // ── App Stack (usuario autenticado) ──────────────────────────────
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        ) : (
          // ── Auth Stack (usuario NO autenticado) ──────────────────────────
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}

// ── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
