// lib/apollo-client.ts — Cliente Apollo para React Native (Apollo Client v4)
// MIGRACIÓN: Reemplaza localStorage (web) por AsyncStorage (nativo)
// El authLink extrae el JWT de forma ASÍNCRONA según lo requiere el documento de migración

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/graphql' : 'http://localhost:8080/graphql';
const GRAPHQL_URL = process.env.EXPO_PUBLIC_GRAPHQL_URL ?? DEFAULT_URL;

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

// authLink asíncrono: extrae el JWT de AsyncStorage antes de cada request
// Usa Observable de @apollo/client para manejar la lectura asíncrona del token
const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    let subscription: { unsubscribe: () => void } | undefined;

    AsyncStorage.getItem('token')
      .then((token) => {
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : '',
          },
        });
      })
      .then(() => {
        subscription = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch((err) => observer.error(err));

    return () => subscription?.unsubscribe();
  });
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});

/** Helpers de sesión — usados por RootNavigator y las pantallas de auth */
export const SESSION_TOKEN_KEY = 'token';
export const SESSION_USER_KEY = 'user';

export async function saveSession(token: string, user: object): Promise<void> {
  await AsyncStorage.multiSet([
    [SESSION_TOKEN_KEY, token],
    [SESSION_USER_KEY, JSON.stringify(user)],
  ]);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([SESSION_TOKEN_KEY, SESSION_USER_KEY]);
  await client.clearStore();
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_TOKEN_KEY);
}

export async function getUser<T = Record<string, unknown>>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(SESSION_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
