import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useMutation } from '@apollo/client/react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { REGISTER_MUTATION } from '../../lib/graphql/mutations';
import { useAuth } from '../../context/AuthContext';
import type { AuthPayload } from '../../types';

interface RegisterData {
  register: AuthPayload;
}

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    dni: '',
    numeroCel: '',
  });
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const navigation = useNavigation<any>();
  const [register, { loading }] = useMutation<RegisterData>(REGISTER_MUTATION);

  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === 'dni' && value.length > 8) return;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const { data } = await register({ variables: form });
      if (data?.register) {
        Toast.show({
          type: 'success',
          text1: 'Registro exitoso',
          text2: 'Bienvenido a Ticky 🎉',
        });
        await signIn(data.register.token, data.register.user);
      }
    } catch (err: any) {
      const message = err.message || 'Error al registrarse';
      setError(message);
      Toast.show({ type: 'error', text1: 'Error', text2: message });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#9ca3af"
        value={form.nombre}
        onChangeText={val => handleChange('nombre', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="DNI (8 dígitos)"
        placeholderTextColor="#9ca3af"
        keyboardType="numeric"
        maxLength={8}
        value={form.dni}
        onChangeText={val => handleChange('dni', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={val => handleChange('email', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono (opcional)"
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        value={form.numeroCel}
        onChangeText={val => handleChange('numeroCel', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={form.password}
        onChangeText={val => handleChange('password', val)}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}> Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#4b5563', fontSize: 14 },
  link: { color: '#16a34a', fontWeight: '600', fontSize: 14 },
});