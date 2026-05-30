import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

interface User {
  nombre: string;
  email: string;
  telefono?: string;
  dni?: string;
}

export default function AccountSettings() {
  const [user, setUser] = useState<User>({ nombre: '', email: '', telefono: '', dni: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showDniModal, setShowDniModal] = useState(false);
  const [dniLastChanged, setDniLastChanged] = useState<Date | null>(null);
  const [canChangeDni, setCanChangeDni] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', dni: '' });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const parsed = JSON.parse(userJson);
        setUser(parsed);
        setFormData({
          nombre: parsed.nombre || '',
          telefono: parsed.telefono || '',
          dni: parsed.dni || '',
        });
      }
      const lastChange = await AsyncStorage.getItem('lastDniChange');
      if (lastChange) {
        const lastDate = new Date(lastChange);
        setDniLastChanged(lastDate);
        const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        setCanChangeDni(daysSince >= 30);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo cargar la información' });
    }
  };

  const getDaysUntilDniChange = () => {
    if (!dniLastChanged || canChangeDni) return 0;
    const daysSince = Math.floor((Date.now() - dniLastChanged.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSince);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const updatedUser = { ...user, ...formData };
    if (!canChangeDni) {
      updatedUser.dni = user.dni ?? '';
    }
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    Toast.show({ type: 'success', text1: 'Actualizado', text2: 'Información guardada' });
  };

  const confirmDniChange = async () => {
    const updatedUser = { ...user, ...formData };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    await AsyncStorage.setItem('lastDniChange', new Date().toISOString());
    setUser(updatedUser);
    setCanChangeDni(false);
    setDniLastChanged(new Date());
    setShowDniModal(false);
    setIsEditing(false);
    Toast.show({ type: 'success', text1: 'DNI actualizado', text2: 'Podrás cambiarlo nuevamente en 30 días' });
  };

  const handleDniPress = () => {
    if (!canChangeDni) {
      Toast.show({ type: 'info', text1: 'No permitido', text2: `Espera ${getDaysUntilDniChange()} días para cambiar el DNI` });
      return;
    }
    setShowDniModal(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración de Cuenta</Text>
        <Text style={styles.subtitle}>Administra tu información personal</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Información Personal</Text>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => {
                setIsEditing(false);
                setFormData({ nombre: user.nombre, telefono: user.telefono || '', dni: user.dni || '' });
              }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Nombre */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre Completo</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={val => handleInputChange('nombre', val)}
            />
          ) : (
            <Text style={styles.value}>{user.nombre || 'No especificado'}</Text>
          )}
        </View>

        {/* Email (no editable) */}
        <View style={styles.field}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.emailRow}>
            <Text style={styles.value}>{user.email}</Text>
            <Text style={styles.badge}>No editable</Text>
          </View>
        </View>

        {/* Teléfono */}
        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.telefono}
              onChangeText={val => handleInputChange('telefono', val)}
              placeholder="+51 999 999 999"
            />
          ) : (
            <Text style={styles.value}>{user.telefono || 'No especificado'}</Text>
          )}
        </View>

        {/* DNI */}
        <View style={styles.field}>
          <Text style={styles.label}>DNI</Text>
          {isEditing ? (
            <>
              <TextInput
                style={[styles.input, !canChangeDni && styles.inputDisabled]}
                value={formData.dni}
                onChangeText={val => handleInputChange('dni', val)}
                maxLength={8}
                keyboardType="numeric"
                editable={canChangeDni}
              />
              {!canChangeDni && (
                <Text style={styles.warningText}>
                  Podrás cambiar tu DNI en {getDaysUntilDniChange()} días
                </Text>
              )}
              {formData.dni !== user.dni && canChangeDni && (
                <TouchableOpacity style={styles.dniButton} onPress={handleDniPress}>
                  <Text style={styles.dniButtonText}>Confirmar DNI</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.value}>{user.dni || 'No especificado'}</Text>
          )}
          <Text style={styles.hint}>⚠️ El DNI solo puede cambiarse una vez al mes</Text>
        </View>
      </View>

      {/* Modal de confirmación de DNI */}
      <Modal visible={showDniModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Text style={styles.modalIconText}>⚠️</Text>
            </View>
            <Text style={styles.modalTitle}>Confirmar cambio de DNI</Text>
            <Text style={styles.modalText}>
              Estás a punto de cambiar tu DNI a: <Text style={styles.modalBold}>{formData.dni}</Text>
            </Text>
            <Text style={styles.modalWarning}>
              Esta acción solo se puede realizar una vez cada 30 días. ¿Estás seguro?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDniModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={confirmDniChange}>
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6b7280' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 22, fontWeight: '600', color: '#111827' },
  editButton: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  editButtonText: { color: '#fff', fontWeight: '600' },
  actionButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#d1d5db' },
  cancelButtonText: { color: '#374151' },
  saveButton: { backgroundColor: '#16a34a', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  field: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  value: { fontSize: 16, fontWeight: '500', color: '#111827' },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, fontSize: 12, color: '#4b5563' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, backgroundColor: '#fff' },
  inputDisabled: { backgroundColor: '#f3f4f6', color: '#9ca3af' },
  warningText: { fontSize: 12, color: '#ea580c', marginTop: 4 },
  hint: { fontSize: 12, color: '#6b7280', marginTop: 8 },
  dniButton: { backgroundColor: '#ea580c', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  dniButtonText: { color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '85%', maxWidth: 400 },
  modalIcon: { alignItems: 'center', marginBottom: 12 },
  modalIconText: { fontSize: 40 },
  modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  modalText: { fontSize: 16, color: '#374151', textAlign: 'center', marginBottom: 8 },
  modalBold: { fontWeight: '700', color: '#111827' },
  modalWarning: { fontSize: 14, color: '#ea580c', textAlign: 'center', marginVertical: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  modalCancel: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center' },
  modalCancelText: { color: '#374151', fontWeight: '500' },
  modalConfirm: { flex: 1, backgroundColor: '#ea580c', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalConfirmText: { color: '#fff', fontWeight: '500' },
});