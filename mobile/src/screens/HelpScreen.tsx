import React, { useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const FAQ_CATEGORIES = [
  {
    title: 'Compra de Tickets',
    icon: '🎫',
    questions: [
      {
        q: '¿Cómo compro tickets?',
        a: 'Para comprar tickets, navega al evento que te interesa, selecciona la cantidad de entradas y procede al pago. Recibirás tus tickets digitales por correo electrónico.',
      },
      {
        q: '¿Puedo cancelar mi compra?',
        a: 'Las cancelaciones están sujetas a la política de cada evento. Revisa los términos específicos antes de comprar.',
      },
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Aceptamos tarjetas de crédito, débito, Yape y Plin.',
      },
    ],
  },
  {
    title: 'Mi Cuenta',
    icon: '👤',
    questions: [
      {
        q: '¿Cómo cambio mi información personal?',
        a: 'Ve a Configuración de Cuenta desde el menú de tu perfil. Ahí podrás actualizar tu nombre, teléfono y DNI (este último solo una vez al mes).',
      },
      {
        q: '¿Por qué solo puedo cambiar mi DNI una vez al mes?',
        a: 'Por seguridad, limitamos los cambios de DNI a una vez cada 30 días para proteger tu cuenta contra uso fraudulento.',
      },
      {
        q: '¿Cómo recupero mi contraseña?',
        a: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones enviadas a tu correo.',
      },
    ],
  },
  {
    title: 'Crear Eventos',
    icon: '📅',
    questions: [
      {
        q: '¿Cómo creo un evento?',
        a: 'Haz clic en "Crear Evento" en el header, completa la información del evento, configura los tickets y métodos de pago, y publica tu evento.',
      },
      {
        q: '¿Cuánto cuesta publicar un evento?',
        a: 'La publicación de eventos es gratuita. Solo cobramos una pequeña comisión por cada ticket vendido.',
      },
      {
        q: '¿Puedo editar mi evento después de publicarlo?',
        a: 'Sí, puedes editar la información de tu evento en cualquier momento desde "Mis Eventos".',
      },
    ],
  },
  {
    title: 'Problemas Técnicos',
    icon: '🔧',
    questions: [
      {
        q: 'No recibí mis tickets por correo',
        a: 'Verifica tu carpeta de spam. Si no los encuentras, contacta a soporte con tu número de orden.',
      },
      {
        q: 'La app no carga correctamente',
        a: 'Intenta cerrar y volver a abrir la aplicación. Si el problema persiste, contáctanos.',
      },
      {
        q: '¿Cómo descargo mis tickets?',
        a: 'Puedes ver tus tickets desde la sección "Mis Tickets" en tu perfil, o directamente desde el correo de confirmación.',
      },
    ],
  },
];

const CONTACTS = [
  {
    title: 'Email',
    subtitle: 'Respuesta en 24 horas',
    value: 'soporte@ticky.com',
    color: '#3B82F6',
    icon: '✉️',
    url: 'mailto:soporte@ticky.com',
  },
  {
    title: 'WhatsApp',
    subtitle: 'Respuesta inmediata',
    value: '+51 999 999 999',
    color: '#16A34A',
    icon: '💬',
    url: 'https://wa.me/51999999999',
  },
  {
    title: 'Chat en Vivo',
    subtitle: 'Lun - Vie: 9am - 6pm',
    value: 'Iniciar chat',
    color: '#8B5CF6',
    icon: '🟣',
    url: null,
  },
];

