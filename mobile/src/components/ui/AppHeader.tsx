// components/ui/AppHeader.tsx
// MIGRACIÓN de: frontend/src/components/ui/Header.tsx + MobileHeader.tsx
// Custom header nativo integrado en screenOptions de React Navigation.
// Elimina: localStorage, window.location.href, DOM tags, className, Tailwind.

import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, shadows } from '../../styles/theme';
import { AuthContext } from '../../navigation/RootNavigator';

// Logo — usando texto estilizado hasta que se cargue el asset
// (el asset real está en mobile/assets/)
const LOGO_ASSET = require('../../assets/icon.png');

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showCreateEvent?: boolean;
  onCreateEvent?: () => void;
}

export default function AppHeader({
  title,
  showBack = false,
  onBack,
  showCreateEvent = false,
  onCreateEvent,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { signOut } = useContext(AuthContext) as { signIn: (t: string, u: object) => Promise<void>; signOut: () => Promise<void> };
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Leer el nombre del usuario desde AsyncStorage (reemplaza localStorage.getItem)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        if (raw) {
          const userData = JSON.parse(raw);
          setUserName(userData.nombre ?? '');
        }
      } catch {
        // Sin usuario → no mostrar nada
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut();
    // React Navigation re-renderizará automáticamente el Auth stack
  };

  const initial = userName.charAt(0).toUpperCase();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.container}>

        {/* ── Lado izquierdo: back button o logo ─────────────────────── */}
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity
              id="header-back-btn"
              onPress={onBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.logoRow}>
              <Image source={LOGO_ASSET} style={styles.logo} resizeMode="contain" />
              {title ? (
                <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
              ) : (
                <Text style={styles.brandText}>TeleTickers</Text>
              )}
            </View>
          )}
        </View>

        {/* ── Lado derecho: acciones de usuario ──────────────────────── */}
        <View style={styles.right}>
          {showCreateEvent && (
            <TouchableOpacity
              id="header-create-event-btn"
              style={styles.createEventBtn}
              onPress={onCreateEvent}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color={colors.white} />
              <Text style={styles.createEventText}>Crear</Text>
            </TouchableOpacity>
          )}

          {userName ? (
            <View>
              <TouchableOpacity
                id="header-user-menu-btn"
                style={styles.avatarBtn}
                onPress={() => setMenuOpen((v) => !v)}
                activeOpacity={0.85}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <Ionicons
                  name={menuOpen ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={colors.textSecondary}
                  style={{ marginLeft: 2 }}
                />
              </TouchableOpacity>

              {/* Dropdown menu */}
              {menuOpen && (
                <View style={styles.dropdown}>
                  <Text style={styles.dropdownUserName} numberOfLines={1}>{userName}</Text>

                  <View style={styles.dropdownDivider} />

                  <TouchableOpacity
                    id="header-menu-settings"
                    style={styles.dropdownItem}
                    onPress={() => setMenuOpen(false)}
                  >
                    <Ionicons name="settings-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.dropdownItemText}>Configuración</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    id="header-menu-help"
                    style={styles.dropdownItem}
                    onPress={() => setMenuOpen(false)}
                  >
                    <Ionicons name="help-circle-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.dropdownItemText}>Ayuda</Text>
                  </TouchableOpacity>

                  <View style={styles.dropdownDivider} />

                  <TouchableOpacity
                    id="header-menu-logout"
                    style={styles.dropdownItem}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out-outline" size={16} color={colors.error} />
                    <Text style={[styles.dropdownItemText, { color: colors.error }]}>
                      Cerrar Sesión
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    position: 'relative',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  brandText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  titleText: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  backBtn: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  createEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  createEventText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
  avatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: spacing.xs,
    borderRadius: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 44,
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 999,
    ...shadows.md,
    overflow: 'hidden',
  },
  dropdownUserName: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  dropdownDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  dropdownItemText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
});
