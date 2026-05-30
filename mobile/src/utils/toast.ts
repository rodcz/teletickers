// utils/toast.ts — Wrapper nativo sobre react-native-toast-message
// MIGRACIÓN: Elimina toda manipulación del DOM (document.createElement, document.body, etc.)
// Mantiene la misma API pública que el frontend web: showToast(message, type)

import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info';

/**
 * Muestra un toast nativo.
 * API idéntica al toast web original para compatibilidad con el resto del equipo.
 *
 * @param message - Texto a mostrar
 * @param type    - 'success' | 'error' | 'info' (default: 'success')
 */
export function showToast(message: string, type: ToastType = 'success'): void {
  Toast.show({
    type,
    text1: message,
    position: 'bottom',
    visibilityTime: 3000,
    autoHide: true,
    bottomOffset: 80, // Sobre la tab bar
  });
}

/**
 * Cierra el toast activo de forma programática.
 */
export function hideToast(): void {
  Toast.hide();
}
