// App.tsx — Entry point principal de TeleTickers Mobile
// MIGRACIÓN de: frontend/src/layouts/Layout.astro
//
// Providers en orden:
//   GestureHandlerRootView  → requerido por react-native-gesture-handler
//   SafeAreaProvider        → insets para header/tab bar
//   ApolloProvider          → cliente GraphQL con JWT asíncrono
//   NavigationContainer     → React Navigation (root)
//   RootNavigator           → auth gate (Login ↔ TabNavigator)
//   Toast                   → react-native-toast-message (posición bottom)
//
// OMITIDO intencionalmente: Footer.tsx (no aplica en experiencia nativa de app)

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client/react';
import Toast from 'react-native-toast-message';

import { client } from './src/lib/apollo-client';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/styles/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <NavigationContainer>
            {/* StatusBar oscura, coherente con el tema oscuro de la app */}
            <StatusBar style="light" />

            {/* Navegación raíz con auth gate */}
            <RootNavigator />
          </NavigationContainer>

          {/* Toast nativo — debe estar FUERA del NavigationContainer
              pero DENTRO del ApolloProvider para acceso al cliente si es necesario */}
          <Toast />
        </ApolloProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