export default function HelpScreen() {
  const [search, setSearch] = useState('');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return FAQ_CATEGORIES;
    return FAQ_CATEGORIES.map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(term) ||
          item.a.toLowerCase().includes(term)
      ),
    })).filter((category) => category.questions.length > 0);
  }, [search]);

  const toggleQuestion = (key: string) =>
    setOpenQuestion((prev) => (prev === key ? null : key));

  const openContact = async (url: string | null) => {
    if (!url) {
      Toast.show({ type: 'info', text1: 'Chat en vivo próximamente' });
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Toast.show({ type: 'error', text1: 'No se pudo abrir el enlace' });
    }
  };

  const handleSubmit = () => {
    if (!contactForm.nombre || !contactForm.email || !contactForm.mensaje) {
      Toast.show({
        type: 'error',
        text1: 'Faltan datos',
        text2: 'Completa nombre, correo y mensaje.',
      });
      return;
    }
    Toast.show({
      type: 'success',
      text1: 'Mensaje enviado',
      text2: 'Nos pondremos en contacto contigo pronto.',
    });
    setContactForm({ nombre: '', email: '', asunto: '', mensaje: '' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>¿Cómo podemos ayudarte?</Text>
        <Text style={styles.subtitle}>
          Encuentra respuestas rápidas o contáctanos directamente
        </Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en ayuda..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        {filteredCategories.length === 0 ? (
          <Text style={styles.muted}>
            No encontramos resultados para “{search}”.
          </Text>
        ) : (
          filteredCategories.map((category) => (
            <View key={category.title} style={styles.faqCard}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqIcon}>{category.icon}</Text>
                <Text style={styles.faqCategory}>{category.title}</Text>
              </View>
              {category.questions.map((item, index) => {
                const key = `${category.title}-${index}`;
                const open = openQuestion === key;
                return (
                  <View key={key} style={styles.questionWrap}>
                    <Pressable
                      accessibilityRole="button"
                      style={styles.questionRow}
                      onPress={() => toggleQuestion(key)}
                    >
                      <Text style={styles.questionText}>{item.q}</Text>
                      <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
                    </Pressable>
                    {open && <Text style={styles.answerText}>{item.a}</Text>}
                  </View>
                );
              })}
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Contacto directo</Text>
        <View style={styles.contactsGrid}>
          {CONTACTS.map((contact) => (
            <Pressable
              key={contact.title}
              accessibilityRole="button"
              style={[styles.contactCard, { backgroundColor: contact.color }]}
              onPress={() => openContact(contact.url)}
            >
              <Text style={styles.contactIcon}>{contact.icon}</Text>
              <Text style={styles.contactTitle}>{contact.title}</Text>
              <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
              <Text style={styles.contactValue}>{contact.value}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>¿Aún necesitas ayuda?</Text>
          <Text style={styles.muted}>
            Envíanos un mensaje y te responderemos lo antes posible.
          </Text>

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#94A3B8"
            value={contactForm.nombre}
            onChangeText={(nombre) => setContactForm({ ...contactForm, nombre })}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={contactForm.email}
            onChangeText={(email) => setContactForm({ ...contactForm, email })}
          />

          <Text style={styles.label}>Asunto</Text>
          <TextInput
            style={styles.input}
            placeholder="¿En qué podemos ayudarte?"
            placeholderTextColor="#94A3B8"
            value={contactForm.asunto}
            onChangeText={(asunto) => setContactForm({ ...contactForm, asunto })}
          />

          <Text style={styles.label}>Mensaje</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe tu problema o consulta..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={contactForm.mensaje}
            onChangeText={(mensaje) => setContactForm({ ...contactForm, mensaje })}
          />

          <Pressable
            accessibilityRole="button"
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Enviar mensaje</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 15,
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  sectionTitle: {
    marginTop: 26,
    marginBottom: 12,
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
  },
  muted: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
  faqCard: {
    borderRadius: 18,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  faqIcon: {
    fontSize: 26,
  },
  faqCategory: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  questionWrap: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  questionText: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  chevron: {
    color: '#94A3B8',
    fontSize: 12,
  },
  answerText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    paddingBottom: 14,
  },
  contactsGrid: {
    gap: 12,
  },
  contactCard: {
    borderRadius: 18,
    padding: 18,
  },
  contactIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  contactTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  contactSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  contactValue: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  formCard: {
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 110,
  },
  submitButton: {
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#2563EB',
    paddingVertical: 15,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
});
